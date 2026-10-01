// ============================================================
//  TRANSITGO — LIVE MAP LOGIC
//  Leaflet.js + simulated bus movement for PMPML Pune
// ============================================================

// ── Pune bus positions (realistic coordinates) ───────────────
const BUS_DATA = [
  {
    busId:    "BUS-15-A",
    routeId:  "15",
    route:    "Route 15",
    from:     "Katraj",
    to:       "Hadapsar",
    lat:      18.4590,
    lng:      73.8567,
    nearStop: "Swargate",
    fare:     12,
    color:    "#6C63FF",
    driftLat: 0.0004,
    driftLng: 0.0006
  },
  {
    busId:    "BUS-72A-B",
    routeId:  "72A",
    route:    "Route 72A",
    from:     "Deccan Gymkhana",
    to:       "Kothrud",
    lat:      18.5165,
    lng:      73.8421,
    nearStop: "FC Road",
    fare:     10,
    color:    "#f5576c",
    driftLat: -0.0003,
    driftLng: -0.0005
  },
  {
    busId:    "BUS-11-C",
    routeId:  "11",
    route:    "Route 11",
    from:     "Shivajinagar",
    to:       "Swargate",
    lat:      18.5308,
    lng:      73.8474,
    nearStop: "Pune Station",
    fare:     8,
    color:    "#3ECFCF",
    driftLat: -0.0005,
    driftLng: 0.0004
  },
  {
    busId:    "BUS-50-D",
    routeId:  "50",
    route:    "Route 50",
    from:     "Wakad",
    to:       "Swargate",
    lat:      18.5590,
    lng:      73.7690,
    nearStop: "Baner",
    fare:     20,
    color:    "#43e97b",
    driftLat: 0.0003,
    driftLng: 0.0007
  },
  {
    busId:    "BUS-106-E",
    routeId:  "106",
    route:    "Route 106",
    from:     "Warje",
    to:       "Hadapsar",
    lat:      18.4874,
    lng:      73.8060,
    nearStop: "Sinhagad Road",
    fare:     15,
    color:    "#fee140",
    driftLat: 0.0006,
    driftLng: 0.0003
  },
  {
    busId:    "BUS-4-F",
    routeId:  "4",
    route:    "Route 4",
    from:     "Pimpri",
    to:       "Swargate",
    lat:      18.6298,
    lng:      73.7997,
    nearStop: "Aundh",
    fare:     18,
    color:    "#f093fb",
    driftLat: -0.0006,
    driftLng: 0.0002
  },
  {
    busId:    "BUS-155-G",
    routeId:  "155",
    route:    "Route 155",
    from:     "Katraj",
    to:       "Wakad",
    lat:      18.4480,
    lng:      73.8535,
    nearStop: "Karve Nagar",
    fare:     22,
    color:    "#4facfe",
    driftLat: 0.0005,
    driftLng: -0.0004
  },
  {
    busId:    "BUS-32-H",
    routeId:  "32",
    route:    "Route 32",
    from:     "Vishrantwadi",
    to:       "Hadapsar",
    lat:      18.5890,
    lng:      73.9010,
    nearStop: "Viman Nagar",
    fare:     16,
    color:    "#a18cd1",
    driftLat: -0.0004,
    driftLng: -0.0006
  }
];

// ETA values (rotate through these)
const ETA_VALUES = ["1 min", "2 min", "3 min", "4 min", "5 min", "Arriving", "7 min"];
let etaIndex = 0;

// ── Map Setup ─────────────────────────────────────────────────
const map = L.map("map-container", {
  center:         [18.5204, 73.8567], // Pune city centre
  zoom:           12,
  zoomControl:    false,
  attributionControl: true
});

// ── Free OpenStreetMap Layer (Zero watermark, No API key) ─────
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | PMPML Pune Simulation',
  maxZoom: 19
}).addTo(map);

