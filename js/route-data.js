// ============================================================
//  TRANSITGO — PUNE TRANSIT DATASET
//  PMPML Bus Routes + Pune Metro Lines
//  Used by: search.js, timetable.js, booking.js, map.js
// ============================================================

// ── Master stop list (autocomplete source) ──────────────────
const PUNE_STOPS = [
  // Core city
  "Swargate", "Market Yard", "Shivajinagar", "Pune Station", "Camp",
  "Deccan Gymkhana", "FC Road", "Koregaon Park", "Kalyani Nagar",
  // South Pune
  "Katraj", "Ambegaon", "Bibwewadi", "Kondhwa", "NIBM Road",
  "Fatima Nagar", "Hadapsar", "Magarpatta", "Undri",
  // East Pune
  "Kharadi", "Viman Nagar", "Vishrantwadi", "Airport Road",
  "Yerawada", "Nagar Road", "Wagholi", "Dhanori",
  // West Pune
  "Kothrud", "Warje", "Karve Nagar", "Paud Road", "Bavdhan",
  "Sinhagad Road", "Pashan", "Sus Road",
  // North-West (Pimpri-Chinchwad)
  "Wakad", "Baner", "Aundh", "Hinjewadi", "Balewadi",
  "Pimpri", "Chinchwad", "Bhosari", "Akurdi", "Nigdi",
  "Pimpri Chowk", "Nashik Phata", "Range Hills", "Kasarwadi", "Dapodi", "Khadki",
  // Metro stations – Line 1 (PCMC ↔ Swargate) Purple Line
  "PCMC Metro", "Sant Tukaram Nagar Metro", "Nashik Phata Metro",
  "Kasarwadi Metro", "Phugewadi Metro", "Dapodi Metro",
  "Bopkhel Metro", "Khadki Metro", "Range Hills Metro",
  "Shivajinagar Metro", "Civil Court Metro",
  "Budhwar Peth Metro", "Mandai Metro", "Swargate Metro",
  // Metro stations – Line 2 (Vanaz ↔ Ramwadi) Aqua Line
  "Vanaz Metro", "Anand Nagar Metro", "Ideal Colony Metro",
  "Nal Stop Metro", "Garware Metro", "Deccan Gymkhana Metro",
  "Chhatrapati Sambhajinagar Chowk Metro", "PMC Metro",
  "Mangalwar Peth Metro", "Pune Station Metro",
  "Ruby Hall Metro", "Bund Garden Metro",
  "Yerwada Metro", "Kalyani Nagar Metro", "Ramwadi Metro"
];

