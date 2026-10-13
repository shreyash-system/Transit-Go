// ============================================================
//  TRANSITGO — LIVE MAP LOGIC (PMPML Bus + Pune Metro)
//  Leaflet.js + Real-Time Multimodal Simulation
// ============================================================

// ── Master Geographic Coordinates for Pune Stops & Stations ──
const STOP_COORDS = {
  // PMPML Bus Stops
  'Katraj':        [18.4529, 73.8553],
  'Ambegaon':      [18.4550, 73.8370],
  'Bibwewadi':     [18.4750, 73.8610],
  'Swargate':      [18.5018, 73.8580],
  'Market Yard':   [18.4905, 73.8682],
  'Fatima Nagar':  [18.5020, 73.8960],
  'Magarpatta':    [18.5158, 73.9272],
  'Hadapsar':      [18.5089, 73.9260],
  'Deccan Gymkhana': [18.5180, 73.8415],
  'FC Road':       [18.5250, 73.8410],
  'Paud Road':     [18.5080, 73.8120],
  'Karve Nagar':   [18.4910, 73.8180],
  'Warje':         [18.4810, 73.8010],
  'Kothrud':       [18.5074, 73.8077],
  'Shivajinagar':  [18.5314, 73.8446],
  'Pune Station':  [18.5285, 73.8745],
  'Camp':          [18.5132, 73.8778],
  'Wakad':         [18.5987, 73.7656],
  'Balewadi':      [18.5750, 73.7720],
  'Baner':         [18.5590, 73.7868],
  'Aundh':         [18.5580, 73.8070],
  'Sinhagad Road': [18.4820, 73.8340],
  'Pimpri':        [18.6279, 73.7997],
  'Chinchwad':     [18.6340, 73.7850],
  'Bhosari':       [18.6240, 73.8460],
  'Akurdi':        [18.6470, 73.7710],
  'Nigdi':         [18.6580, 73.7630],
  'Pashan':        [18.5400, 73.7920],
  'Vishrantwadi':  [18.5670, 73.8820],
  'Dhanori':       [18.5830, 73.8940],
  'Airport Road':  [18.5720, 73.9080],
  'Viman Nagar':   [18.5679, 73.9143],
  'Kalyani Nagar': [18.5470, 73.9030],
  'Koregaon Park': [18.5362, 73.8940],
  'Hinjewadi':     [18.5913, 73.7389],
  'Sus Road':      [18.5490, 73.7710],
  'Yerawada':      [18.5510, 73.8810],
  'Nagar Road':    [18.5550, 73.9050],
  'Kondhwa':       [18.4720, 73.8890],
  'NIBM Road':     [18.4780, 73.8990],
  'Undri':         [18.4590, 73.9120],
  'Nashik Phata':  [18.6048, 73.8162],
  'Kasarwadi':     [18.5947, 73.8214],
  'Dapodi':        [18.5746, 73.8315],
  'Khadki':        [18.5535, 73.8398],
  'Range Hills':   [18.5432, 73.8436],
  'Pimpri Chowk':  [18.6240, 73.8010],

  // Pune Metro Line 1 (Purple Line: PCMC to Swargate)
  'PCMC Metro':                 [18.6279, 73.7997],
  'Sant Tukaram Nagar Metro':   [18.6186, 73.8053],
  'Nashik Phata Metro':         [18.6048, 73.8162],
  'Kasarwadi Metro':            [18.5947, 73.8214],
  'Phugewadi Metro':            [18.5835, 73.8268],
  'Dapodi Metro':               [18.5746, 73.8315],
  'Bopkhel Metro':              [18.5630, 73.8360],
  'Khadki Metro':               [18.5535, 73.8398],
  'Range Hills Metro':          [18.5432, 73.8436],
  'Shivajinagar Metro':         [18.5320, 73.8475],
  'Civil Court Metro':          [18.5284, 73.8540],
  'Budhwar Peth Metro':         [18.5190, 73.8565],
  'Mandai Metro':               [18.5135, 73.8570],
  'Swargate Metro':             [18.5018, 73.8580],

  // Pune Metro Line 2 (Aqua Line: Vanaz to Ramwadi)
  'Vanaz Metro':                           [18.5034, 73.8038],
  'Anand Nagar Metro':                     [18.5065, 73.8122],
  'Ideal Colony Metro':                    [18.5100, 73.8188],
  'Nal Stop Metro':                        [18.5130, 73.8265],
  'Garware Metro':                         [18.5152, 73.8335],
  'Deccan Gymkhana Metro':                 [18.5180, 73.8415],
  'Chhatrapati Sambhajinagar Chowk Metro': [18.5215, 73.8480],
  'PMC Metro':                             [18.5235, 73.8525],
  'Mangalwar Peth Metro':                  [18.5275, 73.8630],
  'Pune Station Metro':                    [18.5285, 73.8745],
  'Ruby Hall Metro':                       [18.5320, 73.8820],
  'Bund Garden Metro':                     [18.5380, 73.8895],
  'Yerwada Metro':                         [18.5490, 73.8965],
  'Kalyani Nagar Metro':                   [18.5520, 73.9070],
  'Ramwadi Metro':                         [18.5540, 73.9215]
};

