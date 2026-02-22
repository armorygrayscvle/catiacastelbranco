/* ===========================
   CATIA CASTELBRANCO — Script
   =========================== */

'use strict';

// ── Helpers ─────────────────────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Year ─────────────────────────────────────────────────────────────────────
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Nav: scroll state + mobile toggle ────────────────────────────────────────
const nav       = $('#nav');
const navToggle = $('#navToggle');
const navLinks  = $('#navLinks');

// Scroll state
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile toggle
navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

// Close on link click (mobile)
$$('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ── Gallery filter ────────────────────────────────────────────────────────────
const filterBtns  = $$('.filter-btn');
const galleryItems = $$('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
    });
  });
});

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightbox    = $('#lightbox');
const lbBackdrop  = $('#lbBackdrop');
const lbImg       = $('#lbImg');
const lbCaption   = $('#lbCaption');
const lbClose     = $('#lbClose');
const lbPrev      = $('#lbPrev');
const lbNext      = $('#lbNext');

let lbImages = [];   // [{src, alt}]
let lbCurrent = 0;

function buildImageList() {
  lbImages = galleryItems.map(item => {
    const img = item.querySelector('img');
    return { src: img?.src || '', alt: img?.alt || '' };
  });
}

function openLightbox(index) {
  buildImageList();
  lbCurrent = index;
  showLbImage(lbCurrent);
  lightbox.classList.add('open');
  lbBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lbBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

function showLbImage(index) {
  const { src, alt } = lbImages[index];
  lbImg.src = src;
  lbImg.alt = alt;
  lbCaption.textContent = alt;
  lbCurrent = index;
}

function lbNavigate(dir) {
  const visible = galleryItems
    .map((item, i) => (!item.classList.contains('hidden') ? i : null))
    .filter(i => i !== null);

  const pos = visible.indexOf(lbCurrent);
  if (pos === -1) return;

  const nextPos = (pos + dir + visible.length) % visible.length;
  showLbImage(visible[nextPos]);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lbClose?.addEventListener('click', closeLightbox);
lbBackdrop?.addEventListener('click', closeLightbox);
lbPrev?.addEventListener('click', () => lbNavigate(-1));
lbNext?.addEventListener('click', () => lbNavigate(1));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   lbNavigate(-1);
  if (e.key === 'ArrowRight')  lbNavigate(1);
});

// ── Testimonials slider ────────────────────────────────────────────────────────
const testimonials = $$('.testimonial');
const tPrev = $('#tPrev');
const tNext = $('#tNext');
let tCurrent = 0;

function showTestimonial(index) {
  testimonials.forEach(t => t.classList.remove('active'));
  tCurrent = (index + testimonials.length) % testimonials.length;
  testimonials[tCurrent].classList.add('active');
}

if (testimonials.length) {
  showTestimonial(0);
  tPrev?.addEventListener('click', () => showTestimonial(tCurrent - 1));
  tNext?.addEventListener('click', () => showTestimonial(tCurrent + 1));

  // Auto-advance
  let tInterval = setInterval(() => showTestimonial(tCurrent + 1), 6000);
  [tPrev, tNext].forEach(btn => {
    btn?.addEventListener('click', () => {
      clearInterval(tInterval);
      tInterval = setInterval(() => showTestimonial(tCurrent + 1), 6000);
    });
  });
}

// ── Contact form ───────────────────────────────────────────────────────────────
const contactForm = $('#contactForm');
const formFeedback = $('#formFeedback');

contactForm?.addEventListener('submit', e => {
  e.preventDefault();

  const name    = $('#name').value.trim();
  const email   = $('#email').value.trim();
  const message = $('#message').value.trim();

  if (!name || !email || !message) {
    formFeedback.textContent = 'Please fill in all required fields.';
    formFeedback.className   = 'form-feedback error';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formFeedback.textContent = 'Please enter a valid email address.';
    formFeedback.className   = 'form-feedback error';
    return;
  }

  // Simulate send (replace with actual API / Formspree / Netlify Forms)
  const btn = contactForm.querySelector('.btn-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    formFeedback.textContent = 'Thank you! Your message has been sent. I will be in touch soon.';
    formFeedback.className   = 'form-feedback success';
    contactForm.reset();
    btn.textContent = 'Send message';
    btn.disabled = false;
  }, 1400);
});

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function setupReveal() {
  const targets = [
    ...$$('.section-header'),
    ...$$('.service-card'),
    ...$$('.about-text > *'),
    ...$$('.stat'),
    ...$$('.contact-text > *'),
    ...$$('.contact-form .form-group'),
    ...$$('.gallery-item'),
  ];

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger within groups
    const delay = (i % 4);
    if (delay) el.classList.add(`reveal-delay-${delay}`);
  });

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => io.observe(el));
}

setupReveal();

// ── Hero parallax (subtle) ────────────────────────────────────────────────────
const heroImg = $('#heroImg');
if (heroImg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroImg.style.transform = `translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
}