// ── PMPML Bus Routes ─────────────────────────────────────────
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
      { name: "Bibwewadi",     offsetMin: 12 },
      { name: "Swargate",      offsetMin: 18 },
      { name: "Market Yard",   offsetMin: 24 },
      { name: "Fatima Nagar",  offsetMin: 30 },
      { name: "Magarpatta",    offsetMin: 36 },
      { name: "Hadapsar",      offsetMin: 42 }
    ],
    fare: 14,
    durationMin: 42,
    frequency: "Every 15 min",
    firstBus: "05:30",
    lastBus: "23:00",
    color: "#6C63FF",
    acAvailable: false,
    type: "Bus"
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
      { name: "Paud Road",       offsetMin: 10 },
      { name: "Karve Nagar",     offsetMin: 16 },
      { name: "Warje",           offsetMin: 20 },
      { name: "Kothrud",         offsetMin: 26 }
    ],
    fare: 10,
    durationMin: 26,
    frequency: "Every 20 min",
    firstBus: "06:00",
    lastBus: "22:30",
    color: "#f5576c",
    acAvailable: false,
    type: "Bus"
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
      { name: "Market Yard",   offsetMin: 19 },
      { name: "Swargate",      offsetMin: 25 }
    ],
    fare: 8,
    durationMin: 25,
    frequency: "Every 10 min",
    firstBus: "05:45",
    lastBus: "23:00",
    color: "#3ECFCF",
    acAvailable: false,
    type: "Bus"
  },
  {
    id: "50",
    name: "Route 50",
    from: "Wakad",
    to: "Swargate",
    via: ["Baner", "Aundh", "Shivajinagar"],
    stops: [
      { name: "Wakad",          offsetMin: 0  },
      { name: "Balewadi",       offsetMin: 8  },
      { name: "Baner",          offsetMin: 14 },
      { name: "Aundh",          offsetMin: 22 },
      { name: "Shivajinagar",   offsetMin: 32 },
      { name: "Pune Station",   offsetMin: 40 },
      { name: "Swargate",       offsetMin: 50 }
    ],
    fare: 20,
    durationMin: 50,
    frequency: "Every 25 min",
    firstBus: "06:30",
    lastBus: "21:00",
    color: "#43e97b",
    acAvailable: false,
    type: "Bus"
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
      { name: "Karve Nagar",    offsetMin: 14 },
      { name: "Swargate",       offsetMin: 25 },
      { name: "Market Yard",    offsetMin: 30 },
      { name: "Fatima Nagar",   offsetMin: 36 },
      { name: "Hadapsar",       offsetMin: 44 }
    ],
    fare: 15,
    durationMin: 44,
    frequency: "Every 20 min",
    firstBus: "06:00",
    lastBus: "22:00",
    color: "#fee140",
    acAvailable: false,
    type: "Bus"
  },
  {
    id: "4",
    name: "Route 4",
    from: "Pimpri",
    to: "Swargate",
    via: ["Aundh", "Shivajinagar", "Pune Station"],
    stops: [
      { name: "Pimpri",         offsetMin: 0  },
      { name: "Chinchwad",      offsetMin: 8  },
      { name: "Akurdi",         offsetMin: 14 },
      { name: "Aundh",          offsetMin: 22 },
      { name: "Shivajinagar",   offsetMin: 32 },
      { name: "Pune Station",   offsetMin: 40 },
      { name: "Camp",           offsetMin: 46 },
      { name: "Swargate",       offsetMin: 55 }
    ],
    fare: 20,
    durationMin: 55,
    frequency: "Every 15 min",
    firstBus: "05:30",
    lastBus: "23:00",
    color: "#f093fb",
    acAvailable: false,
    type: "Bus"
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
      { name: "Kothrud",        offsetMin: 36 },
      { name: "Pashan",         offsetMin: 46 },
      { name: "Baner",          offsetMin: 54 },
      { name: "Wakad",          offsetMin: 62 }
    ],
    fare: 22,
    durationMin: 62,
    frequency: "Every 30 min",
    firstBus: "06:30",
    lastBus: "21:30",
    color: "#4facfe",
    acAvailable: false,
    type: "Bus"
  },
  {
    id: "32",
    name: "Route 32",
    from: "Vishrantwadi",
    to: "Hadapsar",
    via: ["Airport Road", "Kalyani Nagar", "Fatima Nagar"],
    stops: [
      { name: "Vishrantwadi",   offsetMin: 0  },
      { name: "Dhanori",        offsetMin: 8  },
      { name: "Airport Road",   offsetMin: 14 },
      { name: "Viman Nagar",    offsetMin: 20 },
      { name: "Kalyani Nagar",  offsetMin: 26 },
      { name: "Koregaon Park",  offsetMin: 32 },
      { name: "Fatima Nagar",   offsetMin: 38 },
      { name: "Hadapsar",       offsetMin: 48 }
    ],
    fare: 18,
    durationMin: 48,
    frequency: "Every 20 min",
    firstBus: "06:00",
    lastBus: "22:00",
    color: "#a18cd1",
    acAvailable: false,
    type: "Bus"
  },
  {
    id: "63",
    name: "Route 63",
    from: "Hinjewadi",
    to: "Shivajinagar",
    via: ["Wakad", "Baner", "Aundh"],
    stops: [
      { name: "Hinjewadi",      offsetMin: 0  },
      { name: "Sus Road",       offsetMin: 10 },
      { name: "Wakad",          offsetMin: 18 },
      { name: "Balewadi",       offsetMin: 24 },
      { name: "Baner",          offsetMin: 30 },
      { name: "Aundh",          offsetMin: 38 },
      { name: "Shivajinagar",   offsetMin: 50 }
    ],
    fare: 22,
    durationMin: 50,
    frequency: "Every 20 min",
    firstBus: "06:00",
    lastBus: "22:30",
    color: "#0ba360",
    acAvailable: true,
    type: "Bus"
  },
  {
    id: "91",
    name: "Route 91",
    from: "Nigdi",
    to: "Pune Station",
    via: ["Bhosari", "Pimpri", "Aundh"],
    stops: [
      { name: "Nigdi",           offsetMin: 0  },
      { name: "Akurdi",          offsetMin: 7  },
      { name: "Bhosari",         offsetMin: 14 },
      { name: "Pimpri Chowk",    offsetMin: 22 },
      { name: "Pimpri",          offsetMin: 28 },
      { name: "Chinchwad",       offsetMin: 34 },
      { name: "Aundh",           offsetMin: 44 },
      { name: "Shivajinagar",    offsetMin: 54 },
      { name: "Pune Station",    offsetMin: 62 }
    ],
    fare: 24,
    durationMin: 62,
    frequency: "Every 20 min",
    firstBus: "05:45",
    lastBus: "22:45",
    color: "#FF6B6B",
    acAvailable: false,
    type: "Bus"
  },
  {
    id: "25",
    name: "Route 25",
    from: "Yerawada",
    to: "Swargate",
    via: ["Koregaon Park", "Camp"],
    stops: [
      { name: "Yerawada",       offsetMin: 0  },
      { name: "Nagar Road",     offsetMin: 8  },
      { name: "Koregaon Park",  offsetMin: 14 },
      { name: "Kalyani Nagar",  offsetMin: 18 },
      { name: "Camp",           offsetMin: 26 },
      { name: "Pune Station",   offsetMin: 32 },
      { name: "Swargate",       offsetMin: 40 }
    ],
    fare: 14,
    durationMin: 40,
    frequency: "Every 15 min",
    firstBus: "06:00",
    lastBus: "22:30",
    color: "#FFA07A",
    acAvailable: false,
    type: "Bus"
  },
  {
    id: "210",
    name: "Route 210",
    from: "Kondhwa",
    to: "Shivajinagar",
    via: ["NIBM Road", "Fatima Nagar", "Swargate"],
    stops: [
      { name: "Kondhwa",        offsetMin: 0  },
      { name: "NIBM Road",      offsetMin: 8  },
      { name: "Undri",          offsetMin: 12 },
      { name: "Fatima Nagar",   offsetMin: 20 },
      { name: "Market Yard",    offsetMin: 26 },
      { name: "Swargate",       offsetMin: 32 },
      { name: "Shivajinagar",   offsetMin: 46 }
    ],
    fare: 18,
    durationMin: 46,
    frequency: "Every 25 min",
    firstBus: "06:15",
    lastBus: "22:00",
    color: "#7B68EE",
    acAvailable: false,
    type: "Bus"
  },
  {
    id: "171",
    name: "Route 171",
    from: "Pashan",
    to: "Hadapsar",
    via: ["Shivajinagar", "Camp", "Fatima Nagar"],
    stops: [
      { name: "Pashan",         offsetMin: 0  },
      { name: "Aundh",          offsetMin: 10 },
      { name: "Shivajinagar",   offsetMin: 20 },
      { name: "Pune Station",   offsetMin: 28 },
      { name: "Camp",           offsetMin: 34 },
      { name: "Koregaon Park",  offsetMin: 42 },
      { name: "Fatima Nagar",   offsetMin: 48 },
      { name: "Magarpatta",     offsetMin: 56 },
      { name: "Hadapsar",       offsetMin: 64 }
    ],
    fare: 24,
    durationMin: 64,
    frequency: "Every 30 min",
    firstBus: "06:00",
    lastBus: "21:30",
    color: "#20B2AA",
    acAvailable: false,
    type: "Bus"
  },
  {
    id: "74",
    name: "Route 74",
    from: "Nashik Phata",
    to: "Shivajinagar",
    via: ["Kasarwadi", "Dapodi", "Khadki"],
    stops: [
      { name: "Nashik Phata",   offsetMin: 0  },
      { name: "Kasarwadi",      offsetMin: 8  },
      { name: "Dapodi",         offsetMin: 14 },
      { name: "Khadki",         offsetMin: 20 },
      { name: "Range Hills",    offsetMin: 26 },
      { name: "Shivajinagar",   offsetMin: 36 }
    ],
    fare: 14,
    durationMin: 36,
    frequency: "Every 15 min",
    firstBus: "05:30",
    lastBus: "23:00",
    color: "#E67E22",
    acAvailable: false,
    type: "Bus"
  },
  {
    id: "55AC",
    name: "Route 55 AC",
    from: "Hinjewadi",
    to: "Pune Station",
    via: ["Baner", "Aundh", "Shivajinagar"],
    stops: [
      { name: "Hinjewadi",       offsetMin: 0  },
      { name: "Wakad",           offsetMin: 12 },
      { name: "Baner",           offsetMin: 20 },
      { name: "Aundh",           offsetMin: 28 },
      { name: "Shivajinagar",    offsetMin: 38 },
      { name: "Deccan Gymkhana", offsetMin: 44 },
      { name: "Pune Station",    offsetMin: 55 }
    ],
    fare: 40,
    durationMin: 55,
    frequency: "Every 30 min",
    firstBus: "07:00",
    lastBus: "20:00",
    color: "#2980B9",
    acAvailable: true,
    type: "Bus"
  }
];

