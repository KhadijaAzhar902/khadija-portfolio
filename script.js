/* =========================================================
   KHADIJA AZHAR PORTFOLIO
   Vanilla JavaScript interactions — no framework required.
   ========================================================= */

(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  /* ---------- Page loader ---------- */
  const loader = doc.querySelector('.page-loader');

  window.addEventListener('load', () => {
    const delay = prefersReducedMotion ? 60 : 1450;
    window.setTimeout(() => loader?.classList.add('is-hidden'), delay);
  });

  // Safety fallback in case an external font/image takes too long.
  window.setTimeout(() => loader?.classList.add('is-hidden'), 3500);

  /* ---------- Header state ---------- */
  const header = doc.querySelector('[data-header]');

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 30);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const menuToggle = doc.querySelector('[data-menu-toggle]');
  const mobileMenu = doc.querySelector('[data-mobile-menu]');
  const mobileLinks = mobileMenu?.querySelectorAll('a') || [];

  const setMenu = (open) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
  };

  menuToggle?.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  /* ---------- Scroll reveal ---------- */
  const revealElements = doc.querySelectorAll('.reveal-up, .reveal-text, .reveal-scale');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.13, rootMargin: '0px 0px -7% 0px' }
    );

    revealElements.forEach((el, index) => {
      // Light stagger for adjacent elements without hardcoding animation classes.
      el.style.transitionDelay = `${Math.min((index % 3) * 55, 110)}ms`;
      revealObserver.observe(el);
    });
  }

  /* ---------- Typewriter ---------- */
  const typeTarget = doc.querySelector('[data-typewriter]');
  const phrases = [
    'automation workflows',
    'backend systems',
    'reliable software',
    'observable services'
  ];

  if (typeTarget && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let deleting = true;

    const typeLoop = () => {
      const phrase = phrases[phraseIndex];

      if (deleting) {
        charIndex -= 1;
        typeTarget.textContent = phrase.slice(0, Math.max(charIndex, 0));

        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(typeLoop, 280);
          return;
        }

        window.setTimeout(typeLoop, 38);
        return;
      }

      const nextPhrase = phrases[phraseIndex];
      charIndex += 1;
      typeTarget.textContent = nextPhrase.slice(0, charIndex);

      if (charIndex >= nextPhrase.length) {
        deleting = true;
        window.setTimeout(typeLoop, 1450);
        return;
      }

      window.setTimeout(typeLoop, 68);
    };

    window.setTimeout(typeLoop, 2400);
  }

  /* ---------- Desktop cursor + ambient light ---------- */
  const cursor = doc.querySelector('.custom-cursor');
  const cursorGlow = doc.querySelector('.cursor-glow');
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let renderedX = cursorX;
  let renderedY = cursorY;

  if (!coarsePointer && !prefersReducedMotion && cursor && cursorGlow) {
    doc.addEventListener('mousemove', (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      cursor.style.opacity = '1';
      cursorGlow.style.opacity = '1';
      cursorGlow.style.transform = `translate3d(${cursorX - 260}px, ${cursorY - 260}px, 0)`;
    }, { passive: true });

    const cursorFrame = () => {
      renderedX += (cursorX - renderedX) * 0.22;
      renderedY += (cursorY - renderedY) * 0.22;
      cursor.style.transform = `translate3d(${renderedX}px, ${renderedY}px, 0)`;
      requestAnimationFrame(cursorFrame);
    };
    cursorFrame();

    const hoverables = doc.querySelectorAll('a, button, input, textarea, [data-boss-card], .skill-cloud span');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
  }

  /* ---------- Magnetic buttons / links ---------- */
  if (!coarsePointer && !prefersReducedMotion) {
    doc.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (event) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate3d(${x * 0.12}px, ${y * 0.16}px, 0)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  /* ---------- Boss Mode portrait ---------- */
  const bossCard = doc.querySelector('[data-boss-card]');
  const bossLabel = doc.querySelector('[data-boss-label]');

  if (bossCard && bossLabel) {
    const activateBoss = () => {
      bossCard.classList.add('is-boss');
      bossLabel.textContent = 'BOSS MODE: ACTIVE';
    };

    const deactivateBoss = () => {
      if (coarsePointer) return;
      bossCard.classList.remove('is-boss');
      bossLabel.textContent = 'HOVER TO ACTIVATE';
      bossCard.style.setProperty('--rx', '0deg');
      bossCard.style.setProperty('--ry', '0deg');
    };

    const updateBossPosition = (clientX, clientY) => {
      const rect = bossCard.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;

      bossCard.style.setProperty('--mx', `${px}%`);
      bossCard.style.setProperty('--my', `${py}%`);

      if (!coarsePointer && !prefersReducedMotion) {
        const rotateY = ((x / rect.width) - 0.5) * 5;
        const rotateX = ((y / rect.height) - 0.5) * -5;
        bossCard.style.setProperty('--rx', `${rotateX}deg`);
        bossCard.style.setProperty('--ry', `${rotateY}deg`);
      }
    };

    bossCard.addEventListener('mouseenter', activateBoss);
    bossCard.addEventListener('mousemove', (event) => updateBossPosition(event.clientX, event.clientY));
    bossCard.addEventListener('mouseleave', deactivateBoss);

    bossCard.addEventListener('click', (event) => {
      if (!coarsePointer) return;
      const touchPoint = event.changedTouches?.[0];
      if (touchPoint) updateBossPosition(touchPoint.clientX, touchPoint.clientY);
      const willActivate = !bossCard.classList.contains('is-boss');
      bossCard.classList.toggle('is-boss', willActivate);
      bossLabel.textContent = willActivate ? 'BOSS MODE: ACTIVE' : 'TAP TO ACTIVATE';
    });

    bossCard.addEventListener('touchmove', (event) => {
      const touch = event.touches?.[0];
      if (touch) updateBossPosition(touch.clientX, touch.clientY);
    }, { passive: true });

    bossCard.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      const willActivate = !bossCard.classList.contains('is-boss');
      bossCard.classList.toggle('is-boss', willActivate);
      bossLabel.textContent = willActivate ? 'BOSS MODE: ACTIVE' : (coarsePointer ? 'TAP TO ACTIVATE' : 'HOVER TO ACTIVATE');
    });

    if (coarsePointer) bossLabel.textContent = 'TAP TO ACTIVATE';
  }

  /* ---------- Project card cursor depth ---------- */
  if (!coarsePointer && !prefersReducedMotion) {
    doc.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;

        card.style.setProperty('--card-x', `${px * 100}%`);
        card.style.setProperty('--card-y', `${py * 100}%`);
        card.style.setProperty('--tilt-y', `${(px - 0.5) * 1.2}deg`);
        card.style.setProperty('--tilt-x', `${(py - 0.5) * -1.2}deg`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--tilt-x', '0deg');
      });
    });
  }

  /* ---------- Experience timeline progress ---------- */
  const timeline = doc.querySelector('[data-timeline]');
  const timelineProgress = doc.querySelector('[data-timeline-progress]');

  const updateTimeline = () => {
    if (!timeline || !timelineProgress) return;
    const rect = timeline.getBoundingClientRect();
    const viewportPoint = window.innerHeight * 0.62;
    const travelled = viewportPoint - rect.top;
    const percent = Math.max(0, Math.min(1, travelled / rect.height));
    timelineProgress.style.height = `${percent * 100}%`;
  };

  updateTimeline();
  window.addEventListener('scroll', updateTimeline, { passive: true });
  window.addEventListener('resize', updateTimeline);

  /* ---------- Contact form (mailto fallback) ---------- */
  const contactForm = doc.querySelector('[data-contact-form]');
  const formState = doc.querySelector('[data-form-state]');

  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();

    if (!name || !email || !message) {
      if (formState) formState.textContent = 'CHECK FIELDS';
      return;
    }

    if (formState) formState.textContent = 'DRAFTING…';

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const bodyText = [
      `Hi Khadija,`,
      '',
      message,
      '',
      `— ${name}`,
      email
    ].join('\n');
    const bodyEncoded = encodeURIComponent(bodyText);

    window.location.href = `mailto:khadijaceo90@gmail.com?subject=${subject}&body=${bodyEncoded}`;

    window.setTimeout(() => {
      if (formState) formState.textContent = 'EMAIL APP OPENED';
    }, 450);
  });

  /* ---------- Prevent accidental animation state after resize ---------- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (window.innerWidth > 960) setMenu(false);
    }, 120);
  });
})();