// ── Metro Route Station Geometry Sequences ────────────────────
const METRO_LINE_1_STATIONS = [
  'PCMC Metro', 'Sant Tukaram Nagar Metro', 'Nashik Phata Metro',
  'Kasarwadi Metro', 'Phugewadi Metro', 'Dapodi Metro',
  'Bopkhel Metro', 'Khadki Metro', 'Range Hills Metro',
  'Shivajinagar Metro', 'Civil Court Metro', 'Budhwar Peth Metro',
  'Mandai Metro', 'Swargate Metro'
];

const METRO_LINE_2_STATIONS = [
  'Vanaz Metro', 'Anand Nagar Metro', 'Ideal Colony Metro',
  'Nal Stop Metro', 'Garware Metro', 'Deccan Gymkhana Metro',
  'Chhatrapati Sambhajinagar Chowk Metro', 'PMC Metro',
  'Civil Court Metro', 'Mangalwar Peth Metro', 'Pune Station Metro',
  'Ruby Hall Metro', 'Bund Garden Metro', 'Yerwada Metro',
  'Kalyani Nagar Metro', 'Ramwadi Metro'
];

// ── PMPML Bus Fleet (Real coordinates) ─────────────────────────
const BUS_DATA = [
  { busId: 'BUS-15-A',  routeId: '15',  route: 'Route 15',  from: 'Katraj',          to: 'Hadapsar',     lat: 18.4820, lng: 73.8620, nearStop: 'Swargate',     fare: 14, color: '#6C63FF', phase: 0.15 },
  { busId: 'BUS-72A-B', routeId: '72A', route: 'Route 72A', from: 'Deccan Gymkhana', to: 'Kothrud',      lat: 18.5140, lng: 73.8340, nearStop: 'FC Road',      fare: 10, color: '#f5576c', phase: 0.42 },
  { busId: 'BUS-11-C',  routeId: '11',  route: 'Route 11',  from: 'Shivajinagar',    to: 'Swargate',     lat: 18.5210, lng: 73.8580, nearStop: 'Pune Station', fare: 8,  color: '#3ECFCF', phase: 0.68 },
  { busId: 'BUS-50-D',  routeId: '50',  route: 'Route 50',  from: 'Wakad',           to: 'Swargate',     lat: 18.5520, lng: 73.7920, nearStop: 'Baner',        fare: 20, color: '#43e97b', phase: 0.85 },
  { busId: 'BUS-106-E', routeId: '106', route: 'Route 106', from: 'Warje',           to: 'Hadapsar',     lat: 18.4874, lng: 73.8210, nearStop: 'Sinhagad Road',fare: 15, color: '#fee140', phase: 0.31 },
  { busId: 'BUS-4-F',   routeId: '4',   route: 'Route 4',   from: 'Pimpri',          to: 'Swargate',     lat: 18.5780, lng: 73.8290, nearStop: 'Aundh',        fare: 18, color: '#f093fb', phase: 0.53 },
  { busId: 'BUS-155-G', routeId: '155', route: 'Route 155', from: 'Katraj',          to: 'Wakad',        lat: 18.4720, lng: 73.8230, nearStop: 'Karve Nagar',  fare: 22, color: '#4facfe', phase: 0.77 },
  { busId: 'BUS-32-H',  routeId: '32',  route: 'Route 32',  from: 'Vishrantwadi',    to: 'Hadapsar',     lat: 18.5560, lng: 73.9050, nearStop: 'Viman Nagar',  fare: 16, color: '#a18cd1', phase: 0.91 }
];