// ── My Location Marker (Pune centre) ─────────────────────────
const myLocIcon = L.divIcon({
  className: "",
  html: `<div class="my-location-marker">
           <div class="my-pulse-ring"></div>
           <div class="my-core-dot"></div>
         </div>`,
  iconSize:   [32, 32],
  iconAnchor: [16, 16]
});

const myMarker = L.marker([18.5204, 73.8567], { icon: myLocIcon, zIndexOffset: 1000 })
  .addTo(map)
  .bindTooltip("📍 You are here", { permanent: false, direction: "top" });

// ── Create Bus Markers with Radar Beacons ────────────────────
const busMarkers = {};
const busEtas    = {};

BUS_DATA.forEach(bus => {
  busEtas[bus.busId] = ETA_VALUES[Math.floor(Math.random() * ETA_VALUES.length)];

  const icon = L.divIcon({
    className: "",
    html: `<div class="bus-marker-wrapper" id="marker-${bus.busId}">
             <div class="bus-beacon-pulse" style="border-color:${bus.color}"></div>
             <div class="bus-marker-body" style="border-color:${bus.color}">
               🚌
             </div>
             <div class="bus-marker-tag" style="background:${bus.color}">${bus.routeId}</div>
           </div>`,
    iconSize:   [44, 54],
    iconAnchor: [22, 54]
  });

  const marker = L.marker([bus.lat, bus.lng], { icon, zIndexOffset: 500 }).addTo(map);

  // Popup on click
  marker.on("click", () => openBusPopup(bus, marker));

  busMarkers[bus.busId] = { marker, bus };
});

