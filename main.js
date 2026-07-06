/* Demira Portfolio v2.2 — vanilla JS — Emmanuel Moses */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nav = $('#nav');
  const ham = $('#ham');
  const menu = $('#mobileMenu');
  const overlay = $('#menuOverlay');
  const menuClose = $('#menuClose');
  const stb = $('#stb');
  const links = $$('.nav-links a');
  const sections = ['top', 'work', 'about', 'services', 'process', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  /* ---------- Scroll: nav + back-to-top + active + parallax ---------- */
  function onScroll() {
    const y = window.scrollY || window.pageYOffset || 0;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (stb) stb.classList.toggle('show', y > 300);

    if (sections.length) {
      let active = sections[0].id;
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= 120) active = s.id;
      }
      links.forEach((a) =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + active)
      );
    }

    if (!prefersReduced) {
      $$('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const offset = (r.top - window.innerHeight / 2) * speed * -1;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll to top (FIX 2) ---------- */
  if (stb) {
    stb.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
      } catch (err) {
        window.scrollTo(0, 0);
      }
    });
  }

  /* ---------- Mobile menu (FIX 6) ---------- */
  function openMenu() {
    if (!menu) return;
    menu.classList.add('open');
    ham.classList.add('open');
    ham.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    if (overlay) {
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add('show'));
    }
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    if (overlay) {
      overlay.classList.remove('show');
      setTimeout(() => { overlay.hidden = true; }, 300);
    }
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
  ham?.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  menuClose?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  /* ---------- Smooth anchor scroll ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const t = document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Word-stagger reveal ---------- */
  $$('.reveal-words').forEach((el) => {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    let i = 0;
    nodes.forEach((node) => {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((p) => {
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        if (!p) return;
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = p;
        span.style.transitionDelay = (i++ * 60) + 'ms';
        frag.appendChild(span);
      });
      node.replaceWith(frag);
    });
  });

  /* ---------- Intersection Observer reveals + count-up ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        if (entry.target.classList.contains('process')) entry.target.classList.add('drawn');
        if (entry.target.classList.contains('stat-num')) countUp(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  $$('.reveal, .reveal-words, .process, .stat-num[data-count]').forEach((el) => io.observe(el));

  requestAnimationFrame(() => {
    $$('.hero .reveal, .hero .reveal-words').forEach((el) => el.classList.add('in'));
  });

  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    if (Number.isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const plus = el.querySelector('em')?.outerHTML || '';
    if (prefersReduced) { el.innerHTML = target + suffix + plus; return; }
    const dur = 900;
    const start = performance.now();
    function tick(t) {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.innerHTML = val + suffix + plus;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* Hero background: single static image — rotation removed */

  /* Portrait tilt removed — hero portrait no longer present */

  /* ---------- Floating support widget ---------- */
  const support = $('#support');
  const supportToggle = $('#supportToggle');
  const supportActions = $('#supportActions');
  function openSupport() {
    support.classList.add('open');
    supportToggle.setAttribute('aria-expanded', 'true');
    supportActions.setAttribute('aria-hidden', 'false');
  }
  function closeSupport() {
    if (!support) return;
    support.classList.remove('open');
    supportToggle?.setAttribute('aria-expanded', 'false');
    supportActions?.setAttribute('aria-hidden', 'true');
  }
  supportToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    support.classList.contains('open') ? closeSupport() : openSupport();
  });
  document.addEventListener('click', (e) => {
    if (support && !support.contains(e.target)) closeSupport();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSupport();
      if (menu && menu.classList.contains('open')) closeMenu();
    }
  });

  /* ---------- Contact form: validation + Others reveal (FIX 1 reset) ---------- */
  const form = $('#cForm');
  if (form) {
    const submitBtn = $('#fSubmit');
    const serviceSel = $('#fs');
    const othersGroup = $('#fOthersGroup');
    const otherField = $('#fo');

    // Reset form when returning from success page
    try {
      if (sessionStorage.getItem('demira-reset-contact-form') === '1') {
        form.reset();
        sessionStorage.removeItem('demira-reset-contact-form');
        $$('.f-group', form).forEach((g) => {
          g.classList.remove('is-invalid');
          const err = g.querySelector('.f-err');
          if (err) { err.hidden = true; err.textContent = ''; }
        });
        if (othersGroup) {
          othersGroup.hidden = true;
          othersGroup.classList.remove('is-visible');
        }
      }
    } catch (e) {}

    const validators = {
      name: (v) => v.trim().length >= 2 || 'Please enter your name (2+ characters).',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
      service: (v) => (v && v !== '') || 'Pick one of the services.',
      message: (v) => v.trim().length >= 20 || 'Tell me a little more (20+ characters).',
      other: (v, required) => (!required || v.trim().length >= 10) || 'A short description helps (10+ characters).',
    };

    function fieldValue(el) { return el.value; }
    function validateField(el, silent = false) {
      const kind = el.dataset.validate;
      const required = kind === 'other' ? serviceSel.value === 'Others' : true;
      const result = validators[kind](fieldValue(el), required);
      const group = el.closest('.f-group');
      const err = group.querySelector('.f-err');
      const valid = result === true;
      if (!silent) {
        group.classList.toggle('is-invalid', !valid);
        if (err) {
          if (valid) { err.hidden = true; err.textContent = ''; }
          else { err.hidden = false; err.textContent = result; }
        }
      }
      return valid;
    }
    function validateAll(silent = true) {
      const fields = $$('[data-validate]', form).filter((el) => {
        if (el.dataset.validate === 'other') return serviceSel.value === 'Others';
        return true;
      });
      const allValid = fields.every((el) => validateField(el, silent));
      submitBtn.disabled = !allValid;
      return allValid;
    }

    $$('[data-validate]', form).forEach((el) => {
      el.addEventListener('input', () => { validateField(el); validateAll(); });
      el.addEventListener('blur', () => validateField(el));
      el.addEventListener('change', () => { validateField(el); validateAll(); });
    });

    serviceSel.addEventListener('change', () => {
      const isOthers = serviceSel.value === 'Others';
      if (isOthers) {
        othersGroup.hidden = false;
        requestAnimationFrame(() => othersGroup.classList.add('is-visible'));
      } else {
        othersGroup.classList.remove('is-visible');
        setTimeout(() => { othersGroup.hidden = true; }, 400);
        otherField.value = '';
        otherField.closest('.f-group').classList.remove('is-invalid');
        const err = otherField.closest('.f-group').querySelector('.f-err');
        if (err) { err.hidden = true; err.textContent = ''; }
      }
      validateAll();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateAll(false)) return;

      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const data = new FormData(form);
      const payload = {};
      data.forEach((v, k) => { payload[k] = v; });

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then((r) => r.json().catch(() => ({ success: r.ok })))
        .then((res) => {
          if (res && (res.success === true || res.success === 'true')) {
            const base = location.pathname.replace(/[^/]*$/, '');
            window.location.href = base + 'success.html';
          } else {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
            alert((res && res.message) || 'Something went wrong. Please try again or email devmosheh@gmail.com.');
          }
        })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
          alert('Network error. Please try again or email devmosheh@gmail.com.');
        });
    });

    validateAll();
  }
})();