// ── Pune Metro Train Fleet ─────────────────────────────────────
const METRO_DATA = [
  {
    metroId:   'METRO-P1',
    lineId:    'M1',
    lineName:  'Purple Line',
    lineColor: '#8B5CF6',
    from:      'PCMC Metro',
    to:        'Swargate Metro',
    stations:  METRO_LINE_1_STATIONS,
    progress:  0.42,
    direction: 1,
    nearStop:  'Khadki Metro',
    fare:      25,
    speedKmh:  35
  },
  {
    metroId:   'METRO-P2',
    lineId:    'M1',
    lineName:  'Purple Line',
    lineColor: '#8B5CF6',
    from:      'Swargate Metro',
    to:        'PCMC Metro',
    stations:  [...METRO_LINE_1_STATIONS].reverse(),
    progress:  0.68,
    direction: 1,
    nearStop:  'Shivajinagar Metro',
    fare:      20,
    speedKmh:  38
  },
  {
    metroId:   'METRO-A1',
    lineId:    'M2',
    lineName:  'Aqua Line',
    lineColor: '#06B6D4',
    from:      'Vanaz Metro',
    to:        'Ramwadi Metro',
    stations:  METRO_LINE_2_STATIONS,
    progress:  0.35,
    direction: 1,
    nearStop:  'Deccan Gymkhana Metro',
    fare:      22,
    speedKmh:  34
  },
  {
    metroId:   'METRO-A2',
    lineId:    'M2',
    lineName:  'Aqua Line',
    lineColor: '#06B6D4',
    from:      'Ramwadi Metro',
    to:        'Vanaz Metro',
    stations:  [...METRO_LINE_2_STATIONS].reverse(),
    progress:  0.72,
    direction: 1,
    nearStop:  'Bund Garden Metro',
    fare:      20,
    speedKmh:  36
  }
];

// ── Simulation and Map State ──────────────────────────────────
let activeFilterMode = 'all'; // 'all' | 'bus' | 'metro'
let simMultiplier    = 1;
let simPaused        = false;
let simStepCount     = 0;

const busMarkers   = {};
const metroMarkers = {};
const vehicleEtas  = {};

let purpleLineLayer    = null;
let aquaLineLayer      = null;
let metroStationsLayer = null;
let activePolyline     = null;

// ── Initialize Map ────────────────────────────────────────────
const map = L.map('map-container', {
  center:             [18.5284, 73.8540], // Centered at Pune Civil Court interchange
  zoom:               12,
  zoomControl:        false,
  attributionControl: true
});

// Tile layer with OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | TransitGo Pune (PMPML & Pune Metro)',
  maxZoom: 19
}).addTo(map);

// User location marker (Pune city center)
const myLocIcon = L.divIcon({
  className: '',
  html: `<div class="my-location-marker">
           <div class="my-pulse-ring"></div>
           <div class="my-core-dot"></div>
         </div>`,
  iconSize:   [32, 32],
  iconAnchor: [16, 16]
});

L.marker([18.5204, 73.8567], { icon: myLocIcon, zIndexOffset: 1000 })
  .addTo(map)
  .bindTooltip('📍 You are here (Pune Centre)', { permanent: false, direction: 'top' });

// ── Draw Pune Metro Lines & Stations ──────────────────────────
function initMetroInfrastructure() {
  const line1Coords = METRO_LINE_1_STATIONS.map(s => STOP_COORDS[s]).filter(Boolean);
  const line2Coords = METRO_LINE_2_STATIONS.map(s => STOP_COORDS[s]).filter(Boolean);

  // Purple Line (Line 1) Glow + Main Track
  const pGlow = L.polyline(line1Coords, { color: '#8B5CF6', weight: 10, opacity: 0.35 });
  const pMain = L.polyline(line1Coords, { color: '#8B5CF6', weight: 4.5, opacity: 0.95 });
  purpleLineLayer = L.layerGroup([pGlow, pMain]).addTo(map);

  // Aqua Line (Line 2) Glow + Main Track
  const aGlow = L.polyline(line2Coords, { color: '#06B6D4', weight: 10, opacity: 0.35 });
  const aMain = L.polyline(line2Coords, { color: '#06B6D4', weight: 4.5, opacity: 0.95 });
  aquaLineLayer = L.layerGroup([aGlow, aMain]).addTo(map);

  // Metro Stations Markers Layer
  const stMarkers = [];
  const allMetroStations = new Set([...METRO_LINE_1_STATIONS, ...METRO_LINE_2_STATIONS]);

  allMetroStations.forEach(stName => {
    const coord = STOP_COORDS[stName];
    if (!coord) return;

    const isInterchange = (stName === 'Civil Court Metro');
    const isAquaOnly    = METRO_LINE_2_STATIONS.includes(stName) && !METRO_LINE_1_STATIONS.includes(stName);

    let html = '';
    if (isInterchange) {
      html = `<div class="metro-interchange-dot" title="Civil Court Interchange"></div>`;
    } else {
      html = `<div class="metro-station-dot ${isAquaOnly ? 'aqua-station' : ''}" title="${stName}"></div>`;
    }

    const stIcon = L.divIcon({
      className: '',
      html,
      iconSize:   isInterchange ? [16, 16] : [12, 12],
      iconAnchor: isInterchange ? [8, 8]   : [6, 6]
    });

    const cleanName = stName.replace(' Metro', '');
    const lineLabel = isInterchange ? 'Interchange (Purple Line ✕ Aqua Line)'
                    : isAquaOnly    ? 'Aqua Line (Line 2)'
                    : 'Purple Line (Line 1)';

    const m = L.marker(coord, { icon: stIcon, zIndexOffset: 300 });
    m.bindTooltip(`<strong>${cleanName}</strong><br><small style="color:#94a3b8">${lineLabel}</small>`, {
      direction: 'top',
      offset: [0, -6]
    });

    stMarkers.push(m);
  });

  metroStationsLayer = L.layerGroup(stMarkers).addTo(map);
}