// ── Popup Logic ───────────────────────────────────────────────
function openBusPopup(bus, marker) {
  const crowd    = getCrowdLevel();
  const eta      = busEtas[bus.busId];
  const isOnTime = !["Arriving"].includes(eta) && parseInt(eta) < 10;

  const popupHtml = `
    <div class="bus-popup">
      <div class="bp-header">
        <div class="bp-badge" style="background:${bus.color}20;border-color:${bus.color}50;color:${bus.color}">
          🚌 ${bus.routeId}
        </div>
        <div class="bp-info">
          <div class="bp-route">${bus.from} → ${bus.to}</div>
          <div class="bp-status" style="color:${isOnTime ? '#43e97b' : '#fee140'}">
            ${isOnTime ? "✅ On Time" : "⚠️ Slight Delay"}
          </div>
        </div>
      </div>
      <div class="bp-body">
        <div class="bp-row">
          <span class="bp-label">📍 Near</span>
          <span class="bp-val">${bus.nearStop}</span>
        </div>
        <div class="bp-row">
          <span class="bp-label">⏱️ Next stop in</span>
          <span class="bp-val" style="color:#3ECFCF;font-weight:800">${eta}</span>
        </div>
        <div class="bp-row">
          <span class="bp-label">👥 Crowd</span>
          <span class="bp-val" style="color:${crowd.color}">${crowd.emoji} ${crowd.label}</span>
        </div>
        <div class="bp-row">
          <span class="bp-label">💰 Fare from</span>
          <span class="bp-val">₹${bus.fare}</span>
        </div>
      </div>
      <div class="bp-actions">
        <a class="bp-btn bp-btn-primary"
           href="route-search.html?from=${encodeURIComponent(bus.from)}&to=${encodeURIComponent(bus.to)}">
          🔍 Search Route
        </a>
        <a class="bp-btn bp-btn-secondary"
           href="timetable.html?route=${bus.routeId}">
          📅 Schedule
        </a>
      </div>
    </div>`;

  marker.bindPopup(popupHtml, {
    maxWidth:   280,
    className:  "tg-popup",
    closeButton: true
  }).openPopup();

  // Also highlight sidebar card
  document.querySelectorAll(".bus-card").forEach(c => c.classList.remove("bus-card-active"));
  const card = document.getElementById(`card-${bus.busId}`);
  if (card) {
    card.classList.add("bus-card-active");
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// ── Animate Buses & Variable Speed Simulation ────────────────
let simMultiplier = 1;
let simPaused     = false;
let simTime       = Date.now() / 1000;

function animateBuses() {
  if (simPaused) return;
  simTime += 2 * simMultiplier;

  BUS_DATA.forEach(bus => {
    const amplitude = 0.008;
    const speed     = 0.3 + Math.random() * 0.1;
    const newLat    = bus.lat + Math.sin(simTime * speed + bus.busId.charCodeAt(4)) * amplitude;
    const newLng    = bus.lng + Math.cos(simTime * speed + bus.busId.charCodeAt(4)) * amplitude * 1.5;

    busMarkers[bus.busId].marker.setLatLng([newLat, newLng]);
  });
}

// Run simulation animation cycle
setInterval(animateBuses, 1600);

// ── Floating Simulation Speed Playback HUD ───────────────────
function setupSimHUD() {
  const mapWrapper = document.querySelector(".map-wrapper") || document.getElementById("map-container");
  if (!mapWrapper || document.getElementById("sim-playback-hud")) return;

  const hud = document.createElement("div");
  hud.id = "sim-playback-hud";
  hud.className = "sim-playback-hud";
  hud.innerHTML = `
    <div class="sim-hud-title"><span>📡</span> Sim Clock</div>
    <button type="button" class="sim-btn" id="sim-pause-btn" title="Pause or Resume Simulation">⏸️ Pause</button>
    <button type="button" class="sim-btn active" data-speed="1">1x</button>
    <button type="button" class="sim-btn" data-speed="2">2x</button>
    <button type="button" class="sim-btn" data-speed="5">5x</button>
  `;
  mapWrapper.appendChild(hud);

  const pauseBtn = hud.querySelector("#sim-pause-btn");
  pauseBtn.addEventListener("click", () => {
    simPaused = !simPaused;
    pauseBtn.textContent = simPaused ? "▶️ Play" : "⏸️ Pause";
    pauseBtn.classList.toggle("active", simPaused);
  });

  hud.querySelectorAll("[data-speed]").forEach(btn => {
    btn.addEventListener("click", () => {
      hud.querySelectorAll("[data-speed]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      simMultiplier = parseFloat(btn.getAttribute("data-speed")) || 1;
    });
  });
}

// ── Rotate ETAs ───────────────────────────────────────────────
setInterval(() => {
  if (simPaused) return;
  BUS_DATA.forEach(bus => {
    const cur = busEtas[bus.busId];
    if (cur === "Arriving") {
      busEtas[bus.busId] = `${3 + Math.floor(Math.random() * 5)} min`;
    } else {
      const mins = parseInt(cur);
      if (!isNaN(mins) && mins > 1) {
        busEtas[bus.busId] = `${mins - 1} min`;
      } else {
        busEtas[bus.busId] = "Arriving";
      }
    }
    // Update sidebar card ETA
    const etaEl = document.getElementById(`eta-${bus.busId}`);
    if (etaEl) {
      etaEl.textContent = busEtas[bus.busId];
      etaEl.style.color = busEtas[bus.busId] === "Arriving" ? "#43e97b" : "#3ECFCF";
    }
  });
  document.getElementById("last-updated").textContent = "Updated just now";
}, 5000);

// ── Active Route Polyline Layer ───────────────────────────────
let activeRoutePolyline = null;

function drawBusRoute(bus) {
  if (activeRoutePolyline) {
    map.removeLayer(activeRoutePolyline);
    activeRoutePolyline = null;
  }
  if (typeof PMPML_ROUTES !== "undefined") {
    const rData = PMPML_ROUTES.find(r => r.id === bus.routeId || r.number === bus.routeId);
    if (rData && rData.stops && rData.stops.length > 1) {
      const latlngs = rData.stops.map(s => [s.lat, s.lng]);
      activeRoutePolyline = L.polyline(latlngs, {
        color: bus.color || "#6C63FF",
        weight: 5,
        opacity: 0.85,
        className: "animated-route-path"
      }).addTo(map);
    }
  }
}

// ── Build Sidebar Bus List ────────────────────────────────────
function buildSidebar() {
  const list   = document.getElementById("bus-list");
  const crowd  = getCrowdLevel();

  list.innerHTML = BUS_DATA.map(bus => `
    <div class="bus-card" id="card-${bus.busId}" onclick="focusBus('${bus.busId}')">
      <div class="bc-left">
        <div class="bc-badge" style="background:${bus.color}18;border:1px solid ${bus.color}40;color:${bus.color}">
          ${bus.routeId}
        </div>
      </div>
      <div class="bc-info">
        <div class="bc-route">${bus.from} → ${bus.to}</div>
        <div class="bc-near">📍 Near ${bus.nearStop}</div>
        <div class="bc-crowd" style="color:${crowd.color}">${crowd.emoji} ${crowd.label}</div>
      </div>
      <div class="bc-right">
        <div class="bc-eta" id="eta-${bus.busId}">${busEtas[bus.busId]}</div>
        <div class="bc-eta-label">ETA</div>
      </div>
    </div>
  `).join("");
}

// Focus map on a bus when sidebar card clicked
function focusBus(busId) {
  const { marker, bus } = busMarkers[busId];
  const pos = marker.getLatLng();
  drawBusRoute(bus);
  map.flyTo(pos, 15, { duration: 1.2 });
  setTimeout(() => openBusPopup(bus, marker), 1300);
}

// ── Filter Sidebar ────────────────────────────────────────────
document.getElementById("route-filter").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  document.querySelectorAll(".bus-card").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(q) ? "" : "none";
  });
});

