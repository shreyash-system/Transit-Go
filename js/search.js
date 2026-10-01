// ============================================================
//  TRANSITGO — ROUTE SEARCH LOGIC
//  Handles: autocomplete, search, result rendering, favourites
// ============================================================

let activeDropdown = null; // "from" | "to" | null

// ── DOM refs ─────────────────────────────────────────────────
const fromInput      = document.getElementById("from-input");
const toInput        = document.getElementById("to-input");
const fromDropdown   = document.getElementById("from-dropdown");
const toDropdown     = document.getElementById("to-dropdown");
const searchBtn      = document.getElementById("search-btn");
const resultsSection = document.getElementById("results-section");
const resultsGrid    = document.getElementById("results-grid");
const noResults      = document.getElementById("no-results");
const swapBtn        = document.getElementById("swap-btn");
const resultsCount   = document.getElementById("results-count");

// ── Autocomplete ─────────────────────────────────────────────
function setupAutocomplete(input, dropdown, fieldName) {
  input.addEventListener("input", () => {
    const val = input.value.trim();
    const matches = filterStops(val);

    if (matches.length === 0 || val === "") {
      hideDropdown(dropdown);
      return;
    }

    dropdown.innerHTML = matches.map(stop => `
      <div class="dropdown-item" data-stop="${stop}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#6C63FF"/>
        </svg>
        ${stop}
      </div>
    `).join("");

    dropdown.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        input.value = item.dataset.stop;
        hideDropdown(dropdown);
        input.classList.add("input-filled");
      });
    });

    showDropdown(dropdown);
    activeDropdown = fieldName;
  });

  input.addEventListener("focus", () => {
    if (input.value.trim()) input.dispatchEvent(new Event("input"));
  });
}

function showDropdown(el) {
  el.style.display = "block";
  setTimeout(() => el.classList.add("dropdown-open"), 10);
}

function hideDropdown(el) {
  el.classList.remove("dropdown-open");
  setTimeout(() => { el.style.display = "none"; }, 200);
}

// Close dropdowns on outside click
document.addEventListener("click", e => {
  if (!e.target.closest(".input-wrapper")) {
    hideDropdown(fromDropdown);
    hideDropdown(toDropdown);
  }
});

// ── Swap Locations ───────────────────────────────────────────
swapBtn.addEventListener("click", () => {
  const temp = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = temp;
  swapBtn.classList.add("spinning");
  setTimeout(() => swapBtn.classList.remove("spinning"), 400);
});

// ── Search Trigger ───────────────────────────────────────────
searchBtn.addEventListener("click", doSearch);

[fromInput, toInput].forEach(inp => {
  inp.addEventListener("keydown", e => {
    if (e.key === "Enter") doSearch();
  });
});

function doSearch() {
  const from = fromInput.value.trim();
  const to   = toInput.value.trim();

  // Validation
  if (!from) { shakeInput(fromInput); return; }
  if (!to)   { shakeInput(toInput);   return; }
  if (from.toLowerCase() === to.toLowerCase()) {
    shakeInput(toInput);
    showToast("Source and destination can't be the same!");
    return;
  }

  // Button loading state
  searchBtn.classList.add("loading");
  searchBtn.querySelector(".btn-text").textContent = "Searching...";

  setTimeout(() => {
    searchBtn.classList.remove("loading");
    searchBtn.querySelector(".btn-text").textContent = "Find Buses";
    renderResults(from, to);
  }, 700);
}

function shakeInput(input) {
  input.classList.add("input-error");
  input.focus();
  setTimeout(() => input.classList.remove("input-error"), 600);
}

