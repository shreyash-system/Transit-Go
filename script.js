// ===========================
// TRANSITGO — INTERACTIONS
// ===========================

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Waitlist form
function handleWaitlist() {
  const input = document.getElementById('email-input');
  const success = document.getElementById('cta-success');
  const btn = document.getElementById('waitlist-btn');

  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    input.style.borderColor = '#f5576c';
    input.placeholder = 'Please enter a valid email';
    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = 'Enter your email address';
    }, 2000);
    return;
  }

  btn.textContent = 'Joining...';
  btn.style.opacity = '0.7';

  setTimeout(() => {
    input.style.display = 'none';
    btn.style.display = 'none';
    success.style.display = 'block';
    success.textContent = `You are on the list! (${email}) We will notify you at launch.`;
  }, 900);
}

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

// Apply to cards
window.addEventListener('DOMContentLoaded', () => {
  const animatables = document.querySelectorAll(
    '.pain-card, .step-item, .feature-card, .roadmap-item, .team-card'
  );
  animatables.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });

  // ETA counter on bus cards - live-ish feel
  setInterval(() => {
    const eta = document.querySelector('.br-eta');
    if (eta) {
      const current = parseInt(eta.textContent);
      if (current > 1) {
        eta.textContent = (current - 1) + ' min';
      } else {
        eta.textContent = 'Arriving';
        eta.style.color = '#43e97b';
        setTimeout(() => {
          eta.textContent = '3 min';
          eta.style.color = '';
        }, 3000);
      }
    }
  }, 8000);
});

// Smooth navbar link scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
