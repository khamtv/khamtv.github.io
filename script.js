// ── NAV SCROLL ──
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('visible', window.scrollY > 400);
  highlightNav();
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link, .footer-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

// ── TYPED TEXT ──
const roles = ['Research Associate', 'Lecturer', 'Social Work PhD', 'Community Expert'];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const word = roles[ri];
  typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
  let delay = deleting ? 60 : 100;
  if (!deleting && ci > word.length) { delay = 1800; deleting = true; }
  else if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; delay = 300; }
  setTimeout(type, delay);
}
type();

// ── PARTICLES ──
const particleContainer = document.getElementById('particles');
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 2;
  const hue = Math.random() > 0.5 ? '262' : '194';
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random()*100}%;
    background: hsl(${hue},80%,65%);
    animation-duration: ${Math.random()*15+10}s;
    animation-delay: ${Math.random()*10}s;
  `;
  particleContainer.appendChild(p);
}

// ── STAT COUNTER ──
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = +el.dataset.target;
    let count = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = Math.floor(count);
      if (count >= target) clearInterval(timer);
    }, 25);
  });
}

// ── SKILL BARS ──
function animateSkills() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}

// ── INTERSECTION OBSERVER ──
const observerOpts = { threshold: 0.15 };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, observerOpts);

document.querySelectorAll('.skill-category, .project-card, .timeline-card, .edu-card, .contact-item').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Trigger skill bars when skills section visible
const skillsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { animateSkills(); skillsObserver.disconnect(); }
}, { threshold: 0.2 });
const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

// Trigger counters when hero stats visible
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── CONTACT FORM ──
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  const feedback = document.getElementById('form-feedback');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message 🚀';
    btn.disabled = false;
    feedback.textContent = '✅ Message sent! I\'ll get back to you soon.';
    this.reset();
    setTimeout(() => feedback.textContent = '', 5000);
  }, 1500);
});

// ── SMOOTH HERO IMAGE FALLBACK ──
document.getElementById('hero-avatar').addEventListener('error', function() {
  this.style.background = 'linear-gradient(135deg,#7c3aed,#06b6d4)';
  this.src = '';
});
