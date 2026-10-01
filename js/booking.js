// ============================================================
//  TRANSITGO — BOOKING PAGE LOGIC
//  3-step wizard: Journey → Passenger → Payment
// ============================================================

// ── Read URL params ───────────────────────────────────────────
const params   = new URLSearchParams(window.location.search);
const routeId  = params.get("route") || "15";
const fromStop = params.get("from")  || "";
const toStop   = params.get("to")   || "";

// Find matching route
const route = PMPML_ROUTES.find(r => r.id === routeId) || PMPML_ROUTES[0];

// Sub-segment fare calculation (same logic as search.js)
function getSegmentFare(route, from, to) {
  const names = route.stops.map(s => s.name.toLowerCase());
  const fIdx  = names.findIndex(n => n.includes(from.toLowerCase()) || from.toLowerCase().includes(n.split(" ")[0]));
  const tIdx  = names.findIndex(n => n.includes(to.toLowerCase())   || to.toLowerCase().includes(n.split(" ")[0]));
  if (fIdx === -1 || tIdx === -1 || fIdx >= tIdx) return route.fare;
  const segMin = route.stops[tIdx].offsetMin - route.stops[fIdx].offsetMin;
  return Math.max(8, Math.round((segMin / route.durationMin) * route.fare));
}

// ── State ─────────────────────────────────────────────────────
let currentStep  = 1;
let passengers   = 1;
let seatType     = "standard";
let payMethod    = "upi";
let baseFare     = getSegmentFare(route, fromStop || route.from, toStop || route.to);

// Booking data collected across steps
const booking = {
  routeId:     route.id,
  routeName:   route.name,
  from:        fromStop || route.from,
  to:          toStop   || route.to,
  date:        "",
  time:        "",
  passengers:  1,
  seatType:    "standard",
  name:        "",
  phone:       "",
  email:       "",
  payMethod:   "upi",
  totalFare:   baseFare,
  txnId:       ""
};

// ── Render Journey Card ───────────────────────────────────────
function renderJourneyCard() {
  const fare = baseFare * passengers * (seatType === "premium" ? 1.5 : 1);
  document.getElementById("jc-badge").textContent    = `🚌${route.id}`;
  document.getElementById("jc-badge").style.background    = `${route.color}18`;
  document.getElementById("jc-badge").style.borderColor   = `${route.color}50`;
  document.getElementById("jc-badge").style.color         = route.color;
  document.getElementById("jc-route-name").textContent = route.name;
  document.getElementById("jc-route-sub").textContent  = `${booking.from} → ${booking.to}`;
  document.getElementById("jc-date").textContent       = booking.date || "—";
  document.getElementById("jc-time").textContent       = booking.time || "—";
  document.getElementById("jc-pax").textContent        = `${passengers} passenger${passengers > 1 ? "s" : ""}`;
  document.getElementById("jc-seat").textContent       = seatType === "premium" ? "Premium (AC)" : "Standard";
  document.getElementById("jc-fare").textContent       = `₹${Math.round(fare)}`;
  booking.totalFare = Math.round(fare);
}