// ── Helpers for Metro Coordinate Interpolation ────────────────
function getPolylinePoint(stationNames, progress) {
  const coords = stationNames.map(s => STOP_COORDS[s]).filter(Boolean);
  if (!coords.length) return [18.5204, 73.8567];
  if (progress <= 0) return coords[0];
  if (progress >= 1) return coords[coords.length - 1];

  const totalSegments = coords.length - 1;
  const targetIndex   = progress * totalSegments;
  const segIdx        = Math.min(Math.floor(targetIndex), totalSegments - 1);
  const segFrac       = targetIndex - segIdx;

  const [lat1, lng1] = coords[segIdx];
  const [lat2, lng2] = coords[segIdx + 1];

  return [
    lat1 + (lat2 - lat1) * segFrac,
    lng1 + (lng2 - lng1) * segFrac
  ];
}

function getNextStationName(stations, progress) {
  const idx = Math.min(Math.floor(progress * stations.length) + 1, stations.length - 1);
  return stations[idx] || stations[stations.length - 1];
}

// ── Create Bus Markers ────────────────────────────────────────
function initBusMarkers() {
  BUS_DATA.forEach(bus => {
    vehicleEtas[bus.busId] = `${Math.floor(Math.random() * 5) + 2} min`;

    const icon = L.divIcon({
      className: '',
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
    marker.on('click', () => openBusPopup(bus, marker));
    busMarkers[bus.busId] = { marker, bus };
  });
}

// ── Create Metro Train Markers ────────────────────────────────
function initMetroMarkers() {
  METRO_DATA.forEach(metro => {
    vehicleEtas[metro.metroId] = `${Math.floor(Math.random() * 4) + 2} min`;

    const pos = getPolylinePoint(metro.stations, metro.progress);

    const icon = L.divIcon({
      className: '',
      html: `<div class="metro-marker-wrapper" id="marker-${metro.metroId}">
               <div class="metro-beacon-pulse" style="border-color:${metro.lineColor}"></div>
               <div class="metro-marker-body" style="border-color:${metro.lineColor}">
                 🚇
               </div>
               <div class="metro-marker-tag" style="background:${metro.lineColor}">${metro.lineId}</div>
             </div>`,
      iconSize:   [46, 56],
      iconAnchor: [23, 56]
    });

    const marker = L.marker(pos, { icon, zIndexOffset: 700 }).addTo(map);
    marker.on('click', () => openMetroPopup(metro, marker));
    metroMarkers[metro.metroId] = { marker, metro };
  });
}

// ── Bus Popup ─────────────────────────────────────────────────
function openBusPopup(bus, marker) {
  const crowd    = typeof getCrowdLevel === 'function' ? getCrowdLevel() : { emoji: '🟡', label: 'Moderate', color: '#fee140' };
  const eta      = vehicleEtas[bus.busId] || '3 min';
  const isOnTime = !eta.includes('Delay');

  const popupHtml = `
    <div class="bus-popup">
      <div class="bp-header">
        <div class="bp-badge" style="background:${bus.color}20;border-color:${bus.color}50;color:${bus.color}">
          🚌 Route ${bus.routeId}
        </div>
        <div class="bp-info">
          <div class="bp-route">${bus.from} → ${bus.to}</div>
          <div class="bp-status" style="color:${isOnTime ? '#43e97b' : '#fee140'}">
            ${isOnTime ? '✅ On Time' : '⚠️ Slight Delay'}
          </div>
        </div>
      </div>
      <div class="bp-body">
        <div class="bp-row">
          <span class="bp-label">📍 Near Stop</span>
          <span class="bp-val">${bus.nearStop}</span>
        </div>
        <div class="bp-row">
          <span class="bp-label">⏱️ Next stop in</span>
          <span class="bp-val" style="color:#3ECFCF;font-weight:800">${eta}</span>
        </div>
        <div class="bp-row">
          <span class="bp-label">👥 Crowd level</span>
          <span class="bp-val" style="color:${crowd.color}">${crowd.emoji} ${crowd.label}</span>
        </div>
        <div class="bp-row">
          <span class="bp-label">💰 Fare</span>
          <span class="bp-val">₹${bus.fare}</span>
        </div>
      </div>
      <div class="bp-actions">
        <a class="bp-btn bp-btn-primary"
           href="booking.html?route=${encodeURIComponent(bus.routeId)}&from=${encodeURIComponent(bus.from)}&to=${encodeURIComponent(bus.to)}">
          🎫 Book Ticket
        </a>
        <a class="bp-btn bp-btn-secondary"
           href="timetable.html?route=${encodeURIComponent(bus.routeId)}">
          📅 Timetable
        </a>
      </div>
    </div>`;

  marker.bindPopup(popupHtml, { maxWidth: 290, className: 'tg-popup', closeButton: true }).openPopup();

  highlightSidebarCard(`card-${bus.busId}`);
}

// ── Metro Popup ───────────────────────────────────────────────
function openMetroPopup(metro, marker) {
  const nextSt   = getNextStationName(metro.stations, metro.progress).replace(' Metro', '');
  const eta      = vehicleEtas[metro.metroId] || '2 min';

  const popupHtml = `
    <div class="bus-popup">
      <div class="bp-header">
        <div class="bp-badge" style="background:${metro.lineColor}25;border-color:${metro.lineColor}60;color:${metro.lineColor}">
          🚇 ${metro.lineId} · ${metro.lineName}
        </div>
        <div class="bp-info">
          <div class="bp-route">${metro.from.replace(' Metro','')} → ${metro.to.replace(' Metro','')}</div>
          <div class="bp-status" style="color:#43e97b">
            ⚡ High-Frequency (Every 8 min)
          </div>
        </div>
      </div>
      <div class="bp-body">
        <div class="bp-row">
          <span class="bp-label">🚉 Next Station</span>
          <span class="bp-val" style="color:${metro.lineColor};font-weight:700">${nextSt}</span>
        </div>
        <div class="bp-row">
          <span class="bp-label">⏱️ Arriving In</span>
          <span class="bp-val" style="color:#3ECFCF;font-weight:800">${eta}</span>
        </div>
        <div class="bp-row">
          <span class="bp-label">❄️ Features</span>
          <span class="bp-val">Air Conditioned · CCTV</span>
        </div>
        <div class="bp-row">
          <span class="bp-label">💰 Fare Range</span>
          <span class="bp-val">₹10 – ₹${metro.fare}</span>
        </div>
      </div>
      <div class="bp-actions">
        <a class="bp-btn bp-btn-primary"
           style="background:${metro.lineColor}"
           href="booking.html?route=${encodeURIComponent(metro.lineId)}&from=${encodeURIComponent(metro.from)}&to=${encodeURIComponent(metro.to)}">
          🎫 Book Metro
        </a>
        <a class="bp-btn bp-btn-secondary"
           href="timetable.html?route=${encodeURIComponent(metro.lineId)}">
          📅 Metro Schedule
        </a>
      </div>
    </div>`;

  marker.bindPopup(popupHtml, { maxWidth: 300, className: 'tg-popup', closeButton: true }).openPopup();

  highlightSidebarCard(`card-${metro.metroId}`);
}

function highlightSidebarCard(cardId) {
  document.querySelectorAll('.bus-card').forEach(c => c.classList.remove('bus-card-active'));
  const card = document.getElementById(cardId);
  if (card) {
    card.classList.add('bus-card-active');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ── Draw Route Polyline on Focus ──────────────────────────────
function drawVehicleRoute(vehicle, isMetro = false) {
  if (activePolyline) {
    map.removeLayer(activePolyline);
    activePolyline = null;
  }

  if (isMetro) {
    const coords = vehicle.stations.map(s => STOP_COORDS[s]).filter(Boolean);
    if (coords.length > 1) {
      activePolyline = L.polyline(coords, {
        color:     vehicle.lineColor || '#8B5CF6',
        weight:    6,
        opacity:   0.9,
        className: 'animated-route-path'
      }).addTo(map);
    }
    return;
  }

  // Bus route: look up stops in PMPML_ROUTES and fetch coordinates from STOP_COORDS
  if (typeof PMPML_ROUTES !== 'undefined') {
    const rData = PMPML_ROUTES.find(r => r.id === vehicle.routeId);
    if (rData && rData.stops && rData.stops.length > 1) {
      const latlngs = rData.stops
        .map(s => STOP_COORDS[s.name])
        .filter(Boolean);

      if (latlngs.length > 1) {
        activePolyline = L.polyline(latlngs, {
          color:     vehicle.color || '#6C63FF',
          weight:    5,
          opacity:   0.85,
          className: 'animated-route-path'
        }).addTo(map);
      }
    }
  }
}

// ── Unified Animation Loop ────────────────────────────────────
function animateSimulation() {
  if (simPaused) return;

  simStepCount += 1;
  const delta = (0.0035 * simMultiplier);

  // 1. Animate Metro Trains along actual station tracks
  METRO_DATA.forEach(metro => {
    metro.progress += delta * (metro.direction || 1);

    if (metro.progress >= 0.98) {
      metro.progress = 0.98;
      metro.direction = -1;
    } else if (metro.progress <= 0.02) {
      metro.progress = 0.02;
      metro.direction = 1;
    }

    const newPos = getPolylinePoint(metro.stations, metro.progress);
    if (metroMarkers[metro.metroId]) {
      metroMarkers[metro.metroId].marker.setLatLng(newPos);
    }
  });

  // 2. Animate PMPML Buses along realistic trajectory
  BUS_DATA.forEach((bus, i) => {
    const angle = (simStepCount * 0.04 * simMultiplier) + (bus.phase * Math.PI * 2);
    const radiusLat = 0.005;
    const radiusLng = 0.008;

    const newLat = bus.lat + Math.sin(angle) * radiusLat;
    const newLng = bus.lng + Math.cos(angle * 0.8) * radiusLng;

    if (busMarkers[bus.busId]) {
      busMarkers[bus.busId].marker.setLatLng([newLat, newLng]);
    }
  });
}

setInterval(animateSimulation, 500);

// ── Rotate ETAs Realistically ─────────────────────────────────
setInterval(() => {
  if (simPaused) return;

  const updateList = [
    ...BUS_DATA.map(b => ({ id: b.busId, isMetro: false })),
    ...METRO_DATA.map(m => ({ id: m.metroId, isMetro: true }))
  ];

  updateList.forEach(v => {
    const cur = vehicleEtas[v.id] || '3 min';
    if (cur === 'Arriving') {
      vehicleEtas[v.id] = `${Math.floor(Math.random() * 4) + 3} min`;
    } else {
      const mins = parseInt(cur);
      if (!isNaN(mins) && mins > 1) {
        vehicleEtas[v.id] = `${mins - 1} min`;
      } else {
        vehicleEtas[v.id] = 'Arriving';
      }
    }

    const etaEl = document.getElementById(`eta-${v.id}`);
    if (etaEl) {
      etaEl.textContent = vehicleEtas[v.id];
      etaEl.style.color = vehicleEtas[v.id] === 'Arriving' ? '#43e97b' : '#3ECFCF';
    }
  });

  const lastUpEl = document.getElementById('last-updated');
  if (lastUpEl) lastUpEl.textContent = 'Updated just now';
}, 5000);

// ── Sidebar Building & Filtering ──────────────────────────────
function buildSidebar() {
  const list = document.getElementById('bus-list');
  if (!list) return;

  const crowd = typeof getCrowdLevel === 'function' ? getCrowdLevel() : { emoji: '🟢', label: 'Comfortable', color: '#43e97b' };

  let html = '';

  // Render Buses
  if (activeFilterMode === 'all' || activeFilterMode === 'bus') {
    BUS_DATA.forEach(bus => {
      html += `
        <div class="bus-card" id="card-${bus.busId}" data-type="bus" onclick="focusBus('${bus.busId}')">
          <div class="bc-left">
            <div class="bc-badge" style="background:${bus.color}18;border:1px solid ${bus.color}40;color:${bus.color}">
              🚌 ${bus.routeId}
            </div>
          </div>
          <div class="bc-info">
            <div class="bc-route">${bus.from} → ${bus.to}</div>
            <div class="bc-near">📍 Near ${bus.nearStop}</div>
            <div class="bc-crowd" style="color:${crowd.color}">${crowd.emoji} ${crowd.label}</div>
          </div>
          <div class="bc-right">
            <div class="bc-eta" id="eta-${bus.busId}">${vehicleEtas[bus.busId] || '3 min'}</div>
            <div class="bc-eta-label">ETA</div>
          </div>
        </div>`;
    });
  }

  // Render Metro Trains
  if (activeFilterMode === 'all' || activeFilterMode === 'metro') {
    METRO_DATA.forEach(metro => {
      const nextSt = getNextStationName(metro.stations, metro.progress).replace(' Metro', '');
      html += `
        <div class="bus-card" id="card-${metro.metroId}" data-type="metro" onclick="focusMetro('${metro.metroId}')">
          <div class="bc-left">
            <div class="bc-badge" style="background:${metro.lineColor}22;border:1px solid ${metro.lineColor}50;color:${metro.lineColor}">
              🚇 ${metro.lineId}
            </div>
          </div>
          <div class="bc-info">
            <div class="bc-route">${metro.from.replace(' Metro','')} → ${metro.to.replace(' Metro','')}</div>
            <div class="bc-near" style="color:${metro.lineColor}">🚉 Next: ${nextSt}</div>
            <div class="bc-crowd" style="color:#3ECFCF">⚡ ${metro.lineName}</div>
          </div>
          <div class="bc-right">
            <div class="bc-eta" id="eta-${metro.metroId}" style="color:${metro.lineColor}">${vehicleEtas[metro.metroId] || '2 min'}</div>
            <div class="bc-eta-label">ETA</div>
          </div>
        </div>`;
    });
  }

  list.innerHTML = html;
  applySearchFilter();
  updateCounters();
}

function focusBus(busId) {
  const item = busMarkers[busId];
  if (!item) return;
  const { marker, bus } = item;
  drawVehicleRoute(bus, false);
  map.flyTo(marker.getLatLng(), 15, { duration: 1.1 });
  setTimeout(() => openBusPopup(bus, marker), 1200);
}

function focusMetro(metroId) {
  const item = metroMarkers[metroId];
  if (!item) return;
  const { marker, metro } = item;
  drawVehicleRoute(metro, true);
  map.flyTo(marker.getLatLng(), 15, { duration: 1.1 });
  setTimeout(() => openMetroPopup(metro, marker), 1200);
}

// ── Search & Filter Logic ─────────────────────────────────────
function applySearchFilter() {
  const input = document.getElementById('route-filter');
  const q = input ? input.value.toLowerCase().trim() : '';
  document.querySelectorAll('.bus-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = (q === '' || text.includes(q)) ? '' : 'none';
  });
}

const routeFilterInput = document.getElementById('route-filter');
if (routeFilterInput) {
  routeFilterInput.addEventListener('input', applySearchFilter);
}

// Mode filter buttons (All, Buses, Metro)
function setupModeFilters() {
  const filterBtns = document.querySelectorAll('.sb-mode-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilterMode = btn.getAttribute('data-mode') || 'all';

      // Toggle map markers visibility based on mode
      const showBuses  = (activeFilterMode === 'all' || activeFilterMode === 'bus');
      const showMetros = (activeFilterMode === 'all' || activeFilterMode === 'metro');

      Object.values(busMarkers).forEach(b => {
        if (showBuses) {
          if (!map.hasLayer(b.marker)) map.addLayer(b.marker);
        } else {
          if (map.hasLayer(b.marker)) map.removeLayer(b.marker);
        }
      });

      Object.values(metroMarkers).forEach(m => {
        if (showMetros) {
          if (!map.hasLayer(m.marker)) map.addLayer(m.marker);
        } else {
          if (map.hasLayer(m.marker)) map.removeLayer(m.marker);
        }
      });

      buildSidebar();
    });
  });
}

