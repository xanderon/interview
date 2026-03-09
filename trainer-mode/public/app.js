let state = null;
let computed = null;
let draggingTaskId = null;

const el = {
  headerSub: document.getElementById("headerSub"),
  readiness: document.getElementById("readiness"),
  coverage: document.getElementById("coverage"),
  hoursGap: document.getElementById("hoursGap"),
  windowState: document.getElementById("windowState"),
  todoCol: document.getElementById("todoCol"),
  inProgressCol: document.getElementById("inProgressCol"),
  doneCol: document.getElementById("doneCol"),
  conceptId: document.getElementById("conceptId"),
  confidence: document.getElementById("confidence"),
  recallAnswer: document.getElementById("recallAnswer"),
  summary: document.getElementById("summary"),
  sendCheckin: document.getElementById("sendCheckin"),
  feedbackBox: document.getElementById("feedbackBox"),
  reminders: document.getElementById("reminders"),
  requestNotif: document.getElementById("requestNotif")
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

function renderHeader() {
  el.headerSub.textContent = `${fmtNow()} | Target: ${state.profile.goal}`;
}

function renderKpis() {
  el.readiness.textContent = `${computed.readiness}%`;
  el.coverage.textContent = `${computed.dealBreakerCoverage}%`;
  el.hoursGap.textContent = Number.isFinite(computed.hoursSinceLastStudy)
    ? computed.hoursSinceLastStudy.toFixed(1)
    : "N/A";
  el.windowState.textContent = computed.inLearningWindow ? "Open" : "Closed";
}

function taskCard(task) {
  const div = document.createElement("div");
  div.className = "task";
  div.draggable = true;
  div.dataset.id = task.id;
  div.innerHTML = `<strong>${task.title}</strong><div class="meta">${task.type} | ${task.estimateMin}m</div>`;

  div.addEventListener("dragstart", () => {
    draggingTaskId = task.id;
  });
  return div;
}

function renderTasks() {
  el.todoCol.innerHTML = "";
  el.inProgressCol.innerHTML = "";
  el.doneCol.innerHTML = "";

  const map = {
    todo: el.todoCol,
    in_progress: el.inProgressCol,
    done: el.doneCol
  };

  for (const t of state.tasks) {
    map[t.status].appendChild(taskCard(t));
  }
}

function attachDropTargets() {
  document.querySelectorAll(".col").forEach((col) => {
    col.addEventListener("dragover", (e) => e.preventDefault());
    col.addEventListener("drop", async () => {
      if (!draggingTaskId) return;
      const task = state.tasks.find((t) => t.id === draggingTaskId);
      if (!task) return;
      task.status = col.dataset.status;
      await persistState();
      renderTasks();
    });
  });
}

function renderConceptSelect() {
  el.conceptId.innerHTML = state.concepts
    .map((c) => `<option value="${c.id}">${c.name} (${c.mastery}%)</option>`)
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
    new Notification("Trainer Mode", { body: reminders[0].message });
  }
}

async function persistState() {
  await api("/api/state", {
    method: "PUT",
    body: JSON.stringify({ state })
  });
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
    conceptId: el.conceptId.value,
    confidence: Number(el.confidence.value),
    recallAnswer: el.recallAnswer.value.trim(),
    summary: el.summary.value.trim()
  };

  const data = await api("/api/checkin", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  state = data.state;
  renderConceptSelect();
  renderTasks();
  renderFeedback(data.ai);

  const latestConcept = state.concepts.find((c) => c.id === payload.conceptId);
  if (latestConcept) {
    const maybeTask = state.tasks.find((t) => t.conceptId === payload.conceptId && t.status !== "done");
    if (maybeTask && payload.confidence >= 70) {
      maybeTask.status = "done";
      await persistState();
      renderTasks();
    }
  }

  await loadState();
  renderKpis();
  renderHeader();
  await refreshReminders();
}

async function init() {
  await loadState();
  renderHeader();
  renderKpis();
  renderTasks();
  renderConceptSelect();
  attachDropTargets();
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