// ── Step Navigation ───────────────────────────────────────────
function goToStep(step) {
  currentStep = step;
  document.querySelectorAll(".bk-step").forEach((el, i) => {
    el.classList.remove("step-active", "step-done");
    if (i + 1 < step) el.classList.add("step-done");
    if (i + 1 === step) el.classList.add("step-active");
  });
  document.querySelectorAll(".step-panel").forEach((el, i) => {
    el.style.display = (i + 1 === step) ? "block" : "none";
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Step 1: Journey Details ───────────────────────────────────
function validateStep1() {
  const date = document.getElementById("dep-date").value;
  const time = document.getElementById("dep-time").value;
  let ok = true;

  if (!date) { shake("dep-date"); ok = false; }
  if (!time) { shake("dep-time"); ok = false; }
  if (!ok) return;

  booking.date = date;
  booking.time = time;
  booking.passengers = passengers;
  booking.seatType   = seatType;

  renderJourneyCard();
  goToStep(2);
}

// ── Step 2: Passenger Info ────────────────────────────────────
function validateStep2() {
  const name  = document.getElementById("pax-name").value.trim();
  const phone = document.getElementById("pax-phone").value.trim();
  const email = document.getElementById("pax-email").value.trim();
  let ok = true;

  if (!name)  { shake("pax-name");  ok = false; }
  if (!phone || !/^\d{10}$/.test(phone)) { shake("pax-phone"); ok = false; }
  if (!email || !email.includes("@"))    { shake("pax-email"); ok = false; }
  if (!ok) return;

  booking.name  = name;
  booking.phone = phone;
  booking.email = email;

  renderJourneyCard();
  goToStep(3);
}

// ── Step 3: Payment ───────────────────────────────────────────
function selectPayMethod(method) {
  payMethod = method;
  booking.payMethod = method;
  document.querySelectorAll(".pay-method").forEach(el => {
    el.classList.toggle("pay-sel", el.dataset.method === method);
  });
  document.getElementById("upi-wrap").classList.toggle("show",  method === "upi");
  document.getElementById("card-wrap").classList.toggle("show", method === "card");
}

async function doPayment() {
  const btn = document.getElementById("pay-now-btn");
  btn.classList.add("paying");
  btn.textContent = "Processing payment…";

  // Simulate payment gateway (2.5 seconds)
  await new Promise(r => setTimeout(r, 2500));

  // Generate transaction ID
  booking.txnId = "TXN" + Date.now().toString().slice(-8).toUpperCase();

  // Save to localStorage for ticket page
  localStorage.setItem("tg_booking", JSON.stringify(booking));

  // Redirect to ticket page
  window.location.href = "ticket.html";
}

// ── Passengers counter ────────────────────────────────────────
function changePax(delta) {
  passengers = Math.max(1, Math.min(6, passengers + delta));
  document.getElementById("pax-count").textContent = passengers;
  renderJourneyCard();
}

// ── Seat type selection ───────────────────────────────────────
function selectSeat(type) {
  seatType = type;
  document.querySelectorAll(".seat-chip").forEach(c => {
    c.classList.toggle("chip-sel", c.dataset.seat === type);
  });
  renderJourneyCard();
}

// ── Shake animation helper ────────────────────────────────────
function shake(id) {
  const el = document.getElementById(id);
  el.classList.add("input-err");
  el.focus();
  setTimeout(() => el.classList.remove("input-err"), 700);
}

// ── Pre-fill journey fields ───────────────────────────────────
function prefillJourneyFields() {
  // Set min date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dep-date").min   = today;
  document.getElementById("dep-date").value = today;
  booking.date = today;

  // Pre-fill from/to
  document.getElementById("from-stop").value = booking.from;
  document.getElementById("to-stop").value   = booking.to;

  // Populate departure time options from route schedule
  const timeSelect = document.getElementById("dep-time");
  const schedule   = generateSchedule(route);
  const nowM       = new Date().getHours() * 60 + new Date().getMinutes();

  timeSelect.innerHTML = schedule.map(min => {
    const h    = Math.floor(min / 60);
    const m    = min % 60;
    const str  = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
    const ampm = h < 12 ? "AM" : "PM";
    const h12  = h % 12 || 12;
    const label = `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
    const soon  = min >= nowM ? " (upcoming)" : "";
    return `<option value="${str}">${label}${soon}</option>`;
  }).join("");

  // Auto-select next departure
  const nextMin = schedule.find(m => m >= nowM);
  if (nextMin !== undefined) {
    const h = Math.floor(nextMin/60);
    const m = nextMin % 60;
    timeSelect.value = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
  }

  renderJourneyCard();
}

// ── Generate schedule (same as timetable.js) ──────────────────
function generateSchedule(r) {
  const [fH, fM] = r.firstBus.split(":").map(Number);
  const [lH, lM] = r.lastBus.split(":").map(Number);
  const freq = parseInt(r.frequency.match(/\d+/)[0]);
  const first = fH * 60 + fM;
  const last  = lH * 60 + lM;
  const slots = [];
  let cur = first;
  while (cur <= last) { slots.push(cur); cur += freq; }
  return slots;
}

// ── Navbar scroll ─────────────────────────────────────────────
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 10);
});

// ── Init ──────────────────────────────────────────────────────
prefillJourneyFields();
goToStep(1);
renderJourneyCard();
selectPayMethod("upi");
selectSeat("standard");
