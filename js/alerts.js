// ============================================================
//  TRANSITGO — DELAY ALERTS ENGINE  (Increment 4)
//  Simulates real-time PMPML service disruptions
// ============================================================

// ── Alert template pool ───────────────────────────────────────
const ALERT_TEMPLATES = [
  // Critical
  {
    severity: "critical",
    type: "cancellation",
    titleFn: r => `Route ${r.id} — Trip Cancelled`,
    bodyFn:  r => `The ${r.time} departure from ${r.from} has been cancelled due to vehicle breakdown near ${r.via[0] || r.stops[1].name}. Next bus in ${r.freq * 2} min.`,
    icon: "🚫", affectedTrips: 1,
    metaFn: r => [`Affects: ${r.from} → ${r.to}`, "Reason: Vehicle Breakdown", "Alternative: Next departure"]
  },
  {
    severity: "critical",
    type: "diversion",
    titleFn: r => `Route ${r.id} — Major Diversion`,
    bodyFn:  r => `All ${r.name} buses are being diverted via alternate roads. Avoid ${r.via[0] || "usual route"}. Travel time increased by ~20 min.`,
    icon: "↩️", affectedTrips: "All",
    metaFn: r => [`Route: ${r.from} → ${r.to}`, "Reason: Road Closure / Protest", "Duration: Until further notice"]
  },
  // High
  {
    severity: "high",
    type: "delay",
    titleFn: r => `Route ${r.id} — ${r.delay} min Delay`,
    bodyFn:  r => `Bus ${r.name} is running approximately ${r.delay} minutes behind schedule at ${r.stops[Math.floor(r.stops.length/2)].name}. Caused by heavy traffic congestion near ${r.via[0] || "city centre"}.`,
    icon: "⏳", affectedTrips: 3,
    metaFn: r => [`Delay: ${r.delay} min`, `At: ${r.stops[Math.floor(r.stops.length/2)].name}`, "Reason: Traffic Congestion"]
  },
  {
    severity: "high",
    type: "overcrowding",
    titleFn: r => `Route ${r.id} — Severe Overcrowding`,
    bodyFn:  r => `Peak hour overload on ${r.name}. Buses from ${r.from} are severely overcrowded. PMPML has deployed additional buses. Expect reduced frequency gaps.`,
    icon: "👥", affectedTrips: "Multiple",
    metaFn: r => [`Route: ${r.from} → ${r.to}`, "Crowd: 95%+ capacity", "Action: Extra buses deployed"]
  },
  // Medium
  {
    severity: "medium",
    type: "delay",
    titleFn: r => `Route ${r.id} — ${r.delay} min Delay`,
    bodyFn:  r => `${r.name} buses are running ${r.delay} minutes late due to a minor traffic jam at ${r.via[0] || r.stops[1].name} junction. Situation expected to normalise in 15–20 min.`,
    icon: "⏱️", affectedTrips: 2,
    metaFn: r => [`Delay: ${r.delay} min`, "Reason: Minor Traffic Jam", "ETA: Normalising soon"]
  },
  {
    severity: "medium",
    type: "partial_service",
    titleFn: r => `Route ${r.id} — Short-Turn Service`,
    bodyFn:  r => `Due to a road repair, ${r.name} will operate only between ${r.from} and ${r.via[0] || r.stops[Math.floor(r.stops.length/2)].name} until 8:00 PM. Full service resumes tomorrow.`,
    icon: "✂️", affectedTrips: "Multiple",
    metaFn: r => [`Truncated to: ${r.from} → ${r.via[0] || r.stops[2].name}`, "Reason: Road Repair", "Duration: Until 8:00 PM"]
  },
  // Low
  {
    severity: "low",
    type: "info",
    titleFn: r => `Route ${r.id} — Schedule Update`,
    bodyFn:  r => `PMPML has adjusted frequency on ${r.name} for the upcoming week. The last bus from ${r.from} will depart 30 minutes earlier than usual on weekends.`,
    icon: "ℹ️", affectedTrips: "Weekend trips",
    metaFn: r => [`Route: ${r.from} → ${r.to}`, "Change: Last bus earlier", "Effective: This weekend"]
  },
  {
    severity: "low",
    type: "maintenance",
    titleFn: r => `Route ${r.id} — Planned Maintenance`,
    bodyFn:  r => `${r.name} buses will undergo scheduled maintenance this Sunday between 12:00 AM – 5:30 AM. Normal service will resume at first bus time.`,
    icon: "🔧", affectedTrips: "Night trips",
    metaFn: r => ["Date: Sunday midnight", "Duration: ~5.5 hours", "Impact: No night service"]
  }
];

// ── State ──────────────────────────────────────────────────────
let activeFilter  = "all";
let allAlerts     = [];
let lastUpdated   = new Date();