// ── Pune Metro Routes ────────────────────────────────────────
const METRO_ROUTES = [
  {
    id: "M1",
    name: "Metro Line 1",
    line: "Purple Line",
    from: "PCMC Metro",
    to: "Swargate Metro",
    via: ["Khadki Metro", "Shivajinagar Metro", "Budhwar Peth Metro"],
    stops: [
      { name: "PCMC Metro",                 offsetMin: 0  },
      { name: "Sant Tukaram Nagar Metro",   offsetMin: 3  },
      { name: "Nashik Phata Metro",         offsetMin: 6  },
      { name: "Kasarwadi Metro",            offsetMin: 9  },
      { name: "Phugewadi Metro",            offsetMin: 12 },
      { name: "Dapodi Metro",               offsetMin: 15 },
      { name: "Bopkhel Metro",              offsetMin: 18 },
      { name: "Khadki Metro",               offsetMin: 21 },
      { name: "Range Hills Metro",          offsetMin: 24 },
      { name: "Shivajinagar Metro",         offsetMin: 28 },
      { name: "Civil Court Metro",          offsetMin: 31 },
      { name: "Budhwar Peth Metro",         offsetMin: 34 },
      { name: "Mandai Metro",               offsetMin: 37 },
      { name: "Swargate Metro",             offsetMin: 40 }
    ],
    fare: 30,
    durationMin: 40,
    frequency: "Every 8 min",
    firstBus: "05:30",
    lastBus: "23:00",
    color: "#8B5CF6",
    acAvailable: true,
    type: "Metro"
  },
  {
    id: "M1A",
    name: "Metro Line 1 (Short)",
    line: "Purple Line",
    from: "PCMC Metro",
    to: "Shivajinagar Metro",
    via: ["Khadki Metro", "Range Hills Metro"],
    stops: [
      { name: "PCMC Metro",                 offsetMin: 0  },
      { name: "Sant Tukaram Nagar Metro",   offsetMin: 3  },
      { name: "Nashik Phata Metro",         offsetMin: 6  },
      { name: "Kasarwadi Metro",            offsetMin: 9  },
      { name: "Phugewadi Metro",            offsetMin: 12 },
      { name: "Dapodi Metro",               offsetMin: 15 },
      { name: "Bopkhel Metro",              offsetMin: 18 },
      { name: "Khadki Metro",               offsetMin: 21 },
      { name: "Range Hills Metro",          offsetMin: 24 },
      { name: "Shivajinagar Metro",         offsetMin: 28 }
    ],
    fare: 20,
    durationMin: 28,
    frequency: "Every 8 min",
    firstBus: "05:30",
    lastBus: "23:00",
    color: "#7C3AED",
    acAvailable: true,
    type: "Metro"
  },
  {
    id: "M2",
    name: "Metro Line 2",
    line: "Aqua Line",
    from: "Vanaz Metro",
    to: "Ramwadi Metro",
    via: ["Deccan Gymkhana Metro", "Pune Station Metro", "Kalyani Nagar Metro"],
    stops: [
      { name: "Vanaz Metro",                           offsetMin: 0  },
      { name: "Anand Nagar Metro",                     offsetMin: 3  },
      { name: "Ideal Colony Metro",                    offsetMin: 6  },
      { name: "Nal Stop Metro",                        offsetMin: 9  },
      { name: "Garware Metro",                         offsetMin: 12 },
      { name: "Deccan Gymkhana Metro",                 offsetMin: 15 },
      { name: "Chhatrapati Sambhajinagar Chowk Metro", offsetMin: 18 },
      { name: "PMC Metro",                             offsetMin: 21 },
      { name: "Mangalwar Peth Metro",                  offsetMin: 24 },
      { name: "Pune Station Metro",                    offsetMin: 27 },
      { name: "Ruby Hall Metro",                       offsetMin: 30 },
      { name: "Bund Garden Metro",                     offsetMin: 33 },
      { name: "Yerwada Metro",                         offsetMin: 36 },
      { name: "Kalyani Nagar Metro",                   offsetMin: 39 },
      { name: "Ramwadi Metro",                         offsetMin: 43 }
    ],
    fare: 32,
    durationMin: 43,
    frequency: "Every 8 min",
    firstBus: "05:30",
    lastBus: "23:00",
    color: "#06B6D4",
    acAvailable: true,
    type: "Metro"
  },
  {
    id: "M2A",
    name: "Metro Line 2 (Short)",
    line: "Aqua Line",
    from: "Vanaz Metro",
    to: "Pune Station Metro",
    via: ["Nal Stop Metro", "Deccan Gymkhana Metro"],
    stops: [
      { name: "Vanaz Metro",                           offsetMin: 0  },
      { name: "Anand Nagar Metro",                     offsetMin: 3  },
      { name: "Ideal Colony Metro",                    offsetMin: 6  },
      { name: "Nal Stop Metro",                        offsetMin: 9  },
      { name: "Garware Metro",                         offsetMin: 12 },
      { name: "Deccan Gymkhana Metro",                 offsetMin: 15 },
      { name: "Chhatrapati Sambhajinagar Chowk Metro", offsetMin: 18 },
      { name: "PMC Metro",                             offsetMin: 21 },
      { name: "Mangalwar Peth Metro",                  offsetMin: 24 },
      { name: "Pune Station Metro",                    offsetMin: 27 }
    ],
    fare: 22,
    durationMin: 27,
    frequency: "Every 8 min",
    firstBus: "05:30",
    lastBus: "23:00",
    color: "#0891B2",
    acAvailable: true,
    type: "Metro"
  }
];

