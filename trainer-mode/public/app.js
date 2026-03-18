let state = null;
let computed = null;
let persistQueue = Promise.resolve();

const el = {
  headerSub: document.getElementById("headerSub"),
  readiness: document.getElementById("readiness"),
  foundationCoverage: document.getElementById("foundationCoverage"),
  hoursGap: document.getElementById("hoursGap"),
  dueProblems: document.getElementById("dueProblems"),
  windowState: document.getElementById("windowState"),
  roadmapPhases: document.getElementById("roadmapPhases"),
  categoriesRoot: document.getElementById("categoriesRoot"),
  conceptId: document.getElementById("conceptId"),
  confidence: document.getElementById("confidence"),
  recallAnswer: document.getElementById("recallAnswer"),
  summary: document.getElementById("summary"),
  sendCheckin: document.getElementById("sendCheckin"),
  feedbackBox: document.getElementById("feedbackBox"),
  reminders: document.getElementById("reminders"),
  requestNotif: document.getElementById("requestNotif"),
  saveState: document.getElementById("saveState"),
  hiddenTheory: document.getElementById("hiddenTheory")
};

async function api(url, opts = {}) {
  const r = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

function fmtNow() {
  const tz = state?.profile?.timezone || "Europe/Bucharest";
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: tz
  }).format(new Date());
}

function allProblems() {
  const out = [];
  for (const category of state.algorithmCategories || []) {
    for (const problem of category.problems || []) {
      out.push({ category, problem });
    }
  }
  return out;
}

function findProblem(problemId) {
  for (const category of state.algorithmCategories || []) {
    const found = (category.problems || []).find((p) => p.id === problemId);
    if (found) return { category, problem: found };
  }
  return null;
}

function renderHeader() {
  el.headerSub.textContent = `${fmtNow()} | Focus: ${state.profile.goal}`;
}

function renderKpis() {
  el.readiness.textContent = `${computed.readiness}%`;
  el.foundationCoverage.textContent = `${computed.foundationCoverage}%`;
  el.hoursGap.textContent = Number.isFinite(computed.hoursSinceLastStudy)
    ? computed.hoursSinceLastStudy.toFixed(1)
    : "N/A";
  el.dueProblems.textContent = `${computed.dueProblems || 0}`;
  el.windowState.textContent = computed.inLearningWindow ? "Open" : "Closed";
}

function renderPhases() {
  el.roadmapPhases.innerHTML = (state.phases || [])
    .map((phase) => {
      const items = (phase.categories || []).map((x) => `<li>${x}</li>`).join("");
      return `<div class="phase"><h4>${phase.title}</h4><ul>${items}</ul></div>`;
    })
    .join("");
}

function problemMeta(problem) {
  const masteryText = Number.isFinite(problem.mastery) ? `${problem.mastery}%` : "0%";
  const nextReview = problem.nextReview || "-";
  return `<span>mastery ${masteryText}</span> <span>next ${nextReview}</span>`;
}

