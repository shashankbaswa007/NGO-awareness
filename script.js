// ===== HERO SLIDESHOW =====
(function() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  let current = 0;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function nextSlide() {
    goTo((current + 1) % slides.length);
  }

  let timer = setInterval(nextSlide, 5000);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(i);
      timer = setInterval(nextSlide, 5000);
    });
  });
})();

// ===== REVEAL ON SCROLL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const duration = 2200;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const cntObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(c => cntObs.observe(c));

// ===== SCROLL LISTENER (navbar + progress + back-top + donate bar) =====
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const docH = document.body.scrollHeight - window.innerHeight;

  // Navbar shadow
  document.querySelector('.nav')
    .classList.toggle('scrolled', sy > 60);

  // Progress bar
  document.getElementById('progress-bar').style.width =
    (docH > 0 ? (sy / docH) * 100 : 0) + '%';

  // Back to top
  document.getElementById('back-top')
    .classList.toggle('show', sy > 400);

  // Floating donate bar — show after scrolling past hero
  const hero = document.getElementById('hero');
  const donateBar = document.getElementById('donateBar');
  const backTop = document.getElementById('back-top');
  if (donateBar && !donateBar.dataset.dismissed) {
    const pastHero = sy > hero.offsetHeight;
    donateBar.classList.toggle('show', pastHero);
    if (backTop) backTop.style.bottom = pastHero ? '80px' : '';
  }
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  const icon = document.getElementById('hamburgerIcon');
  if (isOpen) {
    icon.innerHTML = `
      <line x1="18" y1="6"  x2="6"  y2="18"/>
      <line x1="6"  y1="6"  x2="18" y2="18"/>
    `;
  } else {
    icon.innerHTML = `
      <line x1="3"  y1="6"  x2="21" y2="6" />
      <line x1="3"  y1="12" x2="21" y2="12"/>
      <line x1="3"  y1="18" x2="21" y2="18"/>
    `;
  }
});

function resetHamburger() {
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.getElementById('hamburgerIcon').innerHTML = `
    <line x1="3"  y1="6"  x2="21" y2="6" />
    <line x1="3"  y1="12" x2="21" y2="12"/>
    <line x1="3"  y1="18" x2="21" y2="18"/>
  `;
}

mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', resetHamburger)
);
document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)) {
    resetHamburger();
  }
});

// ===== ACTIVE NAV TRACKING =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-center a');
const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const match = document.querySelector('.nav-center a[href="#' + e.target.id + '"]');
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' });
sections.forEach(s => activeObs.observe(s));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const el = document.querySelector(id);
    if (el) { e.preventDefault(); window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' }); }
  });
});

// ===== PROJECT IMAGE FALLBACK =====
document.querySelectorAll('.proj-img img').forEach(img => {
  img.addEventListener('error', function() {
    const fallbacks = {
      'seva':         'https://inamigosfoundation.org.in/public/storage/post/1738237675.jpg',
      'bachpanshala': 'https://inamigosfoundation.org.in/public/storage/post/1738237659.jpeg',
      'jeev':         'https://inamigosfoundation.org.in/public/storage/post/1738237826.jpg',
      'udaan':        'https://inamigosfoundation.org.in/public/storage/post/1738237839.jpeg',
      'prakriti':     'https://inamigosfoundation.org.in/public/storage/post/1738237744.jpg',
      'vikas':        'https://inamigosfoundation.org.in/public/storage/post/1740818641.jpg',
    };
    const key = Object.keys(fallbacks).find(k => this.src.includes(k));
    if (key) { this.src = fallbacks[key]; this.onerror = null; }
  });
});

// ===== CONTACT FORM =====
const contactBtn = document.querySelector('.co-form .btn');
const toast = document.getElementById('toast');
contactBtn.addEventListener('click', () => {
  const inputs = document.querySelectorAll('.co-form input, .co-form textarea');
  const filled = [...inputs].every(i => i.value.trim() !== '');
  if (!filled) {
    inputs.forEach(i => {
      if (!i.value.trim()) {
        i.style.borderColor = 'var(--primary)';
        setTimeout(() => i.style.borderColor = '', 2000);
      }
    });
    return;
  }
  toast.classList.add('show');
  inputs.forEach(i => i.value = '');
  setTimeout(() => toast.classList.remove('show'), 3500);
});

// ===== NEWSLETTER =====
document.querySelector('.nl-form .btn').addEventListener('click', function() {
  const input = document.querySelector('.nl-form input');
  if (!input.value.includes('@')) {
    input.style.outline = '2px solid var(--dark)';
    setTimeout(() => input.style.outline = '', 2000);
    return;
  }
  this.textContent = '✓ Subscribed!';
  this.style.background = 'var(--green)';
  input.value = '';
  setTimeout(() => {
    this.textContent = 'Subscribe';
    this.style.background = '';
  }, 3000);
});

// ===== BACK TO TOP =====
document.getElementById('back-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== DONATE BAR =====
document.getElementById('donateBarClose').addEventListener('click', () => {
  const bar = document.getElementById('donateBar');
  bar.classList.remove('show');
  bar.dataset.dismissed = 'true';
  document.getElementById('back-top').style.bottom = '';
});

// ===== TEAM ROLE COLOURS =====
document.querySelectorAll('.t-card').forEach(card => {
  const rl = card.querySelector('.rl');
  const role = rl.textContent;
  if (role.includes('Founder') || role.includes('CEO')) {
    rl.style.background = 'rgba(255,107,53,.15)';
    rl.style.color = 'var(--primary)';
  } else if (role.includes('Head') || role.includes('Lead') || role.includes('Specialist')) {
    rl.style.background = 'rgba(45,106,79,.12)';
    rl.style.color = 'var(--green)';
  } else if (role.includes('Senior')) {
    rl.style.background = 'rgba(67,97,238,.12)';
    rl.style.color = '#4361EE';
  } else if (role.includes('CSR')) {
    rl.style.background = 'rgba(244,162,97,.15)';
    rl.style.color = '#F4A261';
  }
});

// ===== GALLERY LIGHTBOX =====
(function() {
  const items = [...document.querySelectorAll('.g-item')];
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  let current = 0;

  function open(index) {
    current = index;
    const img = items[current].querySelector('img');
    const cap = items[current].querySelector('.g-cap');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = cap ? cap.textContent : '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prev() { open((current - 1 + items.length) % items.length); }
  function next() { open((current + 1) % items.length); }

  items.forEach((item, i) => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => open(i));
  });

  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', prev);
  document.getElementById('lbNext').addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });
})();