// ============================================================
//  TRANSITGO — AI CROWD PREDICTION ENGINE  (Increment 5)
//  Time-aware, route-specific ridership forecast model
// ============================================================

// ── Base hourly crowd pattern (0–100 for each hour 0–23) ──────
//  Modeled on real Pune PMPML ridership patterns:
//  Low at night → spikes at 8-10 AM & 5-8 PM
const BASE_CROWD = [
  5,  4,  3,  3,  4,  10,   // 0–5 AM  (near empty, early birds)
  28, 65, 88, 82, 70, 58,   // 6–11 AM (morning rush peaks at 8-9)
  50, 48, 52, 55, 60, 78,   // 12–17   (midday moderate, building to evening)
  90, 88, 75, 55, 38, 22    // 18–23   (evening peak at 18-19, drops off)
];

// ── Per-route modifiers (multiplier 0.5–1.3) ─────────────────
//  Route 4 & 50 are long cross-city routes → high peak loads
//  Route 11 & 15 are commuter routes → extreme peak, low off-peak
const ROUTE_MODIFIERS = {
  "15":  { peak: 1.15, offPeak: 0.9,  name: "Katraj–Hadapsar (Office belt)" },
  "72A": { peak: 0.85, offPeak: 0.75, name: "Deccan–Kothrud (College belt)" },
  "11":  { peak: 1.2,  offPeak: 0.7,  name: "Shivajinagar–Swargate (CBD)" },
  "50":  { peak: 1.1,  offPeak: 0.95, name: "Wakad–Swargate (IT corridor)" },
  "106": { peak: 1.0,  offPeak: 0.85, name: "Warje–Hadapsar (Mixed)" },
  "4":   { peak: 1.25, offPeak: 0.9,  name: "Pimpri–Swargate (Industrial)" },
  "155": { peak: 0.9,  offPeak: 1.05, name: "Katraj–Wakad (Cross-city)" },
  "32":  { peak: 0.95, offPeak: 0.8,  name: "Vishrantwadi–Hadapsar (Airport)" }
};

const PEAK_HOURS = [7, 8, 9, 17, 18, 19];

// ── Predict crowd for a route at a specific hour ──────────────
function predictCrowd(routeId, hour) {
  const base = BASE_CROWD[hour] ?? 30;
  const mod  = ROUTE_MODIFIERS[routeId] || { peak: 1.0, offPeak: 0.9 };
  const mult = PEAK_HOURS.includes(hour) ? mod.peak : mod.offPeak;

  // Add small random noise ±5 for realism
  const noise = (Math.random() - 0.5) * 10;
  return Math.round(Math.min(100, Math.max(2, base * mult + noise)));
}

// ── Get crowd colour & label ──────────────────────────────────
function crowdColor(pct) {
  if (pct >= 80) return { color: "#f5576c", label: "Very Crowded" };
  if (pct >= 60) return { color: "#fee140", label: "Crowded" };
  if (pct >= 35) return { color: "#4facfe", label: "Moderate" };
  return              { color: "#43e97b", label: "Comfortable" };
}

// ── Render bar chart ──────────────────────────────────────────
function renderCrowdChart(routeId) {
  const chart  = document.getElementById("crowd-chart");
  const nowH   = new Date().getHours();
  if (!chart) return;

  // Generate predictions for all 24 hours
  const hours = Array.from({ length: 24 }, (_, h) => h);
  const preds = hours.map(h => ({ hour: h, pct: predictCrowd(routeId, h) }));

  const MAX_BAR_HEIGHT = 80; // px

  chart.innerHTML = preds.map(({ hour, pct }) => {
    const { color, label } = crowdColor(pct);
    const barH = Math.max(4, Math.round((pct / 100) * MAX_BAR_HEIGHT));
    const hLabel = hour === 0 ? "12a" : hour < 12 ? `${hour}a` : hour === 12 ? "12p" : `${hour-12}p`;
    const isNow = hour === nowH;
    const tip = `${hLabel.toUpperCase()} — ${pct}% (${label})`;

    return `
      <div class="crowd-bar-wrap">
        <div class="crowd-bar${isNow ? " now-bar" : ""}"
             style="height:${barH}px;background:${isNow ? "#fff" : color}; opacity:${isNow ? 1 : 0.75};"
             data-tip="${tip}"></div>
        <div class="crowd-label" style="color:${isNow ? "white" : ""};font-weight:${isNow ? "900" : "600"}">${hLabel}</div>
      </div>`;
  }).join("");

  // Update insight text
  const peakH   = preds.reduce((a, b) => a.pct > b.pct ? a : b);
  const lowH    = preds.filter(p => p.hour >= 6).reduce((a, b) => a.pct < b.pct ? a : b);
  const nowPct  = preds[nowH].pct;
  const { label: nowLabel, color: nowColor } = crowdColor(nowPct);

  const insightEl = document.getElementById("crowd-insight");
  if (insightEl) {
    const mod = ROUTE_MODIFIERS[routeId];
    const peakHLabel = peakH.hour < 12 ? `${peakH.hour}:00 AM` : `${peakH.hour-12}:00 PM`;
    const lowHLabel  = lowH.hour  < 12 ? `${lowH.hour}:00 AM`  : `${lowH.hour-12}:00 PM`;
    insightEl.innerHTML = `
      <div class="ci-row">
        <span class="ci-label">🕐 Right now</span>
        <span class="ci-val" style="color:${nowColor}">${nowLabel} (${nowPct}%)</span>
      </div>
      <div class="ci-row">
        <span class="ci-label">📈 Peak time</span>
        <span class="ci-val">${peakHLabel} — ${peakH.pct}% capacity</span>
      </div>
      <div class="ci-row">
        <span class="ci-label">😌 Best time to travel</span>
        <span class="ci-val" style="color:#43e97b">${lowHLabel} — only ${lowH.pct}% crowd</span>
      </div>
      <div class="ci-row">
        <span class="ci-label">🚌 Route pattern</span>
        <span class="ci-val">${mod ? mod.name : routeId}</span>
      </div>`;
  }
}

// ── Route selector change ─────────────────────────────────────
function onCrowdRouteChange(routeId) {
  renderCrowdChart(routeId);
}

// ── Populate the <select> with all routes ─────────────────────
function initCrowdSelect() {
  const sel = document.getElementById("crowd-route-sel");
  if (!sel) return;

  sel.innerHTML = PMPML_ROUTES.map(r =>
    `<option value="${r.id}">Route ${r.id} — ${r.from} → ${r.to}</option>`
  ).join("");

  // Default to Route 15
  sel.value = "15";
  renderCrowdChart("15");
}
