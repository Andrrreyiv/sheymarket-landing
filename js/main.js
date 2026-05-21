/* Швеймаркет landing — light interactions */
(function () {
  'use strict';

  // ----- Burger / mobile menu -----
  const burger = document.querySelector('.burger');
  const drawer = document.getElementById('mobile-menu');
  const body = document.body;

  if (burger && drawer) {
    const closeDrawer = () => {
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      body.classList.remove('no-scroll');
    };
    const openDrawer = () => {
      burger.classList.add('is-active');
      burger.setAttribute('aria-expanded', 'true');
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      body.classList.add('no-scroll');
    };
    burger.addEventListener('click', () => {
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer();
    });
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
  }

  // ----- Phone mask (simple) -----
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', (e) => {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
      let out = '';
      if (digits.length) out = '+7';
      if (digits.length > 1) out += ' (' + digits.slice(1, 4);
      if (digits.length >= 5) out += ') ' + digits.slice(4, 7);
      if (digits.length >= 8) out += '-' + digits.slice(7, 9);
      if (digits.length >= 10) out += '-' + digits.slice(9, 11);
      e.target.value = out;
    });
  });

  // ----- Form submit: AJAX to Google Apps Script (user stays on page) -----
  document.querySelectorAll('form[action*="script.google.com"]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Отправляем…';
        btn.disabled = true;
        btn.style.opacity = '0.75';
      }

      fetch(form.action, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(new FormData(form))
      })
        .then(() => {
          form.innerHTML =
            '<div class="form-success">' +
              '<svg viewBox="0 0 24 24" width="52" height="52" aria-hidden="true"><path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' +
              '<p class="form-success__title">Заявка принята!</p>' +
              '<p class="form-success__sub">Перезвоним в течение 15 минут<br>в рабочее время (Пн–Сб, 9:00–19:00).</p>' +
            '</div>';
        })
        .catch(() => {
          if (btn) {
            btn.textContent = 'Отправить заявку';
            btn.disabled = false;
            btn.style.opacity = '';
          }
          alert('Не удалось отправить заявку. Позвоните нам напрямую: +7 (928) 078-84-66');
        });
    });
  });

  // ----- Reveal on scroll with stagger inside containers -----
  const revealSelectors = [
    '.section-head',
    '.qcard',
    '.clients__points li',
    '.testimonial__card',
    '.cat-card',
    '.plan__step',
    '.plan__cta',
    '.fur-intro__card',
    '.fur-intro__pills li',
    '.problem-card',
    '.problems__solution',
    '.tag',
    '.prod-card',
    '.step-card',
    '.metric',
    '.m-tag',
    '.bridge__inner',
    '.final-cta__grid',
    '.hero__form',
    '.hero__badges li'
  ].join(', ');

  const revealTargets = document.querySelectorAll(revealSelectors);

  // Group adjacent same-parent items to apply stagger delays
  const groupMap = new Map();
  revealTargets.forEach((el) => {
    el.classList.add('reveal');
    const parent = el.parentElement;
    if (!groupMap.has(parent)) groupMap.set(parent, []);
    groupMap.get(parent).push(el);
  });
  groupMap.forEach((items) => {
    items.forEach((el, idx) => {
      el.style.setProperty('--reveal-delay', `${Math.min(idx, 6) * 70}ms`);
    });
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // ----- Smooth scroll for anchor links (extra fallback) -----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 88;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
