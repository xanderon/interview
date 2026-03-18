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

const TODAY = () => new Date().toISOString().slice(0, 10);

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

function slug(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mkProblem(title, track = "core") {
  return {
    id: `p_${slug(title)}`,
    title,
    track,
    status: "todo",
    difficulty: "",
    docsUrl: "",
    solutionPath: "",
    notes: "",
    mastery: 0,
    confidenceHistory: [],
    lastReviewed: null,
    nextReview: null
  };
}

function defaultCategories() {
  return [
    {
      id: "array",
      name: "1) Array",
      phase: "Faza 1 - Fundatia",
      focus: [
        "parcurgere simpla",
        "prefix/sufix",
        "intervale",
        "mutare in-place",
        "array + hashmap",
        "greedy de baza"
      ],
      problems: [
        mkProblem("Two Sum", "core"),
        mkProblem("Best Time to Buy and Sell Stock", "core"),
        mkProblem("Contains Duplicate", "core"),
        mkProblem("Product of Array Except Self", "core"),
        mkProblem("Maximum Subarray", "core"),
        mkProblem("Merge Intervals", "core"),
        mkProblem("Insert Interval", "core"),
        mkProblem("Rotate Image", "core"),
        mkProblem("Spiral Matrix", "core"),
        mkProblem("Jump Game", "core"),
        mkProblem("Remove Duplicates from Sorted Array", "optional"),
        mkProblem("Remove Element", "optional"),
        mkProblem("Group Anagrams", "optional"),
        mkProblem("Longest Common Prefix", "optional")
      ]
    },
    {
      id: "binary-search",
      name: "2) Binary Search",
      phase: "Faza 1 - Fundatia",
      focus: [
        "exact find",
        "first/last occurrence",
        "answer space",
        "first true / last false",
        "evitarea infinite loop"
      ],
      problems: [
        mkProblem("Binary Search", "core"),
        mkProblem("Search Insert Position", "core"),
        mkProblem("Find First and Last Position of Element in Sorted Array", "core"),
        mkProblem("Search in Rotated Sorted Array", "core"),
        mkProblem("Find Minimum in Rotated Sorted Array", "core"),
        mkProblem("Search a 2D Matrix", "core"),
        mkProblem("Sqrt(x)", "core"),
        mkProblem("First Bad Version", "core"),
        mkProblem("Find Peak Element", "core"),
        mkProblem("Search in Rotated Sorted Array II", "optional"),
        mkProblem("Kth Smallest Element in a Sorted Matrix", "optional"),
        mkProblem("Time Based Key-Value Store", "optional")
      ]
    },
    {
      id: "stack",
      name: "3) Stack",
      phase: "Faza 1 - Fundatia",
      focus: [
        "stack de validare",
        "monotonic stack",
        "parsing simplu",
        "last seen relevant thing"
      ],
      problems: [
        mkProblem("Valid Parentheses", "core"),
        mkProblem("Min Stack", "core"),
        mkProblem("Evaluate Reverse Polish Notation", "core"),
        mkProblem("Daily Temperatures", "core"),
        mkProblem("Car Fleet", "core"),
        mkProblem("Basic Calculator II", "core"),
        mkProblem("Decode String", "core"),
        mkProblem("Largest Rectangle in Histogram", "core"),
        mkProblem("Simplify Path", "optional"),
        mkProblem("Remove K Digits", "optional")
      ]
    },
    {
      id: "linked-list",
      name: "4) Linked List",
      phase: "Faza 2 - Pointeri si arbori",
      focus: [
        "dummy node",
        "slow/fast pointers",
        "reverse list",
        "split + merge",
        "cum nu pierzi referinte"
      ],
      problems: [
        mkProblem("Reverse Linked List", "core"),
        mkProblem("Merge Two Sorted Lists", "core"),
        mkProblem("Linked List Cycle", "core"),
        mkProblem("Linked List Cycle II", "core"),
        mkProblem("Remove Nth Node From End of List", "core"),
        mkProblem("Reorder List", "core"),
        mkProblem("Copy List with Random Pointer", "core"),
        mkProblem("Add Two Numbers", "core"),
        mkProblem("LRU Cache", "core"),
        mkProblem("Palindrome Linked List", "optional"),
        mkProblem("Swap Nodes in Pairs", "optional")
      ]
    },
    {
      id: "binary-tree",
      name: "5) Binary Tree",
      phase: "Faza 2 - Pointeri si arbori",
      focus: [
        "recursive DFS",
        "iterative DFS",
        "queue pentru BFS",
        "preorder / inorder / postorder",
        "BST rules",
        "ce returnezi din recursie"
      ],
      problems: [
        mkProblem("Maximum Depth of Binary Tree", "core"),
        mkProblem("Same Tree", "core"),
        mkProblem("Invert Binary Tree", "core"),
        mkProblem("Binary Tree Inorder Traversal", "core"),
        mkProblem("Binary Tree Level Order Traversal", "core"),
        mkProblem("Validate Binary Search Tree", "core"),
        mkProblem("Lowest Common Ancestor of a Binary Search Tree", "core"),
        mkProblem("Binary Tree Right Side View", "core"),
        mkProblem("Diameter of Binary Tree", "core"),
        mkProblem("Kth Smallest Element in a BST", "core"),
        mkProblem("Construct Binary Tree from Preorder and Inorder Traversal", "optional"),
        mkProblem("Binary Tree Maximum Path Sum", "optional"),
        mkProblem("Path Sum", "optional"),
        mkProblem("Serialize and Deserialize Binary Tree", "optional")
      ]
    },
    {
      id: "queue",
      name: "6) Queue",
      phase: "Faza 3 - Completare",
      focus: [
        "FIFO real",
        "simulare de coada",
        "BFS support",
        "stream processing simplu"
      ],
      problems: [
        mkProblem("Implement Queue using Stacks", "core"),
        mkProblem("Implement Stack using Queues", "core"),
        mkProblem("Number of Recent Calls", "core"),
        mkProblem("Moving Average from Data Stream", "core"),
        mkProblem("Design Circular Queue", "core"),
        mkProblem("Dota2 Senate", "core"),
        mkProblem("Time Needed to Buy Tickets", "core"),
        mkProblem("Design Hit Counter", "optional")
      ]
    },
    {
      id: "recursion",
      name: "7) Recursion",
      phase: "Faza 3 - Completare",
      focus: [
        "cazul de baza",
        "subproblema",
        "ce returneaza apelul recursiv",
        "cum eviti stack overflow logic"
      ],
      problems: [
        mkProblem("Pow(x, n)", "core"),
        mkProblem("Fibonacci Number", "core"),
        mkProblem("Reverse Linked List", "core"),
        mkProblem("Merge Two Sorted Lists", "core"),
        mkProblem("Palindrome Linked List", "core"),
        mkProblem("Decode String", "core"),
        mkProblem("Different Ways to Add Parentheses", "core"),
        mkProblem("K-th Symbol in Grammar", "optional")
      ]
    },
    {
      id: "matrix",
      name: "8) Matrix",
      phase: "Faza 3 - Completare",
      focus: [
        "boundary traversal",
        "row/col thinking",
        "BFS/DFS pe grid",
        "vizitat / in-bounds checks"
      ],
      problems: [
        mkProblem("Valid Sudoku", "core"),
        mkProblem("Rotate Image", "core"),
        mkProblem("Spiral Matrix", "core"),
        mkProblem("Set Matrix Zeroes", "core"),
        mkProblem("Search a 2D Matrix", "core"),
        mkProblem("Number of Islands", "core"),
        mkProblem("Flood Fill", "core"),
        mkProblem("Walls and Gates", "core"),
        mkProblem("Surrounded Regions", "optional")
      ]
    }
  ];
}

function defaultState() {
  return {
    profile: {
      name: "Xan",
      timezone: "Europe/Bucharest",
      goal: "Parcurg roadmap-ul de algoritmi pe categorii si rezolv problemele cu disciplina"
    },
    schedule: {
      monday: [["09:00", "21:30"]],
      tuesday: [["16:00", "22:00"]],
      wednesday: [["16:00", "22:00"]],
      thursday: [["16:00", "22:00"]],
      friday: [["18:00", "21:00"]],
      saturday: [["10:00", "14:00"]],
      sunday: [["10:00", "13:00"]]
    },
    phases: [
      {
        id: "phase-1",
        title: "Faza 1 - fundatia",
        categories: ["1) Array", "2) Binary Search", "3) Stack"]
      },
      {
        id: "phase-2",
        title: "Faza 2 - pointeri si arbori",
        categories: ["4) Linked List", "5) Binary Tree", "BFS/DFS pe tree si matrix"]
      },
      {
        id: "phase-3",
        title: "Faza 3 - completare",
        categories: ["6) Queue", "7) Recursion", "8) Matrix"]
      }
    ],
    algorithmCategories: defaultCategories(),
    hiddenTheory: {
      title: "Teorie secundara (ascunsa)",
      notes: [
        "DFS/BFS la graph separat doar daca ramane timp",
        "Concentreaza explicatiile pe patternuri, nu pe memorare",
        "Documenteaza fiecare rezolvare cu trade-offs si complexitate"
      ]
    },
    checkins: [],
    meta: {
      lastStudyAt: null,
      lastAiFeedbackAt: null,
      lastReminderAt: null
    }
  };
}

function flattenProblems(state) {
  const out = [];
  for (const category of state.algorithmCategories || []) {
    for (const problem of category.problems || []) {
      out.push({ category, problem });
    }
  }
  return out;
}

function findProblem(state, problemId) {
  for (const category of state.algorithmCategories || []) {
    const found = (category.problems || []).find((p) => p.id === problemId);
    if (found) return { category, problem: found };
  }
  return null;
}

function ensureUniqueIds(state) {
  const seen = new Set();
  for (const category of state.algorithmCategories || []) {
    for (const problem of category.problems || []) {
      let candidate = problem.id || `p_${slug(problem.title)}`;
      let suffix = 2;
      while (seen.has(candidate)) {
        candidate = `${problem.id || `p_${slug(problem.title)}`}-${suffix++}`;
      }
      problem.id = candidate;
      seen.add(candidate);
    }
  }
}

function normalizeState(raw) {
  const base = defaultState();

  if (!raw || typeof raw !== "object") return base;

  const state = {
    ...base,
    ...raw,
    profile: { ...base.profile, ...(raw.profile || {}) },
    schedule: { ...base.schedule, ...(raw.schedule || {}) },
    hiddenTheory: { ...base.hiddenTheory, ...(raw.hiddenTheory || {}) },
    meta: { ...base.meta, ...(raw.meta || {}) },
    phases: Array.isArray(raw.phases) && raw.phases.length ? raw.phases : base.phases,
    checkins: Array.isArray(raw.checkins) ? raw.checkins : []
  };

  const migratedFromConcepts = Array.isArray(raw.concepts) || Array.isArray(raw.tasks);
  if (!Array.isArray(raw.algorithmCategories) || !raw.algorithmCategories.length || migratedFromConcepts) {
    state.algorithmCategories = base.algorithmCategories;
  } else {
    state.algorithmCategories = raw.algorithmCategories;
  }

  for (const category of state.algorithmCategories) {
    category.focus = Array.isArray(category.focus) ? category.focus : [];
    category.problems = Array.isArray(category.problems) ? category.problems : [];
    for (const p of category.problems) {
      p.status = ["todo", "in_progress", "done"].includes(p.status) ? p.status : "todo";
      p.track = p.track === "optional" ? "optional" : "core";
      p.difficulty = p.difficulty || "";
      p.docsUrl = p.docsUrl || "";
      p.solutionPath = p.solutionPath || "";
      p.notes = p.notes || "";
      p.mastery = Number.isFinite(Number(p.mastery)) ? Math.max(0, Math.min(100, Number(p.mastery))) : 0;
      p.confidenceHistory = Array.isArray(p.confidenceHistory) ? p.confidenceHistory : [];
      p.lastReviewed = p.lastReviewed || null;
      p.nextReview = p.nextReview || null;
    }
  }

  ensureUniqueIds(state);
  return state;
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
  return normalizeState(JSON.parse(text));
}

async function writeState(state) {
  await writeFile(DATA_FILE, `${JSON.stringify(normalizeState(state), null, 2)}\n`, "utf8");
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
  const core = flattenProblems(state).filter(({ problem }) => problem.track === "core");
  if (!core.length) return 0;
  const done = core.filter(({ problem }) => problem.status === "done").length;
  return Math.round((done / core.length) * 100);
}

function computeFoundationCoverage(state) {
  const foundationIds = new Set(["array", "binary-search", "stack"]);
  const base = flattenProblems(state).filter(({ category, problem }) => foundationIds.has(category.id) && problem.track === "core");
  if (!base.length) return 0;
  const done = base.filter(({ problem }) => problem.status === "done").length;
  return Math.round((done / base.length) * 100);
}

function dueProblemCount(state) {
  const today = TODAY();
  return flattenProblems(state).filter(({ problem }) => problem.nextReview && problem.nextReview <= today && problem.status !== "done").length;
}

function localCoachFeedback(state, payload) {
  const found = findProblem(state, payload.problemId);
  const confidence = Number(payload.confidence || 0);
  const strengths = [];
  const gaps = [];
  const plan = [];

  if (confidence >= 70) strengths.push("Ai trecut pragul de incredere 70% pe problema selectata.");
  if ((payload.recallAnswer || "").length > 180) strengths.push("Explicatia ta de recall este detaliata.");
  if (confidence < 60) gaps.push("Incredere sub 60%; refa problema fara sa te uiti pe solutie.");
  if ((payload.recallAnswer || "").length < 90) gaps.push("Adauga pattern, complexitate si edge cases in rezolvare.");

  const title = found?.problem?.title || "problema";
  const nextDays = confidence >= 75 ? [3, 7] : [1, 3];
  for (const d of nextDays) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    plan.push(`Repeta ${title} peste ${d} zi(le): ${date.toISOString().slice(0, 10)}`);
  }

  if (found?.problem?.track === "core" && confidence < 70) {
    gaps.push("Este problema core in roadmap, tinta minima este 70%.");
  }

  return {
    mode: "local-fallback",
    strengths,
    gaps,
    nextActions: plan,
    verdict: confidence >= 70 ? "on_track" : "needs_reinforcement"
  };
}

