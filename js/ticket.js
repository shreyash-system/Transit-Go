// ============================================================
//  TRANSITGO — TICKET PAGE LOGIC
//  Renders the QR e-ticket from localStorage booking data
// ============================================================

// ── Load booking ──────────────────────────────────────────────
let booking = null;
try {
  booking = JSON.parse(localStorage.getItem("tg_booking"));
} catch(e) {}

// Fallback demo booking if accessed directly
if (!booking) {
  booking = {
    routeId:    "15",
    routeName:  "Route 15",
    from:       "Katraj",
    to:         "Hadapsar",
    date:       new Date().toISOString().split("T")[0],
    time:       "16:30",
    passengers: 2,
    seatType:   "standard",
    name:       "Shreyash Bhalerao",
    phone:      "9876543210",
    email:      "shreyash@vit.edu",
    payMethod:  "upi",
    totalFare:  24,
    txnId:      "TXN" + Date.now().toString().slice(-8)
  };
}

// Find the route data
const route = PMPML_ROUTES.find(r => r.id === booking.routeId) || PMPML_ROUTES[0];

// ── Ticket ID ─────────────────────────────────────────────────
const ticketId = "TGO-" + booking.txnId + "-" + booking.routeId;

// ── Date + Time formatting ────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function formatTime(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
}

// ── Arrival time ──────────────────────────────────────────────
function getArrivalTime(depTime, durationMin) {
  const [h, m] = depTime.split(":").map(Number);
  const total  = h * 60 + m + durationMin;
  const ah = Math.floor(total / 60) % 24;
  const am = total % 60;
  const ampm = ah < 12 ? "AM" : "PM";
  const h12  = ah % 12 || 12;
  return `${h12}:${String(am).padStart(2,"0")} ${ampm}`;
}

// ── QR Code generation using qrcode.js CDN ────────────────────
function generateQR() {
  const qrData = JSON.stringify({
    ticket: ticketId,
    route:  booking.routeId,
    from:   booking.from,
    to:     booking.to,
    date:   booking.date,
    time:   booking.time,
    pax:    booking.passengers,
    name:   booking.name
  });

  const container = document.getElementById("qr-container");
  container.innerHTML = "";

  // Use QRCode.js library
  new QRCode(container, {
    text:         qrData,
    width:        180,
    height:       180,
    colorDark:    "#ffffff",
    colorLight:   "#0a0a0f",
    correctLevel: QRCode.CorrectLevel.M
  });
}

// ── Render Ticket ─────────────────────────────────────────────
function renderTicket() {
  // Header info
  document.getElementById("tk-route-badge").textContent = `🚌 ${route.id}`;
  document.getElementById("tk-route-badge").style.background   = `${route.color}20`;
  document.getElementById("tk-route-badge").style.borderColor  = `${route.color}50`;
  document.getElementById("tk-route-badge").style.color        = route.color;
  document.getElementById("tk-route-name").textContent  = route.name;
  document.getElementById("tk-from").textContent        = booking.from;
  document.getElementById("tk-to").textContent          = booking.to;
  document.getElementById("tk-dep-time").textContent    = formatTime(booking.time);
  document.getElementById("tk-arr-time").textContent    = getArrivalTime(booking.time, route.durationMin);
  document.getElementById("tk-date").textContent        = formatDate(booking.date);
  document.getElementById("tk-passenger").textContent   = booking.name;
  document.getElementById("tk-phone").textContent       = `+91 ${booking.phone}`;
  document.getElementById("tk-pax-count").textContent   = `${booking.passengers} Passenger${booking.passengers > 1 ? "s" : ""}`;
  document.getElementById("tk-seat-type").textContent   = booking.seatType === "premium" ? "Premium (AC)" : "Standard";
  document.getElementById("tk-ticket-id").textContent   = ticketId;
  document.getElementById("tk-txn-id").textContent      = booking.txnId;
  document.getElementById("tk-pay-method").textContent  = booking.payMethod.toUpperCase();
  document.getElementById("tk-fare").textContent        = `₹${booking.totalFare}`;
  document.getElementById("tk-status").textContent      = "CONFIRMED";
  // Duration
  const durEl = document.getElementById("tk-duration");
  if (durEl) durEl.textContent = `${route.durationMin} min`;


  // Validity
  const dep = new Date(booking.date + "T" + booking.time);
  const exp = new Date(dep.getTime() + route.durationMin * 60 * 1000 + 30 * 60 * 1000);
  document.getElementById("tk-valid-till").textContent =
    exp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " on " + formatDate(booking.date);

  // Generate QR
  generateQR();
}

// ── Share ticket ──────────────────────────────────────────────
function shareTicket() {
  if (navigator.share) {
    navigator.share({
      title: "TransitGo Bus Ticket",
      text:  `🚌 My PMPML bus ticket: ${booking.from} → ${booking.to} on ${formatDate(booking.date)} at ${formatTime(booking.time)}. Ticket ID: ${ticketId}`,
      url:   window.location.href
    });
  } else {
    navigator.clipboard.writeText(ticketId).then(() => showToast("Ticket ID copied! " + ticketId));
  }
}

// ── Download ticket ───────────────────────────────────────────
function downloadTicket() {
  // Simple approach: print/save the ticket section
  const el = document.getElementById("ticket-card");
  el.style.maxWidth = "500px";
  window.print();
  el.style.maxWidth = "";
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement("div");
  t.className = "tg-toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("toast-show"), 10);
  setTimeout(() => { t.classList.remove("toast-show"); setTimeout(() => t.remove(), 300); }, 3000);
}

// ── Countdown to departure ────────────────────────────────────
function startCountdown() {
  const dep = new Date(booking.date + "T" + booking.time + ":00");
  const tick = () => {
    const now  = new Date();
    const diff = dep - now;
    const el   = document.getElementById("tk-countdown");
    if (!el) return;

    if (diff <= 0) {
      el.textContent = "Bus departed";
      el.style.color = "#f5576c";
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent = `${h}h ${m}m ${s}s to departure`;
    setTimeout(tick, 1000);
  };
  tick();
}

// ── Navbar scroll ─────────────────────────────────────────────
window.addEventListener("scroll", () => {
  document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 10);
});

// ── Init ──────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  renderTicket();
  startCountdown();
});
