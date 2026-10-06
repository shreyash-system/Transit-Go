// ============================================================
//  TRANSITGO — TIMETABLE PAGE LOGIC
//  Handles: route selection, schedule generation, stop timeline
// ============================================================

// ── State ─────────────────────────────────────────────────────
let activeRouteId  = null;
let activeFilter   = "all";   // "all" | "morning" | "afternoon" | "evening"

// ── DOM refs ─────────────────────────────────────────────────
const routeTabs   = document.getElementById("route-tabs");
const ttCard      = document.getElementById("tt-card");

// ── Helpers ──────────────────────────────────────────────────

/** Format a minute-of-day to HH:MM */
function minToTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

/** Given HH:MM, return 12-hour format + AM/PM */
function to12h(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const hour  = h % 12 || 12;
  return { time: `${hour}:${String(m).padStart(2,"0")}`, ampm };
}

/** Get current time as minute-of-day */
function nowMin() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/** Get formatted current time */
function nowTimeStr() {
  const now = new Date();
  const h   = now.getHours();
  const m   = now.getMinutes();
  const ampm = h < 12 ? "AM" : "PM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2,"0")} ${ampm}`;
}

/** Generate all departure times for a route */
function generateSchedule(route) {
  const [fH, fM] = route.firstBus.split(":").map(Number);
  const [lH, lM] = route.lastBus.split(":").map(Number);
  const freqMin  = parseInt(route.frequency.match(/\d+/)[0]);
  const firstMin = fH * 60 + fM;
  const lastMin  = lH * 60 + lM;
  const slots    = [];
  let cur = firstMin;
  while (cur <= lastMin) {
    slots.push(cur);
    cur += freqMin;
  }
  return slots;
}

/** Get period label for a time in minutes */
function getPeriod(min) {
  const h = Math.floor(min / 60);
  if (h < 6)  return "Early Morning";
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  if (h < 21) return "Evening";
  return "Night";
}

// ── Build Route Tabs ─────────────────────────────────────────
function buildTabs() {
  routeTabs.innerHTML = ALL_ROUTES.map(r => `
    <button
      class="route-tab ${r.id === activeRouteId ? "tab-active" : ""}"
      id="tab-${r.id}"
      onclick="selectRoute('${r.id}')"
    >
      <span class="rt-dot" style="background:${r.color}"></span>
      ${r.type === "Metro" ? "🚇" : ""} ${r.id} · ${r.from.split(" ")[0]}→${r.to.split(" ")[0]}
    </button>
  `).join("");
}

// ── Select Route ─────────────────────────────────────────────
function selectRoute(routeId) {
  activeRouteId = routeId;
  activeFilter  = "all";

  // Update tab active states
  document.querySelectorAll(".route-tab").forEach(tab => {
    tab.classList.toggle("tab-active", tab.id === `tab-${routeId}`);
  });

  renderTimetableCard(routeId);

  // Update URL without reload
  const url = new URL(window.location.href);
  url.searchParams.set("route", routeId);
  history.replaceState(null, "", url.toString());
}

