// ============================================================
//  TRANSITGO — PMPML ROUTE DATASET
//  Static data for 8 real Pune PMPML bus routes
//  Used by: search.js, timetable.js, map.js
// ============================================================

// ── Master stop list (autocomplete source) ──────────────────
const PUNE_STOPS = [
  "Katraj", "Ambegaon", "Swargate", "Market Yard", "Fatima Nagar",
  "Hadapsar", "Magarpatta", "Kharadi", "Viman Nagar",
  "Deccan Gymkhana", "FC Road", "Shivajinagar", "Pune Station",
  "Camp", "Koregaon Park",
  "Kothrud", "Warje", "Karve Nagar", "Paud Road",
  "Wakad", "Baner", "Aundh", "Hinjewadi",
  "Pimpri", "Chinchwad", "Bhosari", "Akurdi",
  "Vishrantwadi", "Kalyani Nagar", "Airport Road",
  "Bibwewadi", "Kondhwa", "NIBM Road",
  "Sinhagad Road", "Bavdhan", "Pashan",
  "Yerawada", "Nagar Road", "Wagholi"
];

// ── Route definitions ────────────────────────────────────────
const PMPML_ROUTES = [
  {
    id: "15",
    name: "Route 15",
    from: "Katraj",
    to: "Hadapsar",
    via: ["Swargate", "Market Yard"],
    stops: [
      { name: "Katraj",        offsetMin: 0  },
      { name: "Ambegaon",      offsetMin: 7  },
      { name: "Swargate",      offsetMin: 15 },
      { name: "Market Yard",   offsetMin: 20 },
      { name: "Fatima Nagar",  offsetMin: 28 },
      { name: "Hadapsar",      offsetMin: 38 }
    ],
    fare: 12,
    durationMin: 38,
    frequency: "Every 15 min",
    firstBus: "05:30",
    lastBus: "23:00",
    color: "#6C63FF",
    acAvailable: false,
    type: "Regular"
  },
  {
    id: "72A",
    name: "Route 72A",
    from: "Deccan Gymkhana",
    to: "Kothrud",
    via: ["FC Road", "Karve Nagar"],
    stops: [
      { name: "Deccan Gymkhana", offsetMin: 0  },
      { name: "FC Road",         offsetMin: 6  },
      { name: "Karve Nagar",     offsetMin: 14 },
      { name: "Kothrud",         offsetMin: 22 }
    ],
    fare: 10,
    durationMin: 22,
    frequency: "Every 20 min",
    firstBus: "06:00",
    lastBus: "22:30",
    color: "#f5576c",
    acAvailable: false,
    type: "Regular"
  },
  {
    id: "11",
    name: "Route 11",
    from: "Shivajinagar",
    to: "Swargate",
    via: ["Pune Station", "Camp"],
    stops: [
      { name: "Shivajinagar",  offsetMin: 0  },
      { name: "Pune Station",  offsetMin: 8  },
      { name: "Camp",          offsetMin: 15 },
      { name: "Swargate",      offsetMin: 22 }
    ],
    fare: 8,
    durationMin: 22,
    frequency: "Every 10 min",
    firstBus: "05:45",
    lastBus: "23:00",
    color: "#3ECFCF",
    acAvailable: false,
    type: "Regular"
  },
  {
    id: "50",
    name: "Route 50",
    from: "Wakad",
    to: "Swargate",
    via: ["Baner", "Aundh", "Shivajinagar"],
    stops: [
      { name: "Wakad",          offsetMin: 0  },
      { name: "Baner",          offsetMin: 10 },
      { name: "Aundh",          offsetMin: 18 },
      { name: "Shivajinagar",   offsetMin: 28 },
      { name: "Pune Station",   offsetMin: 35 },
      { name: "Swargate",       offsetMin: 45 }
    ],
    fare: 20,
    durationMin: 45,
    frequency: "Every 25 min",
    firstBus: "06:30",
    lastBus: "21:00",
    color: "#43e97b",
    acAvailable: false,
    type: "Regular"
  },
  {
    id: "106",
    name: "Route 106",
    from: "Warje",
    to: "Hadapsar",
    via: ["Sinhagad Road", "Swargate", "Market Yard"],
    stops: [
      { name: "Warje",          offsetMin: 0  },
      { name: "Sinhagad Road",  offsetMin: 8  },
      { name: "Karve Nagar",    offsetMin: 15 },
      { name: "Swargate",       offsetMin: 25 },
      { name: "Market Yard",    offsetMin: 30 },
      { name: "Hadapsar",       offsetMin: 42 }
    ],
    fare: 15,
    durationMin: 42,
    frequency: "Every 20 min",
    firstBus: "06:00",
    lastBus: "22:00",
    color: "#fee140",
    acAvailable: false,
    type: "Regular"
  },
  {
    id: "4",
    name: "Route 4",
    from: "Pimpri",
    to: "Swargate",
    via: ["Aundh", "Shivajinagar", "Pune Station"],
    stops: [
      { name: "Pimpri",         offsetMin: 0  },
      { name: "Aundh",          offsetMin: 15 },
      { name: "Shivajinagar",   offsetMin: 28 },
      { name: "Pune Station",   offsetMin: 36 },
      { name: "Camp",           offsetMin: 42 },
      { name: "Swargate",       offsetMin: 50 }
    ],
    fare: 18,
    durationMin: 50,
    frequency: "Every 15 min",
    firstBus: "05:30",
    lastBus: "23:00",
    color: "#f093fb",
    acAvailable: false,
    type: "Regular"
  },
  {
    id: "155",
    name: "Route 155",
    from: "Katraj",
    to: "Wakad",
    via: ["Swargate", "Kothrud", "Baner"],
    stops: [
      { name: "Katraj",         offsetMin: 0  },
      { name: "Swargate",       offsetMin: 18 },
      { name: "Karve Nagar",    offsetMin: 28 },
      { name: "Kothrud",        offsetMin: 35 },
      { name: "Baner",          offsetMin: 48 },
      { name: "Wakad",          offsetMin: 58 }
    ],
    fare: 22,
    durationMin: 58,
    frequency: "Every 30 min",
    firstBus: "06:30",
    lastBus: "21:30",
    color: "#4facfe",
    acAvailable: false,
    type: "Regular"
  },
  {
    id: "32",
    name: "Route 32",
    from: "Vishrantwadi",
    to: "Hadapsar",
    via: ["Airport Road", "Kalyani Nagar", "Fatima Nagar"],
    stops: [
      { name: "Vishrantwadi",   offsetMin: 0  },
      { name: "Airport Road",   offsetMin: 10 },
      { name: "Viman Nagar",    offsetMin: 16 },
      { name: "Kalyani Nagar",  offsetMin: 22 },
      { name: "Koregaon Park",  offsetMin: 28 },
      { name: "Fatima Nagar",   offsetMin: 36 },
      { name: "Hadapsar",       offsetMin: 44 }
    ],
    fare: 16,
    durationMin: 44,
    frequency: "Every 20 min",
    firstBus: "06:00",
    lastBus: "22:00",
    color: "#a18cd1",
    acAvailable: false,
    type: "Regular"
  }
];