function updateCounters() {
  const busCountEl   = document.getElementById('bus-count');
  const metroCountEl = document.getElementById('metro-count');
  const cntAllEl     = document.getElementById('count-all');
  const cntBusesEl   = document.getElementById('count-buses');
  const cntMetrosEl  = document.getElementById('count-metros');

  if (busCountEl)   busCountEl.textContent   = BUS_DATA.length;
  if (metroCountEl) metroCountEl.textContent = METRO_DATA.length;
  if (cntAllEl)     cntAllEl.textContent     = BUS_DATA.length + METRO_DATA.length;
  if (cntBusesEl)   cntBusesEl.textContent   = BUS_DATA.length;
  if (cntMetrosEl)  cntMetrosEl.textContent  = METRO_DATA.length;
}

// ── Map Controls & Layer Toggles ──────────────────────────────
function setupMapControls() {
  const myLocBtn = document.getElementById('my-loc-btn');
  if (myLocBtn) {
    myLocBtn.addEventListener('click', () => {
      map.flyTo([18.5284, 73.8540], 13, { duration: 1.2 });
    });
  }

  const zIn = document.getElementById('zoom-in-btn');
  if (zIn) zIn.addEventListener('click', () => map.zoomIn());

  const zOut = document.getElementById('zoom-out-btn');
  if (zOut) zOut.addEventListener('click', () => map.zoomOut());

  // Collapse sidebar
  const collapseBtn = document.getElementById('collapse-btn');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) {
        sidebar.classList.toggle('sidebar-collapsed');
        collapseBtn.style.transform = sidebar.classList.contains('sidebar-collapsed') ? 'rotate(180deg)' : '';
      }
    });
  }

  // Layer toggle: Purple Line
  const togPurple = document.getElementById('toggle-purple-line');
  if (togPurple) {
    togPurple.addEventListener('click', () => {
      if (map.hasLayer(purpleLineLayer)) {
        map.removeLayer(purpleLineLayer);
        togPurple.classList.remove('active-purple');
      } else {
        map.addLayer(purpleLineLayer);
        togPurple.classList.add('active-purple');
      }
    });
  }

  // Layer toggle: Aqua Line
  const togAqua = document.getElementById('toggle-aqua-line');
  if (togAqua) {
    togAqua.addEventListener('click', () => {
      if (map.hasLayer(aquaLineLayer)) {
        map.removeLayer(aquaLineLayer);
        togAqua.classList.remove('active-aqua');
      } else {
        map.addLayer(aquaLineLayer);
        togAqua.classList.add('active-aqua');
      }
    });
  }

  // Layer toggle: Metro Stations
  const togStations = document.getElementById('toggle-stations');
  if (togStations) {
    togStations.addEventListener('click', () => {
      if (map.hasLayer(metroStationsLayer)) {
        map.removeLayer(metroStationsLayer);
        togStations.classList.remove('active');
      } else {
        map.addLayer(metroStationsLayer);
        togStations.classList.add('active');
      }
    });
  }
}