async function aiCoachFeedback(state, payload) {
  const envLocal = await loadLocalEnv();
  const apiKey = process.env.OPENAI_API_KEY || envLocal.OPENAI_API_KEY;
  if (!apiKey) {
    return localCoachFeedback(state, payload);
  }

  const found = findProblem(state, payload.problemId);

  const prompt = {
    role: "system",
    content:
      "You are a strict algorithm interview trainer. Give concise, practical Romanian feedback. Return JSON only with keys: strengths (string[]), gaps (string[]), nextActions (string[]), verdict (string)."
  };

  const user = {
    role: "user",
    content: JSON.stringify(
      {
        now: new Date().toISOString(),
        profile: state.profile,
        roadmap: state.phases,
        selectedProblem: found,
        submission: payload,
        goals: [
          "Focus on algorithm roadmap categories and core problems",
          "Enforce consistency and spaced repetition",
          "Prioritize concrete problem-solving clarity"
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
          foundationCoverage: computeFoundationCoverage(state),
          inLearningWindow: isInLearningWindow(state),
          hoursSinceLastStudy: hoursSince(state.meta?.lastStudyAt),
          dueProblems: dueProblemCount(state)
        }
      });
    }

    if (req.url.startsWith("/api/state") && req.method === "PUT") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        const parsed = JSON.parse(body || "{}");
        const nextState = normalizeState(parsed.state || parsed);
        await writeState(nextState);
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

        const found = findProblem(state, payload.problemId);
        if (found) {
          const conf = Math.max(0, Math.min(100, Number(payload.confidence || 0)));
          found.problem.lastReviewed = TODAY();
          found.problem.mastery = Math.round(found.problem.mastery * 0.65 + conf * 0.35);
          found.problem.confidenceHistory.push({ at: entry.createdAt, confidence: conf });
          const repeatDays = conf >= 75 ? 3 : conf >= 60 ? 2 : 1;
          const nd = new Date();
          nd.setDate(nd.getDate() + repeatDays);
          found.problem.nextReview = nd.toISOString().slice(0, 10);
          if (conf >= 75) found.problem.status = "done";
          else if (found.problem.status === "todo") found.problem.status = "in_progress";
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
        sendJson(res, 200, { ok: true, ai, state: normalizeState(state) });
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
          message: `Nu ai mai lucrat de ${h.toFixed(1)} ore. Fa un sprint de 25 min pe o problema core.`
        });
      }

      const due = flattenProblems(state)
        .filter(({ problem }) => problem.nextReview && problem.nextReview <= TODAY() && problem.status !== "done")
        .slice(0, 4);
      if (due.length) {
        reminders.push({
          type: "due_reviews",
          severity: "high",
          message: `Ai review due la: ${due.map((x) => x.problem.title).join(", ")}`
        });
      }

      const weakCore = flattenProblems(state).filter(({ problem }) => problem.track === "core" && problem.mastery > 0 && problem.mastery < 70);
      if (weakCore.length) {
        reminders.push({
          type: "core_mastery",
          severity: "medium",
          message: `Core sub 70% mastery: ${weakCore.slice(0, 4).map((x) => x.problem.title).join(", ")}`
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