// ── Combined all routes ──────────────────────────────────────
const ALL_ROUTES = [...PMPML_ROUTES, ...METRO_ROUTES];

// ── Helper: Find routes between two stops ────────────────────
function findRoutes(fromStop, toStop, typeFilter) {
  if (!fromStop || !toStop) return [];

  const from = fromStop.toLowerCase().trim();
  const to   = toStop.toLowerCase().trim();

  const pool = typeFilter === "Bus"   ? PMPML_ROUTES
             : typeFilter === "Metro" ? METRO_ROUTES
             : ALL_ROUTES;

  return pool.filter(route => {
    const stopNames = route.stops.map(s => s.name.toLowerCase());
    const fromIdx   = stopNames.findIndex(s => s.includes(from) || from.includes(s.split(" ")[0].toLowerCase()));
    const toIdx     = stopNames.findIndex(s => s.includes(to)   || to.includes(s.split(" ")[0].toLowerCase()));
    return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
  }).map(route => {
    const stopNames   = route.stops.map(s => s.name.toLowerCase());
    const fromIdx     = stopNames.findIndex(s => s.includes(from) || from.includes(s.split(" ")[0].toLowerCase()));
    const toIdx       = stopNames.findIndex(s => s.includes(to)   || to.includes(s.split(" ")[0].toLowerCase()));
    const segmentMin  = route.stops[toIdx].offsetMin - route.stops[fromIdx].offsetMin;
    const stopCount   = toIdx - fromIdx;
    const minFare     = route.type === "Metro" ? 10 : 8;
    const segmentFare = Math.max(minFare, Math.round((segmentMin / route.durationMin) * route.fare));

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
  return PUNE_STOPS.filter(s => s.toLowerCase().startsWith(q) || s.toLowerCase().includes(q)).slice(0, 8);
}