// ── Generate alerts ───────────────────────────────────────────
function generateAlerts() {
  const now   = new Date();
  const nowH  = now.getHours();
  const nowM  = now.getMinutes();

  // Pick 6–9 realistic alerts from different templates + routes
  const picks = [];
  const usedRoutes = new Set();

  // Always include 1 critical
  const criticals  = ALERT_TEMPLATES.filter(t => t.severity === "critical");
  const highs      = ALERT_TEMPLATES.filter(t => t.severity === "high");
  const mediums    = ALERT_TEMPLATES.filter(t => t.severity === "medium");
  const lows       = ALERT_TEMPLATES.filter(t => t.severity === "low");

  const plan = [
    ...shuffle(criticals).slice(0, 1),
    ...shuffle(highs).slice(0, 2),
    ...shuffle(mediums).slice(0, 2),
    ...shuffle(lows).slice(0, 2)
  ];

  plan.forEach((template, idx) => {
    // Pick a different route for each alert
    const route = PMPML_ROUTES[(idx * 3) % PMPML_ROUTES.length];
    const minsAgo = Math.floor(Math.random() * 55) + 1;
    const delay   = [8, 12, 15, 18, 22][Math.floor(Math.random() * 5)];

    const routeCtx = {
      ...route,
      delay,
      freq: parseInt(route.frequency.match(/\d+/)[0]),
      time: fmtTime(nowH * 60 + nowM - minsAgo * 2)
    };

    picks.push({
      id:          `AL-${Date.now()}-${idx}`,
      severity:    template.severity,
      type:        template.type,
      icon:        template.icon,
      routeId:     route.id,
      routeColor:  route.color,
      routeName:   route.name,
      title:       template.titleFn(routeCtx),
      body:        template.bodyFn(routeCtx),
      meta:        template.metaFn(routeCtx),
      minsAgo,
      affectedTrips: template.affectedTrips
    });
  });

  return picks.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });
}

function fmtTime(totalMin) {
  const h  = Math.floor(((totalMin % 1440) + 1440) % 1440 / 60);
  const m  = ((totalMin % 60) + 60) % 60;
  const ap = h < 12 ? "AM" : "PM";
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${ap}`;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Filter alerts ─────────────────────────────────────────────
function getFiltered() {
  if (activeFilter === "all") return allAlerts;
  return allAlerts.filter(a => a.severity === activeFilter || a.type === activeFilter);
}

// ── Update stats bar ──────────────────────────────────────────
function updateStats() {
  const critical = allAlerts.filter(a => a.severity === "critical").length;
  const high     = allAlerts.filter(a => a.severity === "high").length;
  const medium   = allAlerts.filter(a => a.severity === "medium").length;
  const affected = new Set(allAlerts.map(a => a.routeId)).size;

  document.getElementById("stat-critical").textContent = critical;
  document.getElementById("stat-high").textContent     = high;
  document.getElementById("stat-medium").textContent   = medium;
  document.getElementById("stat-routes").textContent   = affected;
}

// ── Render alerts ─────────────────────────────────────────────
function renderAlerts() {
  const filtered = getFiltered();
  const list     = document.getElementById("al-list");
  const countEl  = document.getElementById("alert-count");
  if (countEl) countEl.textContent = `${filtered.length} alert${filtered.length !== 1 ? "s" : ""}`;

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="al-empty">
        <div class="al-empty-icon">✅</div>
        <div class="al-empty-title">All Clear for This Filter</div>
        <div class="al-empty-sub">No alerts match the selected filter. Try "All Alerts".</div>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map((a, i) => `
    <div class="alert-card sev-${a.severity}" style="animation-delay:${i*0.07}s">
      <div class="al-card-inner">
        <div class="al-card-head">
          <span class="al-sev-badge">${a.icon} ${a.severity}</span>
          <div class="al-card-title-wrap">
            <div class="al-card-title">${a.title}</div>
            <div class="al-card-time">🕐 ${a.minsAgo} min ago · Route ${a.routeId}</div>
          </div>
          <div class="al-route-tag"
               style="background:${a.routeColor}18;border-color:${a.routeColor}50;color:${a.routeColor}">
            🚌${a.routeId}
          </div>
        </div>
        <div class="al-card-body">${a.body}</div>
        <div class="al-card-meta">
          ${a.meta.map(m => `<span class="al-meta-chip">${m}</span>`).join("")}
          <div class="al-card-actions">
            <a href="live-track.html?route=${a.routeId}" class="al-action-btn">🗺️ Track</a>
            <a href="timetable.html?route=${a.routeId}" class="al-action-btn primary">📅 Schedule</a>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

// ── Filter chip click ─────────────────────────────────────────
function setFilter(f) {
  activeFilter = f;
  document.querySelectorAll(".al-filter-chip").forEach(c => {
    c.classList.toggle("chip-active", c.dataset.filter === f);
  });
  renderAlerts();
}

// ── Refresh ───────────────────────────────────────────────────
function refreshAlerts(fromBtn = false) {
  if (fromBtn) {
    const btn = document.getElementById("refresh-btn");
    btn.classList.add("spinning");
    setTimeout(() => btn.classList.remove("spinning"), 800);
  }

  allAlerts  = generateAlerts();
  lastUpdated = new Date();
  updateStats();
  renderAlerts();
  updateLastUpdated();
}

function updateLastUpdated() {
  const el = document.getElementById("last-updated");
  if (el) el.textContent = `Last updated: ${lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}

// Auto-refresh every 45 seconds
setInterval(() => { refreshAlerts(); }, 45000);

// ── Bell notification permission ──────────────────────────────
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notifications.");
    return;
  }
  Notification.requestPermission().then(perm => {
    if (perm === "granted") {
      new Notification("TransitGo Alerts", {
        body: "You'll now receive PMPML delay alerts in real time! 🚌",
        icon: ""
      });
      document.getElementById("notif-btn").textContent = "🔔 Notifications On";
      document.getElementById("notif-btn").style.opacity = "0.6";
    }
  });
}

// ── Navbar scroll ─────────────────────────────────────────────
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 10);
});

// ── Init ──────────────────────────────────────────────────────
refreshAlerts();
