import { createServer } from "http";
import { readFile, writeFile, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_FILE = path.join(__dirname, "data", "state.json");
const ENV_FILE = path.join(__dirname, ".env");
const PORT = Number(process.env.PORT || 8787);

function parseEnv(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    out[key] = value;
  }
  return out;
}

async function loadLocalEnv() {
  try {
    const txt = await readFile(ENV_FILE, "utf8");
    return parseEnv(txt);
  } catch {
    return {};
  }
}

async function readState() {
  const text = await readFile(DATA_FILE, "utf8");
  return JSON.parse(text);
}

async function writeState(state) {
  await writeFile(DATA_FILE, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function dayNameInTimezone(date, tz) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: tz })
    .format(date)
    .toLowerCase();
}

function minutesNowInTimezone(date, tz) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

function parseHm(hm) {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

function isInLearningWindow(state, now = new Date()) {
  const tz = state.profile?.timezone || "Europe/Bucharest";
  const day = dayNameInTimezone(now, tz);
  const windows = state.schedule?.[day] || [];
  const current = minutesNowInTimezone(now, tz);
  return windows.some(([from, to]) => current >= parseHm(from) && current <= parseHm(to));
}

function hoursSince(iso, now = new Date()) {
  if (!iso) return Infinity;
  const ms = now.getTime() - new Date(iso).getTime();
  return ms / (1000 * 60 * 60);
}

function computeReadiness(state) {
  const core = state.concepts.filter((c) => c.priority === "core");
  if (!core.length) return 0;
  const avg = core.reduce((sum, c) => sum + c.mastery, 0) / core.length;
  return Math.round(avg);
}

function computeDealBreakerCoverage(state) {
  const target = state.concepts.filter((c) => c.dealBreaker);
  if (!target.length) return 0;
  const mastered = target.filter((c) => c.mastery >= 70).length;
  return Math.round((mastered / target.length) * 100);
}

function localCoachFeedback(state, payload) {
  const c = state.concepts.find((x) => x.id === payload.conceptId);
  const confidence = Number(payload.confidence || 0);
  const strengths = [];
  const gaps = [];
  const plan = [];

  if (confidence >= 70) strengths.push("Ai dat un scor bun de incredere pe concept.");
  if ((payload.recallAnswer || "").length > 180) strengths.push("Raspunsul de active recall este detaliat.");
  if (confidence < 60) gaps.push("Incredere sub pragul de 60%; probabil ai nevoie de o recapitulare structurata.");
  if ((payload.recallAnswer || "").length < 100) gaps.push("Raspunsul e scurt; verifica definitie + exemplu + pitfalls.");

  const nextDays = confidence >= 75 ? [3, 7] : [1, 3];
  for (const d of nextDays) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    plan.push(`Repeta ${c?.name || "conceptul"} peste ${d} zi(le): ${date.toISOString().slice(0, 10)}`);
  }

  if (c?.dealBreaker && confidence < 70) {
    gaps.push("Acesta e deal-breaker topic; ridica-l la min. 70% pana la urmatorul check-in.");
  }

  return {
    mode: "local-fallback",
    strengths,
    gaps,
    nextActions: plan,
    verdict: confidence >= 70 ? "all_good_with_minor_gaps" : "needs_reinforcement"
  };
}

async function aiCoachFeedback(state, payload) {
  const envLocal = await loadLocalEnv();
  const apiKey = process.env.OPENAI_API_KEY || envLocal.OPENAI_API_KEY;
  if (!apiKey) {
    return localCoachFeedback(state, payload);
  }

  const prompt = {
    role: "system",
    content:
      "You are a strict interview trainer. Give concise, practical Romanian feedback. Return JSON only with keys: strengths (string[]), gaps (string[]), nextActions (string[]), verdict (string)."
  };

  const user = {
    role: "user",
    content: JSON.stringify(
      {
        now: new Date().toISOString(),
        schedule: state.schedule,
        profile: state.profile,
        concept: state.concepts.find((c) => c.id === payload.conceptId) || null,
        submission: payload,
        goals: [
          "Prioritize high-probability interview theory topics",
          "Enforce spaced repetition",
          "Call out deal-breakers"
        ]
      },
      null,
      2
    )
  };

  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [prompt, user],
      text: { format: { type: "json_object" } }
    })
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error(`OpenAI error ${r.status}: ${text}`);
  }

  const data = await r.json();
  const output = data.output_text || "{}";
  let parsed = {};
  try {
    parsed = JSON.parse(output);
  } catch {
    parsed = { verdict: "invalid_ai_output", strengths: [], gaps: ["AI output invalid JSON"], nextActions: [] };
  }

  return { mode: "openai", ...parsed };
}

function guessContentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "text/plain; charset=utf-8";
}

async function serveStatic(req, res) {
  let urlPath = req.url?.split("?")[0] || "/";
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(PUBLIC_DIR, path.normalize(urlPath).replace(/^\/+/, ""));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    await stat(filePath);
    const content = await readFile(filePath);
    res.writeHead(200, { "Content-Type": guessContentType(filePath) });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

createServer(async (req, res) => {
  try {
    if (!req.url) return sendJson(res, 400, { error: "Invalid URL" });

    if (req.url.startsWith("/api/state") && req.method === "GET") {
      const state = await readState();
      return sendJson(res, 200, {
        state,
        computed: {
          readiness: computeReadiness(state),
          dealBreakerCoverage: computeDealBreakerCoverage(state),
          inLearningWindow: isInLearningWindow(state),
          hoursSinceLastStudy: hoursSince(state.meta?.lastStudyAt)
        }
      });
    }

    if (req.url.startsWith("/api/state") && req.method === "PUT") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        const parsed = JSON.parse(body || "{}");
        await writeState(parsed.state || parsed);
        sendJson(res, 200, { ok: true });
      });
      return;
    }

    if (req.url.startsWith("/api/checkin") && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        const payload = JSON.parse(body || "{}");
        const state = await readState();

        const entry = {
          id: `ci_${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...payload
        };

        state.checkins.push(entry);
        state.meta.lastStudyAt = entry.createdAt;

        const concept = state.concepts.find((c) => c.id === payload.conceptId);
        if (concept) {
          concept.lastReviewed = entry.createdAt.slice(0, 10);
          const conf = Number(payload.confidence || 0);
          concept.mastery = Math.max(0, Math.min(100, Math.round((concept.mastery * 0.7) + (conf * 0.3))));
          const repeatDays = conf >= 75 ? 3 : conf >= 60 ? 2 : 1;
          const nd = new Date();
          nd.setDate(nd.getDate() + repeatDays);
          concept.nextReview = nd.toISOString().slice(0, 10);
        }

        let ai;
        try {
          ai = await aiCoachFeedback(state, payload);
          state.meta.lastAiFeedbackAt = new Date().toISOString();
        } catch (e) {
          ai = {
            mode: "local-fallback",
            strengths: [],
            gaps: [String(e.message || e)],
            nextActions: ["Fallback la feedback local. Verifica OPENAI_API_KEY."],
            verdict: "fallback_error"
          };
        }

        await writeState(state);
        sendJson(res, 200, { ok: true, ai, state });
      });
      return;
    }

    if (req.url.startsWith("/api/reminders") && req.method === "GET") {
      const state = await readState();
      const inWindow = isInLearningWindow(state);
      const h = hoursSince(state.meta?.lastStudyAt);
      const reminders = [];
      if (inWindow && h >= 2) {
        reminders.push({
          type: "study_gap",
          severity: h >= 3 ? "high" : "medium",
          message: `Nu ai mai lucrat de ${h.toFixed(1)} ore. Fa un sprint de 20-25 min.`
        });
      }

      const weakDealBreakers = state.concepts.filter((c) => c.dealBreaker && c.mastery < 70);
      if (weakDealBreakers.length) {
        reminders.push({
          type: "deal_breaker",
          severity: "high",
          message: `Deal-breakers sub 70%: ${weakDealBreakers.map((x) => x.name).join(", ")}`
        });
      }

      sendJson(res, 200, { reminders });
      return;
    }

    await serveStatic(req, res);
  } catch (e) {
    sendJson(res, 500, { error: String(e.message || e) });
  }
}).listen(PORT, () => {
  console.log(`Trainer Mode running on http://localhost:${PORT}`);
});