// ── Floating Simulation HUD ───────────────────────────────────
function setupSimHUD() {
  const mapWrapper = document.querySelector('.map-wrapper') || document.getElementById('map-container');
  if (!mapWrapper || document.getElementById('sim-playback-hud')) return;

  const hud = document.createElement('div');
  hud.id = 'sim-playback-hud';
  hud.className = 'sim-playback-hud';
  hud.innerHTML = `
    <div class="sim-hud-title"><span>📡</span> Live Sim</div>
    <button type="button" class="sim-btn" id="sim-pause-btn" title="Pause or Resume Simulation">⏸️ Pause</button>
    <button type="button" class="sim-btn active" data-speed="1">1x</button>
    <button type="button" class="sim-btn" data-speed="2">2x</button>
    <button type="button" class="sim-btn" data-speed="5">5x</button>
  `;
  mapWrapper.appendChild(hud);

  const pauseBtn = hud.querySelector('#sim-pause-btn');
  pauseBtn.addEventListener('click', () => {
    simPaused = !simPaused;
    pauseBtn.textContent = simPaused ? '▶️ Play' : '⏸️ Pause';
    pauseBtn.classList.toggle('active', simPaused);
  });

  hud.querySelectorAll('[data-speed]').forEach(btn => {
    btn.addEventListener('click', () => {
      hud.querySelectorAll('[data-speed]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      simMultiplier = parseFloat(btn.getAttribute('data-speed')) || 1;
    });
  });
}

// ── Random Simulated Delay Alerts ─────────────────────────────
function showDelayAlert() {
  const alerts = [
    { title: '⚠️ Delay Alert',      body: 'Route 15 delayed by 8 min near Swargate' },
    { title: '🟣 Metro Update',     body: 'Purple Line running at high peak frequency (Every 6 min)' },
    { title: '🔴 High Crowd Alert', body: 'Route 4 very crowded. Additional bus deployed in 10 min' },
    { title: '🔵 Aqua Line Update',  body: 'Aqua Line running on time between Vanaz and Ramwadi' },
    { title: '✅ Back on Schedule', body: 'Route 72A normalized and running on time' }
  ];
  const alert = alerts[Math.floor(Math.random() * alerts.length)];
  const titleEl = document.getElementById('alert-title');
  const bodyEl  = document.getElementById('alert-body');
  const box     = document.getElementById('sb-alert');
  if (!box || !titleEl || !bodyEl) return;

  titleEl.textContent = alert.title;
  bodyEl.textContent  = alert.body;
  box.style.display   = 'flex';

  setTimeout(() => {
    if (box) box.style.display = 'none';
  }, 6000);
}

setTimeout(showDelayAlert, 4000);
setInterval(showDelayAlert, 30000);

// ── Live Stats Bar ────────────────────────────────────────────
function updateStats() {
  const totalVehicles = BUS_DATA.length + METRO_DATA.length;
  const delayed       = Math.floor(Math.random() * 2) + 1;
  const onTime        = totalVehicles - delayed;
  const crowded       = 3;

  const onTimeEl  = document.getElementById('stat-on-time');
  const delayedEl = document.getElementById('stat-delayed');
  const crowdedEl = document.getElementById('stat-crowded');

  if (onTimeEl)  onTimeEl.textContent  = `${onTime} On Time`;
  if (delayedEl) delayedEl.textContent = `${delayed} Delayed`;
  if (crowdedEl) crowdedEl.textContent = `${crowded} Crowded`;
}

updateStats();
setInterval(updateStats, 15000);

// ── Initialize Everything ─────────────────────────────────────
initMetroInfrastructure();
initBusMarkers();
initMetroMarkers();
buildSidebar();
setupModeFilters();
setupMapControls();
setupSimHUD();
