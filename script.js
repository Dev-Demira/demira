/* Dev-Demira, Shared site script */
(function () {

  /* ── FIRST-VISIT REDIRECT ──────────────────────────────────
     On a brand-new browser session (tab opened fresh, not an in-site
     navigation), always land on the home/hero page. sessionStorage is
     cleared when the user closes the tab/browser, so the next visit
     re-triggers this redirect. */
  try {
    if (!sessionStorage.getItem('dm-session')) {
      sessionStorage.setItem('dm-session', '1');
      var path = window.location.pathname.split('/').pop();
      if (path && path !== '' && path !== 'index.html' && path !== 'index') {
        window.location.replace('index.html');
        return;
      }
    }
  } catch (e) { /* storage blocked, ignore */ }


  /* ── THEME ─────────────────────────────────────────────── */
  var root = document.documentElement;
  var saved = localStorage.getItem('dm-theme') || 'dark';
  root.setAttribute('data-theme', saved);
  syncThemeBtn(saved);

  var tBtn = document.getElementById('themeToggle');
  if (tBtn) {
    tBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('dm-theme', next);
      syncThemeBtn(next);
    });
  }
  function syncThemeBtn(t) {
    var i = document.getElementById('ti'), l = document.getElementById('tl');
    if (i) i.innerHTML = t === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
    if (l) l.textContent = t === 'dark' ? 'Light' : 'Dark';
  }

  /* ── HAMBURGER NAV ──────────────────────────────────────── */
  var ham = document.getElementById('ham');
  var nl = document.getElementById('navLinks');
  if (ham && nl) {
    ham.addEventListener('click', function () {
      var o = nl.classList.toggle('open');
      ham.setAttribute('aria-expanded', String(o));
    });
    nl.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nl.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── SCROLL TOP ─────────────────────────────────────────── */
  var stb = document.getElementById('stb');
  if (stb) {
    window.addEventListener('scroll', function () {
      stb.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    stb.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ── TYPEWRITER (home page) ─────────────────────────────── */
  var tw = document.getElementById('tw');
  if (tw) {
    var phrases = [
      'a website that sells for you.',
      'a landing page that converts.',
      'an app your users love.',
    ];
    var pi = 0, ci = 0, del = false;
    function type() {
      var cur = phrases[pi];
      if (!del) {
        tw.textContent = cur.slice(0, ci + 1); ci++;
        if (ci === cur.length) { del = true; setTimeout(type, 2000); return; }
        setTimeout(type, 58);
      } else {
        tw.textContent = cur.slice(0, ci - 1); ci--;
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(type, 340); return; }
        setTimeout(type, 30);
      }
    }
    setTimeout(type, 1200);
  }

  /* ── FLOATING CONTACT FAB (all pages) ───────────────────── */
  (function buildFab() {
    var fab = document.createElement('div');
    fab.className = 'fab-wrap';
    fab.innerHTML =
      '<div class="fab-actions" id="fabActions" aria-hidden="true">' +
        '<a class="fab-action fab-wa" href="https://wa.me/2349059639220" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" title="WhatsApp">' +
          '<svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M19.11 17.27c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15-.19.29-.74.93-.9 1.12-.17.2-.33.22-.62.07-.29-.15-1.21-.45-2.3-1.42-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49l-.55-.01c-.19 0-.5.07-.77.37-.26.29-1 .98-1 2.38 0 1.4 1.02 2.76 1.16 2.95.15.2 2.02 3.08 4.89 4.32.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.13-.26-.2-.55-.34zM16.02 5.33c-5.9 0-10.7 4.79-10.7 10.69 0 1.89.5 3.74 1.44 5.36L5 27l5.78-1.52a10.66 10.66 0 005.23 1.33h.01c5.9 0 10.69-4.79 10.69-10.69-.01-2.85-1.12-5.54-3.14-7.56a10.62 10.62 0 00-7.55-3.23z"/></svg>' +
          '<span>WhatsApp</span>' +
        '</a>' +
        '<a class="fab-action fab-em" href="mailto:devmosheh@gmail.com" aria-label="Send an email" title="Email">' +
          '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4.24-8 5.33-8-5.33V6l8 5.33L20 6v2.24z"/></svg>' +
          '<span>Email</span>' +
        '</a>' +
      '</div>' +
      '<button class="fab-toggle" id="fabToggle" type="button" aria-label="Open contact options" aria-expanded="false">' +
        '<svg class="fab-ic fab-ic-open" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M20 15.5a8.5 8.5 0 01-13-.78L4.5 18v-4.5H9l-1.78 1.78A6.5 6.5 0 1018 12h2a8.5 8.5 0 01-2 5.5z"/><path fill="currentColor" d="M12 6a6 6 0 00-6 6h2a4 4 0 118 0h2a6 6 0 00-6-6z"/></svg>' +
        '<svg class="fab-ic fab-ic-close" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M18.3 5.71L12 12.01l-6.29-6.3-1.42 1.42L10.59 13.43 4.29 19.72l1.42 1.42L12 14.84l6.29 6.3 1.42-1.42L13.41 13.43l6.31-6.3z"/></svg>' +
      '</button>';
    document.body.appendChild(fab);

    var toggle = fab.querySelector('#fabToggle');
    var actions = fab.querySelector('#fabActions');
    toggle.addEventListener('click', function () {
      var open = fab.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      actions.setAttribute('aria-hidden', String(!open));
    });
    document.addEventListener('click', function (e) {
      if (!fab.contains(e.target) && fab.classList.contains('open')) {
        fab.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        actions.setAttribute('aria-hidden', 'true');
      }
    });
  })();

  /* ── CONTACT FORM (contact page) ───────────────────────── */
  var form   = document.getElementById('cForm');
  var toast  = document.getElementById('formToast');
  var svcSel = document.getElementById('fs');
  var otherWrap = document.getElementById('otherWrap');

  /* Show/hide "Other, describe your need" textarea */
  if (svcSel && otherWrap) {
    svcSel.addEventListener('change', function () {
      if (this.value === 'Other') {
        otherWrap.classList.add('show');
        otherWrap.querySelector('textarea').setAttribute('required', 'required');
      } else {
        otherWrap.classList.remove('show');
        otherWrap.querySelector('textarea').removeAttribute('required');
        otherWrap.querySelector('textarea').value = '';
      }
    });
  }




  /* ── SUCCESS DIALOG (modal) ─────────────────────────────── */
  function buildDialog() {
    var d = document.createElement('div');
    d.className = 'modal';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-labelledby', 'modalTitle');
    d.innerHTML =
      '<div class="modal-card">' +
        '<div class="modal-ck" aria-hidden="true">&#9989;</div>' +
        '<h3 id="modalTitle">Message received!</h3>' +
        '<p>Thanks for reaching out, I\'ve got your details and I\'ll be in touch within 24 hours.</p>' +
        '<button type="button" class="modal-btn" id="modalBack">Back to form</button>' +
      '</div>';
    document.body.appendChild(d);
    document.getElementById('modalBack').addEventListener('click', function () {
      window.location.reload();
    });
    return d;
  }

  if (form) {

    /* ─ Field validation helpers ─ */
    function setError(input, msg) {
      input.classList.add('error');
      var group = input.closest('.f-group');
      if (group) {
        var errEl = group.querySelector('.err-msg');
        if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
      }
    }
    function clearError(input) {
      input.classList.remove('error');
      var group = input.closest('.f-group');
      if (group) {
        var errEl = group.querySelector('.err-msg');
        if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }
      }
    }
    function validateForm() {
      var ok = true;
      var name = document.getElementById('fn');
      if (name) {
        if (!name.value.trim()) { setError(name, 'Please enter your name.'); ok = false; }
        else clearError(name);
      }
      var email = document.getElementById('fe');
      if (email) {
        var emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) { setError(email, 'Please enter your email.'); ok = false; }
        else if (!emailRx.test(email.value.trim())) { setError(email, 'Please enter a valid email address.'); ok = false; }
        else clearError(email);
      }
      if (svcSel) {
        if (!svcSel.value) { setError(svcSel, 'Please select a service.'); ok = false; }
        else clearError(svcSel);
      }
      var msg = document.getElementById('fm');
      if (msg) {
        if (!msg.value.trim() || msg.value.trim().length < 10) {
          setError(msg, 'Please describe your project (at least 10 characters).'); ok = false;
        } else clearError(msg);
      }
      if (svcSel && svcSel.value === 'Other' && otherWrap) {
        var otherTa = otherWrap.querySelector('textarea');
        if (otherTa && !otherTa.value.trim()) {
          setError(otherTa, 'Please describe the service you need.'); ok = false;
        } else if (otherTa) clearError(otherTa);
      }
      return ok;
    }

    form.querySelectorAll('input,textarea,select').forEach(function (el) {
      el.addEventListener('input', function () { clearError(el); });
      el.addEventListener('change', function () { clearError(el); });
    });

    /* Hidden iframe lets us submit cross-origin without CORS and still show our modal.
       FormSubmit's AJAX endpoint is blocked from non-production origins and from
       unactivated hashes; a normal POST into an iframe always goes through. */
    var hiddenFrame = document.createElement('iframe');
    hiddenFrame.name = 'fs_frame';
    hiddenFrame.id = 'fs_frame';
    hiddenFrame.style.display = 'none';
    document.body.appendChild(hiddenFrame);
    form.setAttribute('target', 'fs_frame');

    form.addEventListener('submit', function (e) {
      if (!validateForm()) { e.preventDefault(); return; }

      var btn = form.querySelector('.f-submit');
      btn.textContent = 'Sending\u2026';
      btn.disabled = true;
      if (toast) toast.classList.remove('show', 'error');

      var done = false;
      function showSuccess() {
        if (done) return;
        done = true;
        var dlg = buildDialog();
        requestAnimationFrame(function () { dlg.classList.add('show'); });
      }

      /* iframe 'load' fires once FormSubmit responds (or follows its redirect). */
      hiddenFrame.addEventListener('load', showSuccess, { once: true });

      /* Safety net: some browsers suppress the load event for cross-origin
         navigations, assume success after 3.5s so the user always gets feedback. */
      setTimeout(showSuccess, 3500);
      /* native submit proceeds into the hidden iframe */
    });
  }

})();
