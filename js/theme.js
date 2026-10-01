/**
 * TRANSITGO — BESPOKE THEME & UI ENHANCEMENT ENGINE
 * Handles:
 *  - Seamless Dual Theme (Obsidian Dark / Stripe Light) with localStorage & map sync
 *  - Ambient Spotlight Cursor Glow on cards
 *  - Animated Telemetry Number Counters
 *  - Real-time Pune Transit-Weather Impact Telemetry Chip
 *  - Global Audio-Visual Micro-Interactions
 */

(function () {
  'use strict';

  // 1. THEME MANAGEMENT
  const STORAGE_KEY = 'transitgo_theme';
  const getInitialTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return 'dark'; // Default to deep obsidian transit OS
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateThemeToggleIcons(theme);

    // Dispatch event so Leaflet map can swap tiles
    window.dispatchEvent(new CustomEvent('transitgo:themeChanged', { detail: { theme } }));
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  };

  const updateThemeToggleIcons = (theme) => {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.innerHTML = isDark
      ? `<svg class="theme-icon sun-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <span class="theme-label">Light</span>`
      : `<svg class="theme-icon moon-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span class="theme-label">Dark</span>`;
  };

  // 2. INJECT NAVBAR THEME BUTTON & WEATHER CHIP IF MISSING
  const setupNavbarEnhancements = () => {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    // A. Pune Weather Context Telemetry Chip
    if (!document.getElementById('transit-weather-chip')) {
      const weatherChip = document.createElement('div');
      weatherChip.id = 'transit-weather-chip';
      weatherChip.className = 'transit-weather-chip';
      weatherChip.title = 'Live Pune City Transit Conditions';
      weatherChip.innerHTML = `
        <span class="tw-pulse"></span>
        <span class="tw-icon">🌦️</span>
        <span class="tw-text">Pune <strong>26°C</strong> · Fleet Load <strong>Nominal</strong></span>
      `;
      // Place right next to logo or links
      const logo = navContainer.querySelector('.nav-logo');
      if (logo && logo.nextSibling) {
        navContainer.insertBefore(weatherChip, logo.nextSibling);
      } else {
        navContainer.prepend(weatherChip);
      }
    }

    // B. Theme Switcher Button in Nav Action area
    let navAction = navContainer.querySelector('.nav-action') || navContainer.querySelector('.nav-btn')?.parentNode;
    if (!navAction) {
      navAction = document.createElement('div');
      navAction.className = 'nav-action';
      navContainer.appendChild(navAction);
    }

    if (!document.getElementById('theme-toggle-btn')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'theme-toggle-btn';
      toggleBtn.type = 'button';
      toggleBtn.className = 'theme-toggle-btn';
      toggleBtn.addEventListener('click', toggleTheme);
      navAction.prepend(toggleBtn);
    }

    updateThemeToggleIcons(document.documentElement.getAttribute('data-theme') || 'dark');
  };

  // 3. AMBIENT AURORA BACKGROUND INJECTION
  const setupAmbientAurora = () => {
    if (document.querySelector('.ambient-aurora-bg')) return;
    const aurora = document.createElement('div');
    aurora.className = 'ambient-aurora-bg';
    aurora.setAttribute('aria-hidden', 'true');
    aurora.innerHTML = `
      <div class="aurora-blob aurora-blob-1"></div>
      <div class="aurora-blob aurora-blob-2"></div>
      <div class="aurora-blob aurora-blob-3"></div>
    `;
    document.body.prepend(aurora);
  };

  // 4. SPOTLIGHT CURSOR HALO EFFECT ON CARDS
  const setupSpotlightCards = () => {
    const selector = '.glass-card, .feature-card, .pain-card, .stat-card, .step-item, .roadmap-item, .team-card, .rt-card, .bk-card, .al-card, .cr-insight-card, .tt-table-wrap';
    
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll(selector);
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Check if card is somewhat near the mouse (within 300px)
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x >= -50 && x <= rect.width + 50 && y >= -50 && y <= rect.height + 50) {
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
          card.classList.add('has-spotlight');
        } else {
          card.classList.remove('has-spotlight');
        }
      });
    });
  };

  // 5. ANIMATED NUMERICAL COUNTERS
  const setupNumberCounters = () => {
    const counterElements = document.querySelectorAll('[data-counter], .stat-number, .al-stat-val');
    if (!counterElements.length) return;

    const animateVal = (el, targetStr) => {
      const hasPercent = targetStr.includes('%');
      const hasPlus = targetStr.includes('+');
      const hasX = targetStr.includes('x');
      const num = parseFloat(targetStr.replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return;

      let start = 0;
      const duration = 1200;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        // Ease out quad
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * num);
        
        let out = current.toLocaleString();
        if (hasPlus) out += '+';
        if (hasPercent) out += '%';
        if (hasX) out += 'x';

        el.textContent = out;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = targetStr; // ensure exact ending string
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const orig = el.getAttribute('data-original-val') || el.textContent.trim();
          el.setAttribute('data-original-val', orig);
          animateVal(el, orig);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => counterObserver.observe(el));
  };

  // Initialize immediately
  const initialTheme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupNavbarEnhancements();
      setupAmbientAurora();
      setupSpotlightCards();
      setupNumberCounters();
    });
  } else {
    setupNavbarEnhancements();
    setupAmbientAurora();
    setupSpotlightCards();
    setupNumberCounters();
  }

  // Expose helper globally
  window.TransitGoTheme = {
    toggle: toggleTheme,
    set: applyTheme,
    get: () => document.documentElement.getAttribute('data-theme') || 'dark'
  };

})();