// ── Map Controls ──────────────────────────────────────────────
document.getElementById("my-loc-btn").addEventListener("click", () => {
  map.flyTo([18.5204, 73.8567], 13, { duration: 1 });
});
document.getElementById("zoom-in-btn").addEventListener("click",  () => map.zoomIn());
document.getElementById("zoom-out-btn").addEventListener("click", () => map.zoomOut());

// ── Collapse Sidebar ──────────────────────────────────────────
document.getElementById("collapse-btn").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const btn     = document.getElementById("collapse-btn");
  sidebar.classList.toggle("sidebar-collapsed");
  btn.style.transform = sidebar.classList.contains("sidebar-collapsed") ? "rotate(180deg)" : "";
});

// ── Mobile Sidebar Toggle ─────────────────────────────────────
function toggleMobileSidebar() {
  document.getElementById("sidebar").classList.toggle("sidebar-mobile-open");
}

// ── Simulated Delay Alert ─────────────────────────────────────
function showDelayAlert() {
  const alerts = [
    { title: "⚠️ Delay Alert", body: "Route 15 delayed by 8 min near Swargate" },
    { title: "🔴 High Crowd",  body: "Route 4 very crowded. Next bus in 15 min" },
    { title: "✅ Back on Time", body: "Route 72A now running on schedule" }
  ];
  const alert = alerts[Math.floor(Math.random() * alerts.length)];
  document.getElementById("alert-title").textContent = alert.title;
  document.getElementById("alert-body").textContent  = alert.body;
  document.getElementById("sb-alert").style.display  = "flex";

  setTimeout(() => {
    document.getElementById("sb-alert").style.display = "none";
  }, 6000);
}

// Show first alert after 4 seconds, then every 30s
setTimeout(showDelayAlert, 4000);
setInterval(showDelayAlert, 30000);

// ── Update Stats Bar ──────────────────────────────────────────
function updateStats() {
  const hour     = new Date().getHours();
  const crowded  = [8, 9, 17, 18, 19].includes(hour) ? 5 : 2;
  const delayed  = Math.floor(Math.random() * 2) + 1;
  const onTime   = BUS_DATA.length - delayed;
  document.getElementById("stat-on-time").textContent = `${onTime} On Time`;
  document.getElementById("stat-delayed").textContent  = `${delayed} Delayed`;
  document.getElementById("stat-crowded").textContent  = `${crowded} Crowded`;
}
updateStats();
setInterval(updateStats, 15000);

// ── Init ──────────────────────────────────────────────────────
buildSidebar();
setupSimHUD();

// Navbar scroll effect
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 10);
});