// ── Render Results ───────────────────────────────────────────
function renderResults(from, to) {
  const routes = findRoutes(from, to);
  resultsSection.style.display = "block";

  // Scroll to results
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);

  if (routes.length === 0) {
    resultsGrid.style.display = "none";
    noResults.style.display = "block";
    resultsCount.textContent = "";
    return;
  }

  noResults.style.display = "none";
  resultsGrid.style.display = "grid";
  resultsCount.textContent = `${routes.length} bus${routes.length > 1 ? "es" : ""} found for ${from} → ${to}`;

  const favs = getFavourites();

  resultsGrid.innerHTML = routes.map((route, idx) => {
    const departures = getNextDepartures(route, 3);
    const crowd      = getCrowdLevel();
    const isFav      = favs.some(f => f.id === route.id && f.from === from && f.to === to);

    return `
      <div class="result-card" style="animation-delay:${idx * 0.08}s">
        <div class="rc-header">
          <div class="rc-badge" style="background:${route.color}20; border-color:${route.color}40; color:${route.color}">
            🚌 ${route.id}
          </div>
          <div class="rc-name">${route.name}</div>
          <button class="fav-btn ${isFav ? "fav-active" : ""}"
                  onclick="toggleFav('${route.id}','${from}','${to}', this)"
                  title="${isFav ? "Remove from favourites" : "Save to favourites"}">
            ${isFav ? "★" : "☆"}
          </button>
        </div>

        <div class="rc-route-line">
          <div class="rc-stop-dot rc-dot-from"></div>
          <span class="rc-stop-name">${route.segmentFrom}</span>
          <div class="rc-route-dashes"></div>
          <span class="rc-stop-count">${route.stopCount} stop${route.stopCount > 1 ? "s" : ""}</span>
          <div class="rc-route-dashes"></div>
          <div class="rc-stop-dot rc-dot-to"></div>
          <span class="rc-stop-name">${route.segmentTo}</span>
        </div>

        ${route.via.length ? `
          <div class="rc-via">
            <span class="rc-via-label">Via</span>
            ${route.via.map(v => `<span class="rc-via-chip">${v}</span>`).join("")}
          </div>` : ""}

        <div class="rc-meta">
          <div class="rc-meta-item">
            <span class="rc-meta-icon">⏱️</span>
            <span>${route.segmentMin} min</span>
          </div>
          <div class="rc-meta-item">
            <span class="rc-meta-icon">💰</span>
            <span>₹${route.segmentFare}</span>
          </div>
          <div class="rc-meta-item">
            <span class="rc-meta-icon">🔄</span>
            <span>${route.frequency}</span>
          </div>
          <div class="rc-meta-item crowd-pill" style="color:${crowd.color}">
            <span>${crowd.emoji}</span>
            <span>${crowd.label}</span>
          </div>
        </div>

        <div class="rc-departures">
          <div class="rc-dep-label">Next departures</div>
          <div class="rc-dep-list">
            ${departures.map((d, i) => `
              <div class="rc-dep-item ${i === 0 ? "dep-next" : ""}">
                <span class="dep-time">${d.time}</span>
                <span class="dep-label">${d.label}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="rc-actions">
          <a href="booking.html?route=${route.id}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}"
             class="rc-btn rc-btn-primary">
            🎟️ Book Ticket
          </a>
          <a href="live-track.html?route=${route.id}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}"
             class="rc-btn rc-btn-secondary">
            🗺️ Track Live
          </a>
          <a href="timetable.html?route=${route.id}"
             class="rc-btn rc-btn-secondary">
            📅 Schedule
          </a>
        </div>
      </div>
    `;
  }).join("");

  // Animate cards
  setTimeout(() => {
    document.querySelectorAll(".result-card").forEach(card => {
      card.classList.add("card-visible");
    });
  }, 50);
}

// ── Favourites (localStorage) ────────────────────────────────
function getFavourites() {
  try { return JSON.parse(localStorage.getItem("tg_favourites") || "[]"); }
  catch { return []; }
}

function saveFavourites(favs) {
  localStorage.setItem("tg_favourites", JSON.stringify(favs));
}

function toggleFav(routeId, from, to, btn) {
  let favs  = getFavourites();
  const key = favs.findIndex(f => f.id === routeId && f.from === from && f.to === to);

  if (key === -1) {
    favs.push({ id: routeId, from, to, saved: new Date().toISOString() });
    btn.textContent = "★";
    btn.classList.add("fav-active");
    showToast("Route saved to favourites ★");
  } else {
    favs.splice(key, 1);
    btn.textContent = "☆";
    btn.classList.remove("fav-active");
    showToast("Removed from favourites");
  }
  saveFavourites(favs);
}

// ── Toast notification ───────────────────────────────────────
function showToast(msg) {
  const existing = document.querySelector(".tg-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "tg-toast";
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("toast-show"), 10);
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ── Popular routes quick picks ───────────────────────────────
document.querySelectorAll(".quick-route").forEach(chip => {
  chip.addEventListener("click", () => {
    fromInput.value = chip.dataset.from;
    toInput.value   = chip.dataset.to;
    fromInput.classList.add("input-filled");
    toInput.classList.add("input-filled");
    document.querySelectorAll(".quick-route").forEach(c => c.classList.remove("qr-active"));
    chip.classList.add("qr-active");
    doSearch();
  });
});

// ── Init autocomplete on both inputs ────────────────────────
setupAutocomplete(fromInput, fromDropdown, "from");
setupAutocomplete(toInput,   toDropdown,   "to");