function categoryStats(category) {
  const core = category.problems.filter((p) => p.track === "core");
  const optional = category.problems.filter((p) => p.track === "optional");
  const coreDone = core.filter((p) => p.status === "done").length;
  const optionalDone = optional.filter((p) => p.status === "done").length;
  return `Core ${coreDone}/${core.length} | Optional ${optionalDone}/${optional.length}`;
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function problemCard(category, problem) {
  const checked = problem.status === "done" ? "checked" : "";
  const statusOptions = ["todo", "in_progress", "done"]
    .map((opt) => `<option value="${opt}" ${problem.status === opt ? "selected" : ""}>${opt}</option>`)
    .join("");
  const diffOptions = ["", "easy", "medium", "hard"]
    .map((opt) => `<option value="${opt}" ${problem.difficulty === opt ? "selected" : ""}>${opt || "n/a"}</option>`)
    .join("");

  return `
    <article class="problem" data-id="${problem.id}">
      <div class="problem-top">
        <label class="checkline">
          <input type="checkbox" data-field="done" ${checked} />
          <span class="problem-title">${esc(problem.title)}</span>
        </label>
        <span class="chip ${problem.track === "optional" ? "optional" : "core"}">${problem.track}</span>
      </div>
      <div class="meta-inline">${problemMeta(problem)}</div>
      <div class="problem-grid">
        <label>Status<select data-field="status">${statusOptions}</select></label>
        <label>Difficulty<select data-field="difficulty">${diffOptions}</select></label>
      </div>
      <div class="problem-grid">
        <label>Docs URL<input type="url" data-field="docsUrl" value="${esc(problem.docsUrl)}" placeholder="https://..." /></label>
        <label>Solution Path<input type="text" data-field="solutionPath" value="${esc(problem.solutionPath)}" placeholder="/abs/path/to/solution.md" /></label>
      </div>
      <label>Notes<textarea data-field="notes" rows="2" placeholder="Pattern, edge cases, mistakes.">${esc(problem.notes)}</textarea></label>
    </article>
  `;
}

function renderCategories() {
  el.categoriesRoot.innerHTML = (state.algorithmCategories || [])
    .map((category) => {
      const focus = (category.focus || []).map((f) => `<li>${f}</li>`).join("");
      const cards = (category.problems || []).map((p) => problemCard(category, p)).join("");
      return `
        <section class="category" data-category-id="${category.id}">
          <div class="category-head">
            <h3>${category.name}</h3>
            <div class="small">${category.phase} | ${categoryStats(category)}</div>
          </div>
          <details>
            <summary>Focus category</summary>
            <ul>${focus}</ul>
          </details>
          <div class="problems-list">${cards}</div>
        </section>
      `;
    })
    .join("");

  el.categoriesRoot.querySelectorAll(".problem").forEach((node) => {
    const problemId = node.dataset.id;
    node.querySelectorAll("[data-field]").forEach((input) => {
      const isSelect = input.tagName === "SELECT";
      const isCheckbox = input.tagName === "INPUT" && input.type === "checkbox";
      const field = input.dataset.field;
      if (!field) return;

      if (isSelect || isCheckbox) {
        input.addEventListener("change", async (e) => {
          if (field === "done") {
            await updateProblem(problemId, { status: e.target.checked ? "done" : "todo" });
            return;
          }
          await updateProblem(problemId, { [field]: e.target.value });
        });
      } else {
        input.addEventListener("blur", async (e) => {
          await updateProblem(problemId, { [field]: e.target.value });
        });
      }
    });
  });
}

function renderProblemSelect() {
  const items = allProblems();
  el.conceptId.innerHTML = items
    .map(({ category, problem }) => {
      const suffix = problem.status === "done" ? "(done)" : `(${problem.track})`;
      return `<option value="${problem.id}">${category.name} -> ${problem.title} ${suffix}</option>`;
    })
    .join("");
}

function renderFeedback(ai) {
  const strengths = (ai.strengths || []).map((x) => `<li>${x}</li>`).join("");
  const gaps = (ai.gaps || []).map((x) => `<li>${x}</li>`).join("");
  const next = (ai.nextActions || []).map((x) => `<li>${x}</li>`).join("");
  el.feedbackBox.innerHTML = `
    <div><strong>Verdict:</strong> ${ai.verdict || "n/a"} (${ai.mode || "unknown"})</div>
    <h4>Strengths</h4><ul class="list">${strengths || "<li>n/a</li>"}</ul>
    <h4>Gaps</h4><ul class="list">${gaps || "<li>n/a</li>"}</ul>
    <h4>Next Actions</h4><ul class="list">${next || "<li>n/a</li>"}</ul>
  `;
}

function renderReminders(reminders) {
  el.reminders.innerHTML = reminders
    .map((r) => `<div class="reminder ${r.severity === "high" ? "high" : ""}">${r.message}</div>`)
    .join("");

  if (reminders.length && Notification.permission === "granted") {
    new Notification("Algo Trainer", { body: reminders[0].message });
  }
}

function renderHiddenTheory() {
  const notes = (state.hiddenTheory?.notes || []).map((n) => `<li>${n}</li>`).join("");
  el.hiddenTheory.innerHTML = `
    <summary>${state.hiddenTheory?.title || "Teorie"}</summary>
    <ul>${notes}</ul>
  `;
}

async function persistState() {
  el.saveState.textContent = "Saving...";
  await api("/api/state", {
    method: "PUT",
    body: JSON.stringify({ state })
  });
  el.saveState.textContent = `Saved at ${new Date().toLocaleTimeString("ro-RO")}`;
}

function queuePersist() {
  persistQueue = persistQueue
    .then(() => persistState())
    .catch((e) => {
      el.saveState.textContent = `Save failed: ${e.message}`;
    });
  return persistQueue;
}

async function updateProblem(problemId, patch) {
  const found = findProblem(problemId);
  if (!found) return;
  Object.assign(found.problem, patch);
  if (patch.status === "done") {
    found.problem.lastReviewed = new Date().toISOString().slice(0, 10);
  }
  await queuePersist();
  const data = await api("/api/state");
  state = data.state;
  computed = data.computed;
  renderKpis();
  renderCategories();
  renderProblemSelect();
}

async function loadState() {
  const data = await api("/api/state");
  state = data.state;
  computed = data.computed;
}

async function refreshReminders() {
  const data = await api("/api/reminders");
  renderReminders(data.reminders || []);
}

async function sendCheckin() {
  const payload = {
    problemId: el.conceptId.value,
    confidence: Number(el.confidence.value),
    recallAnswer: el.recallAnswer.value.trim(),
    summary: el.summary.value.trim()
  };

  const data = await api("/api/checkin", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  state = data.state;
  renderCategories();
  renderProblemSelect();
  renderFeedback(data.ai);

  await loadState();
  renderKpis();
  renderHeader();
  await refreshReminders();
}

async function init() {
  await loadState();
  renderHeader();
  renderKpis();
  renderPhases();
  renderCategories();
  renderProblemSelect();
  renderHiddenTheory();
  await refreshReminders();

  el.sendCheckin.addEventListener("click", () => {
    sendCheckin().catch((e) => {
      el.feedbackBox.innerHTML = `<strong>Eroare:</strong> ${e.message}`;
    });
  });

  el.requestNotif.addEventListener("click", async () => {
    if (!("Notification" in window)) return;
    await Notification.requestPermission();
  });

  setInterval(async () => {
    await loadState();
    renderHeader();
    renderKpis();
    await refreshReminders();
  }, 60000);
}

init().catch((e) => {
  document.body.innerHTML = `<pre>Init error: ${e.message}</pre>`;
});