// ── Render Timetable Card ─────────────────────────────────────
function renderTimetableCard(routeId) {
  const route = ALL_ROUTES.find(r => r.id === routeId);
  if (!route) return;

  ttCard.classList.remove("card-visible");

  const schedule = generateSchedule(route);
  const now      = nowMin();
  let   nextIdx  = schedule.findIndex(m => m >= now);
  if (nextIdx === -1) nextIdx = null; // All buses done for today

  // ── Filter schedule by period ─────────────────────────────
  const filterPeriod = {
    all:       () => true,
    morning:   m  => { const h = Math.floor(m/60); return h >= 5  && h < 12; },
    afternoon: m  => { const h = Math.floor(m/60); return h >= 12 && h < 17; },
    evening:   m  => { const h = Math.floor(m/60); return h >= 17 && h < 24; }
  };
  const filtered = schedule.filter(filterPeriod[activeFilter] || (() => true));

  // ── Recalculate next for filtered list ────────────────────
  let filteredNextIdx = filtered.findIndex(m => m >= now);

  // ── Next bus departure at first stop ─────────────────────
  const nextBusTime = nextIdx !== null
    ? `Next bus: ${minToTime(schedule[nextIdx])} (${schedule[nextIdx] - now <= 0 ? "Arriving" : `in ${schedule[nextIdx] - now} min`})`
    : "No more buses today";

  const isLastBusSoon = nextIdx !== null && (schedule[nextIdx] === schedule[schedule.length - 1]);

  // ── Build departure time for each stop (based on first next departure) ──
  function getStopDep(offsetMin) {
    if (nextIdx === null) return "—";
    const depMin = schedule[nextIdx] + offsetMin;
    return minToTime(depMin);
  }

  // ── Stops timeline HTML ───────────────────────────────────
  const stopsHtml = route.stops.map((stop, i) => {
    const isFirst = i === 0;
    const isLast  = i === route.stops.length - 1;
    const depTime = getStopDep(stop.offsetMin);
    return `
      <div class="timeline-stop">
        <div class="ts-dot"></div>
        <div class="ts-info">
          <div class="ts-name">${stop.name}</div>
          <div class="ts-time-row">
            <span class="ts-offset">${stop.offsetMin > 0 ? `+${stop.offsetMin} min` : "Start"}</span>
            ${nextIdx !== null ? `<span class="ts-dep-time">· ${depTime}</span>` : ""}
          </div>
          ${isFirst ? `<span class="ts-badge badge-terminus">Origin</span>` : ""}
          ${isLast  ? `<span class="ts-badge badge-end">Terminal</span>`    : ""}
        </div>
      </div>
    `;
  }).join("");

  // ── Schedule grid HTML ─────────────────────────────────────
  let lastPeriod = "";
  let schedHtml  = "";

  if (filtered.length === 0) {
    schedHtml = `<div class="sched-period-label" style="grid-column:1/-1;text-align:center;padding:24px 0;opacity:0.5">No buses in this time period</div>`;
  } else {
    filtered.forEach((min, i) => {
      const period = getPeriod(min);
      const isPast = min < now;
      const isNext = (i === filteredNextIdx);
      const t = to12h(minToTime(min));
      const etaMin = min - now;
      const etaLabel = etaMin <= 0 ? "Now" : etaMin < 60 ? `${etaMin}m` : `${Math.floor(etaMin/60)}h`;

      if (period !== lastPeriod) {
        schedHtml += `<div class="sched-period-label">${period}</div>`;
        lastPeriod = period;
      }

      schedHtml += `
        <div class="sched-slot ${isPast ? "slot-past" : ""} ${isNext ? "slot-next" : ""}">
          ${isNext ? `<span class="slot-next-tag">NEXT</span>` : ""}
          <span class="slot-time">${t.time}</span>
          <span class="slot-ampm">${t.ampm}</span>
          ${isNext ? `<span class="slot-eta-label">${etaLabel}</span>` : ""}
        </div>
      `;
    });
  }

  // ── Alert HTML ────────────────────────────────────────────
  let alertHtml = "";
  if (nextIdx === null) {
    alertHtml = `<div class="tt-alert alert-warn">🌙 Service has ended for today. First bus tomorrow at ${route.firstBus}</div>`;
  } else if (isLastBusSoon) {
    alertHtml = `<div class="tt-alert alert-warn">⚠️ Last bus departs at ${route.lastBus}. Plan accordingly.</div>`;
  } else if (nextIdx !== null && schedule[nextIdx] - now <= 5) {
    alertHtml = `<div class="tt-alert alert-info">🚌 Next bus arriving very soon — ${schedule[nextIdx] - now <= 0 ? "now!" : `in ${schedule[nextIdx] - now} min`}</div>`;
  }

  // ── Crowd info ────────────────────────────────────────────
  const crowd = getCrowdLevel();

  // ── Total trips per day ───────────────────────────────────
  const totalTrips = generateSchedule(route).length;

  // ── Inject HTML ───────────────────────────────────────────
  ttCard.innerHTML = `
    <div class="tt-card-header">
      <div class="tt-route-badge"
           style="background:${route.color}18; border-color:${route.color}50; color:${route.color}">
        🚌${route.id}
      </div>
      <div class="tt-route-info">
        <div class="tt-route-name">${route.type === "Metro" ? "🚇" : "🚌"} ${route.name} — ${route.from} → ${route.to}${route.line ? ` <span class="rc-line-chip" style="background:${route.color}25;color:${route.color};border-color:${route.color}50;font-size:0.75rem;padding:2px 8px;border-radius:99px;border:1px solid">${route.line}</span>` : ""}</div>
        <div class="tt-route-sub">
          <span>📍 ${route.stops.length} stops</span>
          <span class="tt-route-sep">|</span>
          <span>⏱ ${route.durationMin} min total</span>
          <span class="tt-route-sep">|</span>
          <span>🔄 ${route.frequency}</span>
        </div>
        <div class="tt-meta-chips">
          <span class="tt-chip chip-primary">🕐 First: ${route.firstBus}</span>
          <span class="tt-chip chip-primary">🕙 Last: ${route.lastBus}</span>
          <span class="tt-chip chip-green">💰 From ₹${route.fare}</span>
          <span class="tt-chip chip-yellow">${crowd.emoji} ${crowd.label} now</span>
          <span class="tt-chip">${totalTrips} trips/day</span>
        </div>
      </div>
    </div>

    <div class="tt-card-body">

      <!-- STOPS PANEL -->
      <div class="tt-stops-panel">
        <div class="tt-panel-title">Route Stops</div>
        <div class="stop-timeline">
          ${stopsHtml}
        </div>
      </div>

      <!-- SCHEDULE PANEL -->
      <div class="tt-schedule-panel">

        <!-- Time period filter -->
        <div class="tt-time-filter">
          <button class="tf-btn ${activeFilter==="all"       ? "tf-active":""}" onclick="setFilter('all')">All Day</button>
          <button class="tf-btn ${activeFilter==="morning"   ? "tf-active":""}" onclick="setFilter('morning')">🌅 Morning</button>
          <button class="tf-btn ${activeFilter==="afternoon" ? "tf-active":""}" onclick="setFilter('afternoon')">☀️ Afternoon</button>
          <button class="tf-btn ${activeFilter==="evening"   ? "tf-active":""}" onclick="setFilter('evening')">🌙 Evening</button>
        </div>

        <!-- Live indicator -->
        <div class="now-indicator">
          <span class="now-dot"></span>
          <span>Now: <span class="now-time">${nowTimeStr()}</span></span>
          <span>· ${nextBusTime}</span>
        </div>

        ${alertHtml}

        <!-- Schedule grid -->
        <div class="schedule-grid" id="schedule-grid">
          ${schedHtml}
        </div>

      </div>
    </div>
  `;

  // Animate card in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => ttCard.classList.add("card-visible"));
  });
}

// ── Time filter ───────────────────────────────────────────────
function setFilter(period) {
  activeFilter = period;
  if (activeRouteId) renderTimetableCard(activeRouteId);
}

// ── Init ──────────────────────────────────────────────────────
(function init() {
  // Check URL params for a pre-selected route
  const params  = new URLSearchParams(window.location.search);
  const routeId = params.get("route");

  // Default to first route or requested
  const target = ALL_ROUTES.find(r => r.id === routeId) ? routeId : ALL_ROUTES[0].id;
  activeRouteId = target;

  buildTabs();
  renderTimetableCard(target);

  // Navbar scroll
  window.addEventListener("scroll", () => {
    document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 10);
  });

  // Live clock — update "Now" every 30 seconds
  setInterval(() => {
    const nowEl = document.querySelector(".now-time");
    if (nowEl) nowEl.textContent = nowTimeStr();
  }, 30000);
})();
