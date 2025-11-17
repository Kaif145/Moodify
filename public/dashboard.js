async function fetchDashboard() {
  try {
    const res = await fetch("/api/dashboard");
    const json = await res.json();
    const data = json.dashboard || json.data || {};
    renderSummary(data);
    renderList("photo-types", data.photoTypes);
    renderList("moods", data.moods);
    renderList("time-of-day", data.timeOfDay);
    renderDailyStats(data.dailyStats || []);
  } catch (err) {
    document.getElementById("summary").innerText = "Could not load analytics.";
    console.error(err);
  }
}

function renderSummary(data) {
  const container = document.getElementById("summary");
  container.innerHTML = "";
  const cards = [
    { title: "Total uploads", value: data.totalUploads ?? 0 },
    { title: "Avg / day", value: data.insights?.avgUploadsPerDay ?? 0 },
    { title: "Top mood", value: data.insights?.topMood ?? "none" },
    { title: "Top photo type", value: data.insights?.topPhotoType ?? "none" }
  ];
  cards.forEach(c => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `<div class="card-title">${c.title}</div><div class="card-value"><strong>${c.value}</strong></div>`;
    container.appendChild(el);
  });
}

function renderList(id, obj = {}) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  if (!obj || Object.keys(obj).length === 0) {
    el.innerHTML = "<li>none</li>";
    return;
  }
  Object.entries(obj).forEach(([k, v]) => {
    const li = document.createElement("li");
    li.textContent = `${k}: ${v}`;
    el.appendChild(li);
  });
}

function renderDailyStats(rows) {
  const tbody = document.querySelector("#daily-stats tbody");
  tbody.innerHTML = "";
  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.date}</td><td>${r.uploads}</td>`;
    tbody.appendChild(tr);
  });
}

window.addEventListener("DOMContentLoaded", fetchDashboard);