// ── Helper: Find routes between two stops ────────────────────
function findRoutes(fromStop, toStop) {
  if (!fromStop || !toStop) return [];

  const from = fromStop.toLowerCase().trim();
  const to   = toStop.toLowerCase().trim();

  return PMPML_ROUTES.filter(route => {
    const stopNames = route.stops.map(s => s.name.toLowerCase());
    const fromIdx   = stopNames.findIndex(s => s.includes(from) || from.includes(s.split(" ")[0].toLowerCase()));
    const toIdx     = stopNames.findIndex(s => s.includes(to)   || to.includes(s.split(" ")[0].toLowerCase()));
    // Valid only if both found AND from comes before to
    return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
  }).map(route => {
    // Calculate fare & time for the sub-segment
    const stopNames = route.stops.map(s => s.name.toLowerCase());
    const fromIdx   = stopNames.findIndex(s => s.includes(from) || from.includes(s.split(" ")[0].toLowerCase()));
    const toIdx     = stopNames.findIndex(s => s.includes(to)   || to.includes(s.split(" ")[0].toLowerCase()));
    const segmentMin = route.stops[toIdx].offsetMin - route.stops[fromIdx].offsetMin;
    const stopCount  = toIdx - fromIdx;
    const segmentFare = Math.max(8, Math.round((segmentMin / route.durationMin) * route.fare));

    return {
      ...route,
      segmentFrom:  route.stops[fromIdx].name,
      segmentTo:    route.stops[toIdx].name,
      segmentMin,
      segmentFare,
      stopCount,
      boardAt:      route.stops[fromIdx].name,
      alightAt:     route.stops[toIdx].name
    };
  });
}

// ── Helper: Next departure time from now ─────────────────────
function getNextDepartures(route, count = 3) {
  const now      = new Date();
  const [fH, fM] = route.firstBus.split(":").map(Number);
  const [lH, lM] = route.lastBus.split(":").map(Number);
  const freqMin  = parseInt(route.frequency.match(/\d+/)[0]);

  const firstMin = fH * 60 + fM;
  const lastMin  = lH * 60 + lM;
  const nowMin   = now.getHours() * 60 + now.getMinutes();

  const departures = [];
  let cursor = firstMin;

  while (cursor <= lastMin) {
    if (cursor >= nowMin) departures.push(cursor);
    cursor += freqMin;
  }

  return departures.slice(0, count).map(min => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    const diffMin = min - nowMin;
    return {
      time:    `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`,
      inMin:   diffMin,
      label:   diffMin <= 0 ? "Arriving" : diffMin < 60 ? `${diffMin} min` : `${Math.floor(diffMin/60)}h ${diffMin%60}m`
    };
  });
}

// ── Helper: Crowd level based on time ────────────────────────
function getCrowdLevel() {
  const hour = new Date().getHours();
  if ([8, 9, 17, 18, 19].includes(hour))
    return { label: "Very Crowded", emoji: "🔴", color: "#f5576c", pct: 90 };
  if ([7, 10, 16, 20].includes(hour))
    return { label: "Moderate",     emoji: "🟡", color: "#fee140", pct: 55 };
  if (hour < 6 || hour > 21)
    return { label: "Almost Empty", emoji: "🟢", color: "#43e97b", pct: 15 };
  return   { label: "Comfortable",  emoji: "🟢", color: "#43e97b", pct: 35 };
}

// ── Helper: Filter stops for autocomplete ────────────────────
function filterStops(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return PUNE_STOPS.filter(s => s.toLowerCase().startsWith(q)).slice(0, 6);
}
