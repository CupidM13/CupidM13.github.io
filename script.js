/* ============================================================
   Cupid Moolchandani — editorial site
   Content, theme, sound, drawers, arcade, easter egg
   ============================================================ */
(() => {
  'use strict';

  const S = window.SITE || {};
  const root = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const name = (S.name || 'Cupid Moolchandani').trim();
  const nameParts = name.split(/\s+/);
  const firstName = nameParts[0] || 'Cupid';
  const lastName = nameParts.slice(1).join(' ') || 'Moolchandani';
  const initials = S.initials || nameParts.map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  const locationParts = (S.location || 'India')
    .split('·')
    .map((part) => part.trim())
    .filter(Boolean);
  const baseLocation = locationParts[locationParts.length - 1] || 'India';
  const education = Array.isArray(S.education) ? S.education : [];
  const experience = Array.isArray(S.experience) ? S.experience : [];
  const skills = S.skills && typeof S.skills === 'object' ? S.skills : {};
  const links = S.links && typeof S.links === 'object' ? S.links : {};
  const isAvailable = Boolean(S.available);

  const setText = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  /* ============================================================
     THEME
     ============================================================ */
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  let currentRedraw = () => {};
  let redrawGarden = () => {};

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function syncThemeUI() {
    const theme = currentTheme();
    const button = $('themeToggle');
    if (button) {
      const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
      button.setAttribute('aria-label', label);
      button.title = label;
    }
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0A1310' : '#F5F1E6');
  }

  function applyTheme(theme, persist = true) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) { /* storage blocked */ }
    }
    syncThemeUI();
    window.requestAnimationFrame(() => {
      try { currentRedraw(); } catch (e) { /* canvas not ready */ }
      try { redrawGarden(); } catch (e) { /* garden not ready */ }
    });
  }

  syncThemeUI();

  $('themeToggle')?.addEventListener('click', () => {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  /* ============================================================
     SOUND — quiet, synthesized UI ticks (off by default)
     ============================================================ */
  let soundOn = false;
  try { soundOn = localStorage.getItem('sound') === 'on'; } catch (e) { /* storage blocked */ }

  let audioContext = null;

  function ensureAudio() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }

  function playTick(kind = 'press') {
    if (!soundOn) return;
    const context = ensureAudio();
    if (!context) return;

    try {
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const frequency = kind === 'link' ? 680 : kind === 'toggle' ? 540 : 440;

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.92, now + 0.055);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.032, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.09);
    } catch (e) { /* audio unavailable */ }
  }

  function syncSoundUI() {
    const button = $('soundToggle');
    if (!button) return;
    const label = soundOn ? 'Disable interface sound' : 'Enable interface sound';
    button.setAttribute('aria-pressed', String(soundOn));
    button.setAttribute('aria-label', label);
    button.title = label;
  }

  syncSoundUI();

  $('soundToggle')?.addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem('sound', soundOn ? 'on' : 'off'); } catch (e) { /* storage blocked */ }
    syncSoundUI();
    if (soundOn) playTick('toggle');
  });

  document.addEventListener('click', (event) => {
    const target = event.target.closest('a, button, summary, .memory-card, .ttt-cell, .rps-choice');
    if (!target) return;
    playTick(target.matches('a') ? 'link' : 'press');
  }, true);

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  const nav = $('nav');
  const navLinks = $('navLinks');
  const burger = $('burger');
  const navScrim = $('navScrim');

  function setMenu(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (navScrim) navScrim.classList.toggle('show', open);
    document.body.classList.toggle('menu-open', open);
  }

  burger?.addEventListener('click', () => setMenu(!nav?.classList.contains('open')));
  navLinks?.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', () => setMenu(false));
  });
  navScrim?.addEventListener('click', () => setMenu(false));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && nav?.classList.contains('open')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
      setMenu(false);
      burger?.focus();
    }
  });

  /* ============================================================
     IDENTITY + HERO
     ============================================================ */
  setText('brandName', name);
  setText('brandMark', initials);
  setText('footerMark', initials);
  setText('footerName', name);
  setText('year', new Date().getFullYear());
  setText('heroFirst', firstName);
  setText('heroLast', lastName);
  setText('heroCountry', baseLocation);
  setText('contactLocation', baseLocation);
  setText('heroFocus', S.role || 'AI / ML engineering');
  setText('heroBase', baseLocation);

  // Bio section in background (below tree) - uses same element IDs as original hero
  $$('[data-availability-text]').forEach((el) => {
    el.textContent = isAvailable ? 'Open to work' : 'Building & learning';
  });

  if (!isAvailable) {
    $$('.status-badge, .hero-eyebrow .status').forEach((el) => el.classList.add('is-muted'));
  }

  const tagline = S.tagline || '';
  const tagElement = $('heroTag');
  if (tagElement) {
    const split = tagline.split(/\s+into\s+/i);
    tagElement.innerHTML = split.length > 1
      ? `${esc(split[0])} into <em>${esc(split.slice(1).join(' into '))}</em>`
      : esc(tagline);
  }

  if (education[0]) {
    const school = (education[0].school || '').replace(/^Indian Institute of Technology,?\s*/i, 'IIT ');
    const year = (education[0].years || '').match(/(\d{4})\s*$/);
    setText('heroEducation', `${school}${year ? ` · ${year[1]}` : ''}`);
  }

  /* ---------- typing rotator ---------- */
  const roles = [
    S.role || 'AI / ML Engineer',
    'Energy Market Analyst · Futures First',
    'Teaching Assistant & Researcher · IIT Delhi',
    'Turning data & math into learning systems',
  ];
  const typingElement = $('typingText');

  if (typingElement) {
    if (prefersReduced) {
      typingElement.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      (function typeLoop() {
        const word = roles[roleIndex];

        if (!deleting) {
          typingElement.textContent = word.slice(0, charIndex + 1);
          charIndex += 1;
          if (charIndex === word.length) {
            deleting = true;
            window.setTimeout(typeLoop, 1700);
            return;
          }
        } else {
          typingElement.textContent = word.slice(0, charIndex - 1);
          charIndex -= 1;
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }

        window.setTimeout(typeLoop, deleting ? 36 : 68);
      })();
    }
  }

  /* ============================================================
     BACKGROUND — education, experience, toolkit
     ============================================================ */
  const shortDegree = (degree) => String(degree || '').replace(/^Bachelor of Technology/i, 'B.Tech');
  const shortSchool = (school) => String(school || '').replace(/^Indian Institute of Technology,?\s*/i, 'IIT ');

  function metaPair(label, value) {
    if (!value) return '';
    return `<div class="meta-pair"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`;
  }

  function renderEducation() {
    const list = $('eduList');
    const group = $('eduGroup');
    const count = $('eduCount');
    if (count) count.textContent = pad(education.length);
    if (!list) return;

    if (!education.length) {
      if (group) group.hidden = true;
      return;
    }

    list.innerHTML = education.map((item, index) => {
      const meta = [
        metaPair('School', item.school),
        metaPair('Degree', item.degree),
        metaPair('Period', item.years),
        metaPair('Grade', item.grade),
        metaPair('Activities', item.activities),
        metaPair('Note', item.note),
      ].filter(Boolean).join('');
      const coursework = (item.coursework || [])
        .map((course) => `<span class="chip">${esc(course)}</span>`)
        .join('');

      return `
        <details class="entry reveal" style="--delay:${index * 70}ms">
          <summary class="entry-summary">
            <span class="entry-main">
              <span class="entry-title">${esc(shortDegree(item.degree))}</span>
              <span class="entry-org">${esc(shortSchool(item.school))}${item.grade ? ` <span class="entry-dot">·</span> Grade ${esc(item.grade)}` : ''}</span>
            </span>
            <span class="entry-year">${esc(item.years || '')}</span>
            <span class="entry-plus" aria-hidden="true"></span>
          </summary>
          <div class="entry-body">
            <div class="entry-inner">
              <dl class="meta-grid">${meta}</dl>
              ${coursework ? `<div class="chip-set"><span class="meta-label">Coursework</span><div class="chips">${coursework}</div></div>` : ''}
            </div>
          </div>
        </details>`;
    }).join('');
  }

  function renderExperience() {
    const list = $('expList');
    const group = $('expGroup');
    const count = $('expCount');
    if (count) count.textContent = pad(experience.length);
    if (!list) return;

    if (!experience.length) {
      if (group) group.hidden = true;
      return;
    }

    list.innerHTML = experience.map((item, index) => {
      const meta = [
        metaPair('Role', item.role),
        metaPair('Organisation', item.org),
        metaPair('Engagement', item.type),
        metaPair('Period', item.years),
      ].filter(Boolean).join('');
      const details = (item.details || [])
        .map((detail) => `<li>${esc(detail)}</li>`)
        .join('');

      return `
        <details class="entry reveal" style="--delay:${index * 70}ms">
          <summary class="entry-summary">
            <span class="entry-main">
              <span class="entry-title">${esc(item.role || '')}</span>
              <span class="entry-org">${esc(item.org || '')}${item.type ? ` <span class="entry-dot">·</span> ${esc(item.type)}` : ''}</span>
            </span>
            <span class="entry-year">${esc(item.years || '')}</span>
            <span class="entry-plus" aria-hidden="true"></span>
          </summary>
          <div class="entry-body">
            <div class="entry-inner">
              <dl class="meta-grid">${meta}</dl>
              ${details ? `<ul class="experience-details">${details}</ul>` : ''}
            </div>
          </div>
        </details>`;
    }).join('');
  }

  function renderSkills() {
    const list = $('skillsGrid');
    const count = $('skillCount');
    const entries = Object.entries(skills);
    if (count) count.textContent = pad(entries.length);
    if (!list) return;

    list.innerHTML = entries.map(([category, items], index) => {
      const itemsText = (items || []).map((item) => esc(item)).join(', ');

      return `
        <div class="skill-row reveal" style="--delay:${index * 60}ms">
          <span class="skill-index">${pad(index + 1)}</span>
          <div class="skill-body">
            <h4 class="skill-name">${esc(category)}:</h4>
            <span class="skill-items-text">${itemsText}</span>
          </div>
          <span class="skill-count">${pad((items || []).length)}</span>
        </div>`;
    }).join('');

    const learning = Object.values(skills)
      .flat()
      .filter((item) => typeof item === 'string' && /\(learning\)/i.test(item))
      .map((item) => item.replace(/\s*\(learning\)/i, '').trim());

    const note = $('learningNote');
    if (note && learning.length) {
      const phrase = learning.length === 1
        ? learning[0]
        : learning.length === 2
          ? `${learning[0]} and ${learning[1]}`
          : `${learning.slice(0, -1).join(', ')}, and ${learning[learning.length - 1]}`;
      note.innerHTML = `<span class="note-label">Presently learning</span>${esc(phrase)}.`;
      note.hidden = false;
    }
  }

  renderEducation();
  renderExperience();
  renderSkills();

  /* ============================================================
     CONTACT + SOCIALS
     ============================================================ */
  const linkDefinitions = [
    { key: 'github', label: 'GitHub' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'twitter', label: 'Twitter / X' },
    { key: 'kaggle', label: 'Kaggle' },
    { key: 'resume', label: 'Resume (PDF)' },
  ];

  const activeLinks = linkDefinitions.filter((definition) => links[definition.key]);

  function displayHost(url) {
    try {
      const parsed = new URL(url);
      const path = parsed.pathname === '/' ? '' : parsed.pathname.replace(/\/$/, '');
      return `${parsed.hostname.replace(/^www\./i, '')}${path}`;
    } catch (e) {
      return '';
    }
  }

  const heroSocial = $('heroSocial');
  if (heroSocial) {
    heroSocial.innerHTML = activeLinks.map((definition) => `
      <a class="social-link" href="${esc(links[definition.key])}" target="_blank" rel="noopener noreferrer">
        <span>${esc(definition.label)}</span>
        <span class="arrow" aria-hidden="true">↗</span>
      </a>`).join('');
    if (!activeLinks.length) heroSocial.style.display = 'none';
  }

  const contactLinks = $('contactLinks');
  if (contactLinks) {
    contactLinks.innerHTML = activeLinks.map((definition, index) => `
      <a class="contact-link" href="${esc(links[definition.key])}" target="_blank" rel="noopener noreferrer">
        <span class="contact-index">${pad(index + 1)}</span>
        <span class="contact-label">${esc(definition.label)}</span>
        <span class="contact-host">${esc(displayHost(links[definition.key]))}</span>
        <span class="arrow" aria-hidden="true">↗</span>
      </a>`).join('');

    const count = $('contactLinkCount');
    if (count) count.textContent = pad(activeLinks.length);
    if (!activeLinks.length) contactLinks.closest('.contact-links')?.setAttribute('hidden', '');
  }

  /* ---------- email ---------- */
  const copyStatus = $('copyStatus');

  async function writeClipboard(text) {
    if (!text) return false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* fall through */ }

    try {
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      return copied;
    } catch (e) {
      return false;
    }
  }

  async function copyEmail(button) {
    if (!S.email) return;
    const copied = await writeClipboard(S.email);

    if (!copied) {
      if (copyStatus) copyStatus.textContent = `Could not copy automatically. The address is ${S.email}.`;
      return;
    }

    const label = button.querySelector('.copy-label');
    button.classList.add('is-copied');
    button.setAttribute('aria-label', 'Email address copied');
    if (label) label.textContent = 'Copied';
    if (copyStatus) copyStatus.textContent = 'Email address copied to your clipboard.';

    window.clearTimeout(button._copyTimer);
    button._copyTimer = window.setTimeout(() => {
      button.classList.remove('is-copied');
      button.setAttribute('aria-label', 'Copy email address');
      if (label) label.textContent = 'Copy';
      if (copyStatus) copyStatus.textContent = '';
    }, 2200);
  }

  if (S.email) {
    $$('[data-email-text]').forEach((el) => { el.textContent = S.email; });
    $$('[data-email-link]').forEach((el) => { el.href = `mailto:${S.email}`; });
    $$('[data-copy-email]').forEach((button) => {
      button.addEventListener('click', () => copyEmail(button));
    });
  } else {
    $$('[data-copy-email]').forEach((button) => { button.style.display = 'none'; });
    $$('[data-email-link]').forEach((el) => { el.style.display = 'none'; });
  }

  /* ============================================================
     CLOCK — Asia/Kolkata
     ============================================================ */
  function updateClock() {
    let time = '--:--';
    try {
      time = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date());
    } catch (e) { /* fallback */ }

    setText('heroClock', time);
    setText('contactTime', time);
    setText('localTime', `India — ${time} IST`);
  }

  updateClock();
  window.setInterval(updateClock, 20000);

  /* ============================================================
     HERO GARDEN — a stippled pixel-art cypress tree
     Inspired by natochi.cv: Bayer-matrix dithering, tiered Niwaki
     cloud lobes, horizontal twig leader lines with perched birds,
     crisp pixel wildflowers & grass, and interactive floating sparks.
     ============================================================ */
  function initHeroGarden() {
    const canvas = $('gardenCanvas');
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hero = $('hero');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let offscreen = null;
    let offctx = null;
    let fireflies = [];
    let stars = [];
    let frameId = 0;
    let running = false;
    let started = 0;
    let resizeRaf = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    // Dynamic branch anchor points for CSS tree notes
    const tipAnchors = { a: null, b: null, c: null };

    function makeRandom(seed) {
      let state = seed;
      return function random() {
        state |= 0;
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function build() {
      if (!offctx) return;

      const random = makeRandom(0x42f09a);
      const isMobile = width < 680;
      const isTablet = width >= 680 && width < 1140;
      const scale = isMobile
        ? Math.min(1.1, Math.max(0.88, width / 360))
        : isTablet ? 0.92 : 1.15;
      const P = isMobile ? 2 : 2.5; // pixel unit

      const groundY = Math.round(height * 0.94);
      const rootX = Math.round(width * 0.50);
      // Keep tree and greeting positions proportional to the hero on every screen.
      const treeH = Math.round(height * (isMobile ? 0.76 : 0.68));
      const topY = groundY - treeH;
      const greeting = document.querySelector('.hero-greeting');
      if (greeting) {
        const greetingTop = topY - height * (isMobile ? 0.06 : 0.08);
        greeting.style.top = `${greetingTop}px`;
      }

      // Color palette (Dark Obsidian & Moss Emerald)
      const trunkColor = '#0d2217';
      const barkColor = '#1a3e29';
      const coreColor = '#153c27'; // dense pine core (rich, solid)
      const midColor = '#2a6341';  // rich foliage body
      const leafColor = '#468e60'; // vibrant moss
      const highlightColor = '#81c69a'; // luminous mint edges
      const sparkColor = '#d9855b'; // warm copper embers
      const creamColor = '#efeade'; // wildflower florets
      const groundColor = '#244834';
      const starColor = '#86c49c';

      offctx.clearRect(0, 0, width, height);

      // Pixel moon and distant woodland give the garden depth without crowding the tree.
      const moonX = Math.round(width * 0.82 / P) * P;
      const moonY = height * 0.16;
      const moonR = Math.min(width * 0.035, 24);
      for (let my = -moonR; my <= moonR; my += P) {
        for (let mx = -moonR; mx <= moonR; mx += P) {
          if (mx * mx + my * my > moonR * moonR) continue;
          const shadow = (mx - moonR * 0.5) ** 2 + (my + moonR * 0.28) ** 2 < moonR ** 2;
          offctx.fillStyle = shadow ? '#0c1915' : (random() > 0.3 ? '#728d78' : '#a8b497');
          offctx.fillRect(moonX + mx, moonY + my, P, P);
        }
      }
      // Layered silhouettes are concentrated at the edges to frame the central canopy.
      for (let layer = 0; layer < 2; layer += 1) {
        for (let n = 0; n < 18; n += 1) {
          const x = width * n / 17;
          const edge = Math.abs(x / width - 0.5) * 2;
          const h = height * (0.04 + edge * 0.15) * (0.7 + random() * 0.3);
          offctx.fillStyle = layer ? '#10251b' : '#0c1b15';
          for (let y = 0; y < h; y += P * 2) {
            const spread = (y / h) * h * 0.23;
            offctx.fillRect(Math.round((x - spread) / P) * P, groundY - h + y, spread * 2 + P, P * 2);
          }
        }
      }

      // 1. Sky stars / dust specks
      stars = [];
      const starCount = isMobile ? 35 : 70;
      for (let i = 0; i < starCount; i += 1) {
        const sx = Math.round(random() * width);
        const sy = Math.round(random() * (groundY - 30));
        const sz = random() < 0.2 ? P : P * 0.6;
        const alpha = 0.08 + random() * 0.35;
        stars.push({ x: sx, y: sy, size: sz, alpha, phase: random() * Math.PI * 2 });
        offctx.fillStyle = rgba(starColor, alpha);
        offctx.fillRect(sx, sy, sz, sz);
      }

      // 2. Trunk function
      function getTrunkX(y) {
        const prog = (groundY - y) / treeH;
        return rootX + Math.sin(prog * Math.PI * 2.2) * 5 * scale - prog * 10 * scale;
      }

      // 3. Cloud foliage tiers (Natochi-inspired columnar pine/cypress)
      const tiers = [
        // Low tier:
        { t: 0.22, dx: -36 * scale, rx: 44 * scale, ry: 24 * scale, d: 0.94 },
        { t: 0.32, dx:  40 * scale, rx: 48 * scale, ry: 26 * scale, d: 0.95 },
        // Mid tier (widest and densest):
        { t: 0.44, dx: -52 * scale, rx: 58 * scale, ry: 30 * scale, d: 1.00 },
        { t: 0.54, dx:  48 * scale, rx: 54 * scale, ry: 28 * scale, d: 1.00 },
        { t: 0.65, dx: -42 * scale, rx: 48 * scale, ry: 26 * scale, d: 0.96 },
        // Upper tier:
        { t: 0.75, dx:  36 * scale, rx: 40 * scale, ry: 24 * scale, d: 0.94 },
        { t: 0.84, dx: -26 * scale, rx: 32 * scale, ry: 22 * scale, d: 0.90 },
        // Crown apex:
        { t: 0.92, dx:  -4 * scale, rx: 24 * scale, ry: 24 * scale, d: 0.95 },
        { t: 0.97, dx:   0,         rx: 15 * scale, ry: 18 * scale, d: 0.88 },
        // Satellite organic clusters for texture:
        { t: 0.27, dx: -18 * scale, rx: 26 * scale, ry: 16 * scale, d: 0.85 },
        { t: 0.38, dx:  22 * scale, rx: 28 * scale, ry: 18 * scale, d: 0.85 },
        { t: 0.49, dx: -24 * scale, rx: 32 * scale, ry: 20 * scale, d: 0.88 },
        { t: 0.59, dx:  24 * scale, rx: 30 * scale, ry: 18 * scale, d: 0.88 },
        { t: 0.71, dx: -18 * scale, rx: 26 * scale, ry: 16 * scale, d: 0.85 },
        { t: 0.81, dx:  16 * scale, rx: 22 * scale, ry: 14 * scale, d: 0.82 },
      ];

      // Calculate actual positions
      for (const tier of tiers) {
        tier.actualY = groundY - tier.t * treeH;
        tier.actualX = getTrunkX(tier.actualY) + tier.dx;
      }

      // 4. Draw central trunk & primary boughs
      for (let y = groundY; y >= topY + 40; y -= P) {
        const prog = (groundY - y) / treeH;
        const tx = getTrunkX(y);
        const trunkHalfW = Math.max(P * 0.8, (1 - prog * 0.78) * 8 * scale);
        for (let x = tx - trunkHalfW; x <= tx + trunkHalfW; x += P) {
          const isEdge = x <= tx - trunkHalfW + P || x >= tx + trunkHalfW - P;
          offctx.fillStyle = isEdge ? trunkColor : barkColor;
          offctx.fillRect(Math.round(x), Math.round(y), P, P);
        }
      }

      // 5. Draw branch connections into each lobe
      for (const tier of tiers) {
        const startY = tier.actualY + 6 * scale;
        const startX = getTrunkX(startY);
        const steps = 8;
        for (let s = 0; s <= steps; s += 1) {
          const frac = s / steps;
          const bx = startX + (tier.actualX - startX) * frac;
          const by = startY + (tier.actualY - startY) * frac;
          offctx.fillStyle = barkColor;
          offctx.fillRect(Math.round(bx), Math.round(by), P * 1.2, P * 1.2);
        }
      }

      // 6. 4x4 Bayer matrix dithering over foliage region
      const bayer4 = [
        [ 0,  8,  2, 10],
        [12,  4, 14,  6],
        [ 3, 11,  1,  9],
        [15,  7, 13,  5]
      ];

      const minX = Math.floor((rootX - 110 * scale) / P) * P;
      const maxX = Math.ceil((rootX + 110 * scale) / P) * P;
      const minY = Math.floor((topY - 10) / P) * P;
      const maxY = Math.ceil((groundY - treeH * 0.16) / P) * P;

      for (let y = minY; y <= maxY; y += P) {
        for (let x = minX; x <= maxX; x += P) {
          let density = 0;
          for (let i = 0; i < tiers.length; i += 1) {
            const t = tiers[i];
            const qx = (x - t.actualX) / t.rx;
            const qy = (y - t.actualY) / t.ry;
            const d2 = qx * qx + qy * qy;
            if (d2 < 1.32) {
              const inf = Math.max(0, 1 - d2 * 0.76) * t.d;
              if (inf > density) density = inf;
            }
          }
          if (density <= 0.05) continue;

          // Subtle organic turbulence
          const noise = (Math.sin(x * 0.28) * Math.cos(y * 0.28) + Math.sin(x * 0.49 + y * 0.41)) * 0.08;
          const dVal = Math.min(1, Math.max(0, density + noise));

          const bx = Math.abs(Math.floor(x / P)) % 4;
          const by = Math.abs(Math.floor(y / P)) % 4;
          const threshold = bayer4[by][bx] / 16;

          if (dVal > 0.44) {
            // Solid dense core & body
            const col = dVal > 0.74 ? coreColor : dVal > 0.56 ? midColor : leafColor;
            offctx.fillStyle = col;
            offctx.fillRect(x, y, P, P);
          } else if (dVal > threshold && dVal > 0.08) {
            // Feathered dithered stipple fringe
            let col = dVal > 0.26 ? leafColor : highlightColor;
            if (dVal < 0.28 && ((Math.floor(x / P) * 17 + Math.floor(y / P) * 11) % 19 === 0)) {
              col = sparkColor;
            }
            offctx.fillStyle = col;
            offctx.fillRect(x, y, P, P);
          }
        }
      }

      // 7. Horizontal Branch Leader Lines to Annotations (with perched birds & crosshairs)
      function drawPixelDiamond(cx, cy, color, size = P) {
        offctx.fillStyle = color;
        offctx.fillRect(cx, cy - size, size, size);
        offctx.fillRect(cx - size, cy, size * 3, size);
        offctx.fillRect(cx, cy + size, size, size);
      }

      function drawPixelBird(bx, by, facing = 1) {
        // 5x3 pixel perched bird
        offctx.fillStyle = creamColor;
        offctx.fillRect(bx, by - P * 2, P * 2, P); // head
        offctx.fillStyle = highlightColor;
        offctx.fillRect(bx - P * facing, by - P, P * 3, P); // body
        offctx.fillStyle = sparkColor;
        offctx.fillRect(bx + (facing > 0 ? P * 2 : -P * 2), by - P * 2, P, P); // beak
        offctx.fillStyle = trunkColor;
        offctx.fillRect(bx - P * 2 * facing, by, P, P); // tail
      }

      // Branch A -> 01 Background (Upper left)
      const yA = Math.round(groundY - treeH * 0.75);
      const startAx = Math.round(getTrunkX(yA) - 28 * scale);
      const tipAx = Math.round(getTrunkX(yA) - (isMobile ? 70 : 110) * scale);
      offctx.fillStyle = barkColor;
      offctx.fillRect(tipAx, yA, startAx - tipAx, P);
      // Small upright twig spur
      offctx.fillRect(tipAx + 24 * scale, yA - 6 * scale, P, 6 * scale);
      drawPixelDiamond(tipAx, yA, sparkColor, P);
      if (!isMobile) drawPixelBird(tipAx + 24 * scale, yA - 6 * scale, 1);
      tipAnchors.a = { x: tipAx, y: yA };

      // Branch B -> 02 Arcade (Middle right)
      const yB = Math.round(groundY - treeH * 0.55);
      const startBx = Math.round(getTrunkX(yB) + 32 * scale);
      const tipBx = Math.round(getTrunkX(yB) + (isMobile ? 72 : 115) * scale);
      offctx.fillStyle = barkColor;
      offctx.fillRect(startBx, yB, tipBx - startBx, P);
      offctx.fillRect(tipBx - 22 * scale, yB - 6 * scale, P, 6 * scale);
      drawPixelDiamond(tipBx, yB, sparkColor, P);
      if (!isMobile) drawPixelBird(tipBx - 22 * scale, yB - 6 * scale, -1);
      tipAnchors.b = { x: tipBx, y: yB };

      // Branch C -> 03 Contact (Lower mid left)
      const yC = Math.round(groundY - treeH * 0.28);
      const startCx = Math.round(getTrunkX(yC) - 34 * scale);
      const tipCx = Math.round(getTrunkX(yC) - (isMobile ? 68 : 100) * scale);
      offctx.fillStyle = barkColor;
      offctx.fillRect(tipCx, yC, startCx - tipCx, P);
      offctx.fillRect(tipCx + 18 * scale, yC - 5 * scale, P, 5 * scale);
      drawPixelDiamond(tipCx, yC, sparkColor, P);
      tipAnchors.c = { x: tipCx, y: yC };

      // Keep section links anchored to the branch tips at every viewport size.
      const noteA = document.querySelector('.tree-note--a');
      const noteB = document.querySelector('.tree-note--b');
      const noteC = document.querySelector('.tree-note--c');
      if (noteA && tipAnchors.a) {
        noteA.style.top = `${tipAnchors.a.y - 12}px`;
        noteA.style.left = 'auto';
        noteA.style.right = `${width - tipAnchors.a.x + 12}px`;
      }
      if (noteB && tipAnchors.b) {
        noteB.style.top = `${tipAnchors.b.y - 12}px`;
        noteB.style.left = `${tipAnchors.b.x + 12}px`;
        noteB.style.right = 'auto';
      }
      if (noteC && tipAnchors.c) {
        noteC.style.top = `${tipAnchors.c.y - 12}px`;
        noteC.style.left = 'auto';
        noteC.style.right = `${width - tipAnchors.c.x + 12}px`;
      }

      // 8. Ground plane, soil roots & wildflowers
      offctx.fillStyle = rgba(groundColor, 0.45);
      offctx.fillRect(0, groundY, width, 1);

      // Root tendrils below ground line
      for (let r = 0; r < 5; r += 1) {
        const rx = rootX - 24 * scale + r * 12 * scale;
        const rLen = 10 + random() * 18 * scale;
        const rLean = (random() - 0.5) * 16 * scale;
        for (let ry = 0; ry <= rLen; ry += P) {
          const frac = ry / rLen;
          offctx.fillStyle = rgba(barkColor, 0.65 - frac * 0.4);
          offctx.fillRect(rx + rLean * frac, groundY + ry, P, P);
        }
      }

      // Dense grass blades along ground
      const bladeCount = Math.round(width / 4.8);
      for (let i = 0; i < bladeCount; i += 1) {
        const gx = random() * width;
        const gLen = 6 + Math.pow(random(), 1.6) * (isMobile ? 26 : 38);
        const gLean = (random() - 0.5) * 16;
        const col = random() < 0.6 ? midColor : leafColor;
        for (let gy = 0; gy <= gLen; gy += P) {
          const frac = gy / gLen;
          offctx.fillStyle = rgba(col, 0.25 + random() * 0.45);
          offctx.fillRect(gx + gLean * frac, groundY - gy, P, P);
        }
      }

      // Tall pixel wildflowers (Natochi style)
      const flowerCount = isMobile ? 8 : 16;
      for (let f = 0; f < flowerCount; f += 1) {
        const fx = (f / flowerCount) * width + (random() - 0.5) * (width / flowerCount) * 0.8;
        const fHeight = 26 + random() * (isMobile ? 28 : 46);
        const fLean = (random() - 0.5) * 10;
        // Stalk
        for (let sy = 0; sy <= fHeight; sy += P) {
          const frac = sy / fHeight;
          offctx.fillStyle = rgba(leafColor, 0.65);
          offctx.fillRect(fx + fLean * frac, groundY - sy, P, P);
        }
        // Flower blossom head
        const headX = fx + fLean;
        const headY = groundY - fHeight;
        const flowerType = f % 3;
        if (flowerType === 0) {
          // 5-pixel bell flower
          offctx.fillStyle = sparkColor;
          offctx.fillRect(headX, headY - P * 2, P, P);
          offctx.fillRect(headX - P, headY - P, P * 3, P);
          offctx.fillRect(headX - P, headY, P, P);
          offctx.fillRect(headX + P, headY, P, P);
        } else if (flowerType === 1) {
          // 3-pixel starry floret
          offctx.fillStyle = creamColor;
          offctx.fillRect(headX, headY - P, P, P);
          offctx.fillRect(headX - P, headY, P * 3, P);
          offctx.fillRect(headX, headY + P, P, P);
        } else {
          // Wheat / grain head
          offctx.fillStyle = highlightColor;
          for (let k = 0; k < 4; k += 1) {
            const side = k % 2 === 0 ? -P : P;
            offctx.fillRect(headX + side, headY + k * P, P, P);
          }
        }
      }

      // 9. Floating animated fireflies / sparks
      fireflies = Array.from({ length: isMobile ? 14 : 26 }, () => ({
        x: rootX + (random() - 0.5) * (treeH * 0.7),
        y: groundY - random() * (treeH * 0.95),
        baseX: 0,
        vx: 0,
        vy: -0.35 - random() * 0.55,
        r: P * (0.8 + random() * 0.7),
        phase: random() * Math.PI * 2,
        swaySpeed: 0.8 + random() * 1.2,
        swayAmp: 12 + random() * 24,
        warm: random() < 0.45,
      }));
      for (const fly of fireflies) {
        fly.baseX = fly.x;
      }
    }

    function paint(now, animate) {
      if (!offctx) return;
      const t = animate ? (now - started) / 1000 : 0;

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Subtle organic sway on offscreen canvas
      const sway = Math.sin(t * 0.35) * 0.0018 + (pointer.active ? pointer.x * 0.003 : 0);
      ctx.save();
      ctx.translate(width * 0.5, height * 0.94);
      ctx.rotate(sway);
      ctx.translate(-width * 0.5, -height * 0.94);
      ctx.drawImage(offscreen, 0, 0, width, height);
      ctx.restore();

      // Render floating pixel fireflies with cursor reactivity
      const P = width < 680 ? 2 : 2.5;
      for (const fly of fireflies) {
        // Vertical upward drift with wrapping
        fly.y += fly.vy;
        if (fly.y < height * 0.06) {
          fly.y = height * 0.92;
        }

        // Horizontal sinusoidal sway
        const swayX = Math.sin(t * fly.swaySpeed + fly.phase) * fly.swayAmp;
        let curX = fly.baseX + swayX;
        let curY = fly.y;

        // Mouse pointer gentle repulsion
        if (pointer.active) {
          const dx = curX - (pointer.tx * width * 0.5 + width * 0.5);
          const dy = curY - (pointer.ty * height * 0.5 + height * 0.5);
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 18000 && dist2 > 1) {
            const dist = Math.sqrt(dist2);
            const force = (1 - dist / 134) * 22;
            curX += (dx / dist) * force;
            curY += (dy / dist) * force;
          }
        }

        const alpha = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.2 + fly.phase));
        const tone = fly.warm ? '#d9855b' : '#81c69a';

        // Pixel diamond spark
        ctx.fillStyle = rgba(tone, alpha * 0.25);
        ctx.fillRect(curX - P * 2, curY - P * 2, P * 5, P * 5);

        ctx.fillStyle = rgba(tone, alpha);
        ctx.fillRect(curX, curY - P, P, P);
        ctx.fillRect(curX - P, curY, P * 3, P);
        ctx.fillRect(curX, curY + P, P, P);
      }
    }

    function loop(now) {
      if (!running) return;
      paint(now, true);
      frameId = window.requestAnimationFrame(loop);
    }

    function start() {
      if (running || !visible()) return;
      running = true;
      started = performance.now();
      frameId = window.requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function visible() {
      if (!hero) return true;
      const rect = hero.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    function measure() {
      const rect = stage.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(420, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!offscreen) offscreen = document.createElement('canvas');
      offscreen.width = Math.round(width * dpr);
      offscreen.height = Math.round(height * dpr);
      offctx = offscreen.getContext('2d');
      offctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      build();
      paint(performance.now(), false);
      start();
    }

    redrawGarden = () => {
      if (!offctx) return;
      build();
      if (!running) paint(performance.now(), false);
    };

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(() => {
        window.cancelAnimationFrame(resizeRaf);
        resizeRaf = window.requestAnimationFrame(measure);
      });
      observer.observe(stage);
    } else {
      window.addEventListener('resize', measure);
    }

    hero?.addEventListener('pointermove', (event) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
      pointer.active = true;
    }, { passive: true });

    hero?.addEventListener('pointerleave', () => {
      pointer.tx = 0;
      pointer.ty = 0;
      pointer.active = false;
    });

    if ('IntersectionObserver' in window && hero) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      }, { threshold: 0.01 }).observe(hero);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    measure();
  }

  initHeroGarden();


  /* ============================================================
     EXPANDABLE ENTRIES (smooth details drawers)
     ============================================================ */
  function enhanceDetails() {
    $$('details.entry').forEach((details) => {
      const summary = details.querySelector('.entry-summary');
      const body = details.querySelector('.entry-body');
      if (!summary || !body) return;

      summary.addEventListener('click', (event) => {
        event.preventDefault();

        if (prefersReduced) {
          details.open = !details.open;
          return;
        }

        const willOpen = !details.open;
        let finished = false;

        const finish = () => {
          if (finished) return;
          finished = true;
          body.removeEventListener('transitionend', onTransitionEnd);
          body.style.height = '';
          if (!willOpen) details.open = false;
        };

        const onTransitionEnd = (transitionEvent) => {
          if (transitionEvent.target === body && transitionEvent.propertyName === 'height') finish();
        };

        body.addEventListener('transitionend', onTransitionEnd);
        window.setTimeout(finish, 650);

        if (willOpen) {
          details.open = true;
          body.style.height = '0px';
          window.requestAnimationFrame(() => {
            body.style.height = `${body.scrollHeight}px`;
          });
        } else {
          body.style.height = `${body.scrollHeight}px`;
          window.requestAnimationFrame(() => {
            body.style.height = '0px';
          });
        }
      });
    });
  }

  enhanceDetails();

  /* ============================================================
     REVEAL ON SCROLL
     ============================================================ */
  function initReveal() {
    const revealElements = $$('.reveal');

    if ('IntersectionObserver' in window && !prefersReduced) {
      const observer = new IntersectionObserver((entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          instance.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px' });

      revealElements.forEach((el) => observer.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('in'));
    }
  }

  initReveal();

  /* ============================================================
     SCROLL UI
     ============================================================ */
  const scrollProgress = $('scrollProgress');
  const backToTop = $('backToTop');
  const heroField = document.querySelector('.hero-field');
  const treeNotes = document.querySelector('.tree-notes');
  let scrollTicking = false;

  function onScroll() {
    const top = window.scrollY || root.scrollTop;
    const max = root.scrollHeight - root.clientHeight;

    if (scrollProgress) scrollProgress.style.width = `${max > 0 ? (top / max) * 100 : 0}%`;
    nav?.classList.toggle('scrolled', top > 10);
    backToTop?.classList.toggle('show', top > 600);

    // Parallax & smooth fade on hero art
    if (heroField && !prefersReduced && top < 1200) {
      const pY = (top * 0.22).toFixed(1);
      heroField.style.transform = `translate3d(0, ${pY}px, 0)`;
      heroField.style.opacity = Math.max(0, 1 - top / 750);
      if (treeNotes) {
        treeNotes.style.transform = `translate3d(0, ${pY}px, 0)`;
        treeNotes.style.opacity = Math.max(0, 1 - top / 600);
      }
    }

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  const footerEl = $('contact');
  if (footerEl && backToTop && 'IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => backToTop.classList.toggle('at-footer', entry.isIntersecting),
      { rootMargin: '0px 0px -48px 0px' }
    ).observe(footerEl);
  }

  /* ---------- active section ---------- */
  const sections = $$('main section[id], footer[id]');
  const navAnchors = $$('#navLinks a');

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const hash = `#${entry.target.id}`;
        navAnchors.forEach((anchor) => {
          const active = anchor.getAttribute('href') === hash;
          anchor.classList.toggle('active', active);
          if (active) anchor.setAttribute('aria-current', 'true');
          else anchor.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

    sections.forEach((section) => spy.observe(section));
  }

  /* ============================================================
     PALETTE HELPERS (for canvas work)
     ============================================================ */
  function cssValue(property) {
    return getComputedStyle(gameStage || root).getPropertyValue(property).trim();
  }

  function palette() {
    return {
      canvas: cssValue('--canvas') || '#f5f1e6',
      surface: cssValue('--surface') || '#ece6d7',
      ink: cssValue('--ink') || '#17241c',
      muted: cssValue('--muted') || '#5c6b5e',
      line: cssValue('--line') || 'rgba(23, 36, 28, 0.12)',
      accent: cssValue('--accent') || '#5c7a52',
      rust: cssValue('--rust') || '#bc6845',
    };
  }

  function rgba(hex, alpha) {
    const value = String(hex).trim();
    if (!value) return `rgba(23, 23, 22, ${alpha})`;
    if (value.startsWith('rgb')) return value;
    let clean = value.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
    const number = Number.parseInt(clean, 16);
    if (Number.isNaN(number)) return `rgba(23, 23, 22, ${alpha})`;
    const r = (number >> 16) & 255;
    const g = (number >> 8) & 255;
    const b = number & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /* ============================================================
     ARCADE — shell
     ============================================================ */
  const gameTabs = $('gameTabs');
  const gameStage = $('gameStage');
  const arcadeStatus = $('arcadeStatus');
  const games = [
    { id: 'snake', name: 'Snake' },
    { id: 'memory', name: 'Memory' },
    { id: 'mlp', name: 'Tiny MLP', lab: true },
    { id: 'ttt', name: 'Tic-tac-toe' },
    { id: 'reaction', name: 'Reaction' },
    { id: 'neuron', name: 'Neuron lab', lab: true },
    { id: 'rps', name: 'RPS' },
    { id: 'guess', name: 'Guess' },
  ];

  let activeGame = null;
  let snakeCleanup = null;

  if (gameTabs) {
    games.forEach((game, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'game-tab';
      button.dataset.id = game.id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', 'false');
      button.setAttribute('aria-controls', 'gameStage');
      button.innerHTML = `<span class="tab-index">${pad(index + 1)}</span><span>${esc(game.name)}</span>`;
      button.addEventListener('click', () => loadGame(game.id));
      gameTabs.appendChild(button);
    });
  }

  function loadGame(id) {
    const entry = games.find((game) => game.id === id);
    if (!entry || !gameStage) return;
    const isLab = Boolean(entry.lab);

    if (snakeCleanup) {
      snakeCleanup();
      snakeCleanup = null;
    }

    $$('.game-tab', gameTabs || document).forEach((tab) => {
      const selected = tab.dataset.id === id;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });

    gameStage.innerHTML = '';
    gameStage.classList.toggle('is-lab', isLab);
    gameStage.setAttribute('aria-label', isLab ? (entry.name || '') : `${entry.name || ''} game`);
    activeGame = id;
    currentRedraw = () => {};

    if (arcadeStatus) arcadeStatus.textContent = `${isLab ? 'Lab' : 'Game'} · ${entry.name}`;

    if (id === 'neuron') initNeuronLab();
    else if (id === 'mlp') initMLPLab();
    else if (id === 'snake') initSnake();
    else if (id === 'memory') initMemory();
    else if (id === 'ttt') initTTT();
    else if (id === 'reaction') initReaction();
    else if (id === 'rps') initRPS();
    else if (id === 'guess') initGuess();
  }

  /* ============================================================
     CANVAS HELPERS
     ============================================================ */
  function prepareCanvas(canvas) {
    if (!canvas.dataset.ratio) {
      const width = Number(canvas.getAttribute('width')) || 420;
      const height = Number(canvas.getAttribute('height')) || 260;
      canvas.dataset.ratio = String(width / height);
    }

    const ratio = Number(canvas.dataset.ratio);
    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width || 420;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.round(cssWidth * dpr);
    const pixelHeight = Math.round((cssWidth / ratio) * dpr);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }

    const context = canvas.getContext('2d');
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: context, width: cssWidth, height: cssWidth / ratio };
  }

  function bindSlider(id, valueId, callback) {
    const input = $(id);
    const output = $(valueId);
    if (!input) return;

    const sync = () => {
      if (output) output.textContent = Number(input.value).toFixed(1);
      callback();
    };

    input.addEventListener('input', sync);
    sync();
  }

  /* ============================================================
     LAB 01 — SINGLE NEURON
     ============================================================ */
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  function drawNeuron() {
    const canvas = $('neuronCanvas');
    if (!canvas) return;
    const { ctx, width: W, height: H } = prepareCanvas(canvas);
    const p = palette();

    ctx.clearRect(0, 0, W, H);

    // quiet graph paper
    ctx.strokeStyle = p.line;
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i += 1) {
      const y = (H * i) / 4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    for (let i = 1; i < 4; i += 1) {
      const x = (W * i) / 4;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    const x = Number($('nX')?.value ?? 1.2);
    const w = Number($('nW')?.value ?? 1);
    const b = Number($('nB')?.value ?? 0);
    const z = w * x + b;
    const out = sigmoid(z);

    setText('nZ', z.toFixed(2));
    setText('nOut', out.toFixed(3));

    // sigmoid curve
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 1.75;
    ctx.beginPath();
    for (let i = 0; i <= W; i += 1) {
      const xx = (i / W) * 6 - 3;
      const yy = sigmoid(xx);
      const px = i;
      const py = H - yy * H * 0.78 - H * 0.11;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // baseline
    ctx.strokeStyle = rgba(p.ink, 0.2);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    // current point
    const px = Math.min(W, Math.max(0, ((z + 3) / 6) * W));
    const py = H - out * H * 0.78 - H * 0.11;
    ctx.fillStyle = p.accent;
    ctx.strokeStyle = p.canvas;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = p.ink;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`z = ${z.toFixed(2)}`, Math.min(W - 64, Math.max(8, px + 9)), Math.max(14, py - 9));
  }

  function initNeuronLab() {
    if (!gameStage) return;
    gameStage.innerHTML = `
      <div class="lab-panel">
        <div class="lab-head">
          <div>
            <span class="lab-tag">Lab 01</span>
            <h3>Single neuron</h3>
          </div>
          <span class="live-tag"><i aria-hidden="true"></i>Live</span>
        </div>
        <div class="lab-body">
          <div class="canvas-wrap">
            <canvas id="neuronCanvas" width="420" height="260" aria-label="Sigmoid activation plot of a single neuron"></canvas>
          </div>
          <div class="controls controls--three">
            <label class="ctl">
              <span class="ctl-name">Input · x</span>
              <span class="ctl-val" id="nXv">1.2</span>
              <input type="range" id="nX" min="-3" max="3" step="0.1" value="1.2" aria-label="Input x" />
            </label>
            <label class="ctl">
              <span class="ctl-name">Weight · w</span>
              <span class="ctl-val" id="nWv">1.0</span>
              <input type="range" id="nW" min="-3" max="3" step="0.1" value="1.0" aria-label="Weight w" />
            </label>
            <label class="ctl">
              <span class="ctl-name">Bias · b</span>
              <span class="ctl-val" id="nBv">0.0</span>
              <input type="range" id="nB" min="-3" max="3" step="0.1" value="0.0" aria-label="Bias b" />
            </label>
            <div class="readout">
              <div><span>z = w·x + b</span><b id="nZ">0.00</b></div>
              <div><span>σ(z)</span><b id="nOut">0.00</b></div>
            </div>
          </div>
        </div>
      </div>`;

    currentRedraw = drawNeuron;
    bindSlider('nX', 'nXv', drawNeuron);
    bindSlider('nW', 'nWv', drawNeuron);
    bindSlider('nB', 'nBv', drawNeuron);
    drawNeuron();
  }

  /* ============================================================
     LAB 02 — TINY MLP
     ============================================================ */
  let weights = null;

  function initWeights() {
    weights = {
      w1: Array.from({ length: 3 }, () => Array.from({ length: 2 }, () => Math.random() * 2 - 1)),
      b1: Array.from({ length: 3 }, () => Math.random() * 2 - 1),
      w2: Array.from({ length: 3 }, () => Math.random() * 2 - 1),
      b2: Math.random() * 2 - 1,
    };
  }

  function mlpForward(x1, x2) {
    const hidden = weights.w1.map((row, i) => sigmoid(row[0] * x1 + row[1] * x2 + weights.b1[i]));
    const z = weights.w2.reduce((sum, weight, i) => sum + weight * hidden[i], 0) + weights.b2;
    return { hidden, out: sigmoid(z) };
  }

  function drawMLP() {
    const canvas = $('mlpCanvas');
    if (!canvas || !weights) return;
    const { ctx, width: W, height: H } = prepareCanvas(canvas);
    const p = palette();

    ctx.clearRect(0, 0, W, H);

    const x1 = Number($('mX1')?.value ?? 0.8);
    const x2 = Number($('mX2')?.value ?? -0.4);
    setText('mX1v', x1.toFixed(1));
    setText('mX2v', x2.toFixed(1));

    const { hidden, out } = mlpForward(x1, x2);
    setText('mH', hidden.map((value) => value.toFixed(2)).join(', '));
    setText('mOut', out.toFixed(3));

    const leftX = 44;
    const midX = W / 2;
    const rightX = W - 44;
    const inputY = [H * 0.3, H * 0.7];
    const hiddenY = [H * 0.2, H * 0.5, H * 0.8];
    const outputY = H / 2;

    const edgeColor = (weight) => (
      weight > 0
        ? rgba(p.accent, Math.min(0.85, Math.abs(weight) / 2))
        : rgba(p.rust, Math.min(0.85, Math.abs(weight) / 2))
    );

    for (let i = 0; i < 2; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        const weight = weights.w1[j][i];
        ctx.strokeStyle = edgeColor(weight);
        ctx.lineWidth = Math.min(2.5, Math.abs(weight) + 0.5);
        ctx.beginPath();
        ctx.moveTo(leftX, inputY[i]);
        ctx.lineTo(midX, hiddenY[j]);
        ctx.stroke();
      }
    }

    for (let j = 0; j < 3; j += 1) {
      const weight = weights.w2[j];
      ctx.strokeStyle = edgeColor(weight);
      ctx.lineWidth = Math.min(2.5, Math.abs(weight) + 0.5);
      ctx.beginPath();
      ctx.moveTo(midX, hiddenY[j]);
      ctx.lineTo(rightX, outputY);
      ctx.stroke();
    }

    function drawNode(x, y, value, fill, stroke, textColor) {
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = textColor;
      ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(value.toFixed(2), x, y + 3.5);
      ctx.textAlign = 'left';
    }

    drawNode(leftX, inputY[0], x1, rgba(p.rust, 0.12), p.rust, p.ink);
    drawNode(leftX, inputY[1], x2, rgba(p.rust, 0.12), p.rust, p.ink);
    hiddenY.forEach((y, j) => drawNode(midX, y, hidden[j], p.surface, p.line, p.ink));
    drawNode(rightX, outputY, out, rgba(p.accent, 0.16), p.accent, p.ink);
  }

  function initMLPLab() {
    if (!gameStage) return;
    gameStage.innerHTML = `
      <div class="lab-panel">
        <div class="lab-head">
          <div>
            <span class="lab-tag">Lab 02</span>
            <h3>Tiny MLP <span>2-3-1</span></h3>
          </div>
          <span class="live-tag"><i aria-hidden="true"></i>Live</span>
        </div>
        <div class="lab-body">
          <div class="canvas-wrap">
            <canvas id="mlpCanvas" width="420" height="260" aria-label="A two input, three hidden node, one output neural network diagram"></canvas>
          </div>
          <div class="controls controls--pair">
            <label class="ctl">
              <span class="ctl-name">Input · x₁</span>
              <span class="ctl-val" id="mX1v">0.8</span>
              <input type="range" id="mX1" min="-2" max="2" step="0.1" value="0.8" aria-label="Input x one" />
            </label>
            <label class="ctl">
              <span class="ctl-name">Input · x₂</span>
              <span class="ctl-val" id="mX2v">-0.4</span>
              <input type="range" id="mX2" min="-2" max="2" step="0.1" value="-0.4" aria-label="Input x two" />
            </label>
            <div class="readout">
              <div><span>Hidden</span><b id="mH">—</b></div>
              <div><span>σ(·)</span><b id="mOut">0.00</b></div>
            </div>
            <button class="game-btn" id="randomizeWeights" type="button">Randomize weights <span aria-hidden="true">↻</span></button>
          </div>
        </div>
      </div>`;

    if (!weights) initWeights();
    currentRedraw = drawMLP;
    bindSlider('mX1', 'mX1v', drawMLP);
    bindSlider('mX2', 'mX2v', drawMLP);

    $('randomizeWeights')?.addEventListener('click', () => {
      initWeights();
      drawMLP();
    });

    drawMLP();
  }

  /* ============================================================
     GAME — SNAKE
     ============================================================ */
  let snakeKeyHandler = null;

  function initSnake() {
    if (!gameStage) return;
    gameStage.innerHTML = `
      <h3>Snake</h3>
      <p class="game-info">Arrow keys or WASD on desktop. Swipe or use the D-pad on mobile.</p>
      <div class="game-row">
        <span class="snake-score">Score: <span id="snakeScore">0</span></span>
        <span class="snake-score">Best: <span id="snakeBest">0</span></span>
        <button class="game-btn primary" id="snakeStart" type="button">Start / restart</button>
      </div>
      <canvas id="snakeCanvas" class="game-canvas" width="360" height="360" aria-label="Snake game board"></canvas>
      <div class="dpad" id="snakeDpad">
        <div></div><button class="dpad-btn" type="button" data-dir="up" aria-label="Up">▲</button><div></div>
        <button class="dpad-btn" type="button" data-dir="left" aria-label="Left">◀</button><div></div><button class="dpad-btn" type="button" data-dir="right" aria-label="Right">▶</button>
        <div></div><button class="dpad-btn" type="button" data-dir="down" aria-label="Down">▼</button><div></div>
      </div>`;

    const canvas = $('snakeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const grid = 18;
    const stepDuration = 65;
    const cols = canvas.width / grid;
    const rows = canvas.height / grid;
    let snake;
    let direction;
    let pendingDirection = null;
    let food;
    let score;
    let best = 0;
    try { best = Number(window.localStorage.getItem('snakeBest')) || 0; } catch (_) { /* Storage may be unavailable. */ }
    let loop;
    let animationFrame;
    let previousSnake = [];
    let lastStepAt = 0;
    let running = false;
    let over = false;

    function reset() {
      snake = [{ x: 10, y: 10 }];
      direction = { x: 1, y: 0 };
      pendingDirection = null;
      score = 0;
      over = false;
      placeFood();
      updateScore();
    }

    function placeFood() {
      do {
        food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
      } while (snake.some((part) => part.x === food.x && part.y === food.y));
    }

    function updateScore() {
      setText('snakeScore', score);
      setText('snakeBest', best);
    }

    function draw(now = performance.now()) {
      const p = palette();
      ctx.fillStyle = '#101416';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          ctx.fillStyle = (row + col) % 2 ? '#151a1d' : '#12171a';
          ctx.fillRect(col * grid + 1, row * grid + 1, grid - 2, grid - 2);
        }
      }
      ctx.strokeStyle = 'rgba(179, 193, 200, 0.045)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= cols; i += 1) {
        ctx.beginPath();
        ctx.moveTo(i * grid, 0);
        ctx.lineTo(i * grid, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j <= rows; j += 1) {
        ctx.beginPath();
        ctx.moveTo(0, j * grid);
        ctx.lineTo(canvas.width, j * grid);
        ctx.stroke();
      }

      const fx = food.x * grid;
      const fy = food.y * grid;
      ctx.fillStyle = 'rgba(0,0,0,.45)';
      ctx.beginPath();
      ctx.ellipse(fx + 10, fy + 16, 7, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      const apple = ctx.createRadialGradient(fx + 6, fy + 5, 1, fx + 10, fy + 10, 11);
      apple.addColorStop(0, '#ffc17d');
      apple.addColorStop(0.35, '#ef7055');
      apple.addColorStop(1, '#902d3c');
      ctx.fillStyle = apple;
      ctx.beginPath();
      ctx.moveTo(fx + 9, fy + 4);
      ctx.bezierCurveTo(fx - 2, fy - 1, fx + 1, fy + 18, fx + 9, fy + 16);
      ctx.bezierCurveTo(fx + 17, fy + 19, fx + 21, fy, fx + 9, fy + 4);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 224, 195, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 238, 220, 0.75)';
      ctx.beginPath();
      ctx.ellipse(fx + 6, fy + 6, 2, 3, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = p.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fx + 9, fy + 3);
      ctx.quadraticCurveTo(fx + 9, fy - 1, fx + 13, fy);
      ctx.stroke();
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.ellipse(fx + 14, fy + 1, 3.5, 1.8, -0.4, 0, Math.PI * 2);
      ctx.fill();

      const progress = Math.min(1, Math.max(0, (now - lastStepAt) / stepDuration));
      const points = snake.map((part, index) => {
        const from = previousSnake[index] || part;
        return {
          x: (from.x + (part.x - from.x) * progress) * grid + grid / 2,
          y: (from.y + (part.y - from.y) * progress) * grid + grid / 2,
        };
      });

      if (points.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.shadowColor = 'rgba(0,0,0,.6)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 3;
        ctx.strokeStyle = '#73513a';
        ctx.lineWidth = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = '#d7ac6c';
        ctx.lineWidth = 11;
        ctx.stroke();
        ctx.strokeStyle = '#f3d49a';
        ctx.lineWidth = 3;
        ctx.stroke();
        points.slice(1).forEach((point, index) => {
          ctx.fillStyle = index % 2 ? '#bd894e' : '#edca8b';
          ctx.beginPath();
          ctx.ellipse(point.x, point.y, 2, 2.5, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      const head = points[0];
      const facing = pendingDirection || direction;
      const skin = ctx.createRadialGradient(head.x - 3, head.y - 4, 1, head.x, head.y, 10);
      skin.addColorStop(0, '#ffe2a6');
      skin.addColorStop(0.65, '#d9ae71');
      skin.addColorStop(1, '#9d6a40');
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.ellipse(head.x, head.y, 9, 7.5, Math.atan2(facing.y, facing.x), 0, Math.PI * 2);
      ctx.fill();
      const side = { x: -facing.y, y: facing.x };
      [1, -1].forEach((sign) => {
        const eyeX = head.x + facing.x * 3 + side.x * 4 * sign;
        const eyeY = head.y + facing.y * 3 + side.y * 4 * sign;
        ctx.fillStyle = '#f8f1df';
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#14251d';
        ctx.beginPath();
        ctx.arc(eyeX + facing.x, eyeY + facing.y, 0.9, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';

      if (over) {
        ctx.fillStyle = rgba(p.canvas, 0.84);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = p.ink;
        ctx.font = '24px "Instrument Serif", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game over', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = p.accent;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 26);
        ctx.textAlign = 'left';
      }
    }

    function step() {
      if (pendingDirection) {
        direction = pendingDirection;
        pendingDirection = null;
      }
      previousSnake = snake.map((part) => ({ ...part }));
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
      const hitWall = head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
      const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);

      if (hitWall || hitSelf) {
        running = false;
      canvas.classList.remove('is-playing');
        over = true;
        window.clearInterval(loop);
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        draw();
        return;
      }

      lastStepAt = performance.now();
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 1;
        if (score > best) {
          best = score;
          try { window.localStorage.setItem('snakeBest', String(best)); } catch (_) { /* Storage may be unavailable. */ }
        }
        updateScore();
        placeFood();
      } else {
        snake.pop();
      }
    }

    function animate(now) {
      if (!running) return;
      draw(now);
      animationFrame = window.requestAnimationFrame(animate);
    }

    function start() {
      reset();
      previousSnake = snake.map((part) => ({ ...part }));
      lastStepAt = performance.now();
      draw();
      if (loop) window.clearInterval(loop);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      running = true;
      canvas.classList.add('is-playing');
      loop = window.setInterval(step, stepDuration);
      animationFrame = window.requestAnimationFrame(animate);
    }

    snakeCleanup = () => {
      running = false;
      canvas.classList.remove('is-playing');
      if (loop) window.clearInterval(loop);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      loop = null;
      animationFrame = 0;
      snakeKeyHandler = null;
    };

    $('snakeStart')?.addEventListener('click', start);

    const dpadMap = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };

    function requestDirection(nextDirection) {
      const from = pendingDirection || direction;
      if (!nextDirection || (nextDirection.x === -from.x && nextDirection.y === -from.y)) return;
      pendingDirection = nextDirection;
      // Give immediate visual confirmation while the next grid step is queued.
      draw(performance.now());
    }

    document.querySelectorAll('#snakeDpad .dpad-btn').forEach((button) => {
      const handler = (event) => {
        if (!running) return;
        event.preventDefault();
        requestDirection(dpadMap[button.dataset.dir]);
      };
      button.addEventListener('pointerdown', handler);
      button.addEventListener('click', (event) => {
        // Keep keyboard activation; pointer presses are handled at pointerdown.
        if (event.detail === 0) handler(event);
      });
    });

    let touchStart = null;
    canvas.addEventListener('pointerdown', (event) => {
      if (!running || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
      touchStart = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture?.(event.pointerId);
    });

    canvas.addEventListener('pointermove', (event) => {
      if (!touchStart || !running) return;
      const dx = event.clientX - touchStart.x;
      const dy = event.clientY - touchStart.y;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      const nextDirection = Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 })
        : (dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
      requestDirection(nextDirection);
      touchStart = null;
    });

    canvas.addEventListener('pointercancel', () => { touchStart = null; });

    canvas.addEventListener('pointerup', (event) => {
      if (!touchStart || !running) return;
      const dx = event.clientX - touchStart.x;
      const dy = event.clientY - touchStart.y;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        touchStart = null;
        return;
      }

      let nextDirection;
      if (Math.abs(dx) > Math.abs(dy)) nextDirection = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      else nextDirection = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };

      requestDirection(nextDirection);
      touchStart = null;
    });

    snakeKeyHandler = (event) => {
      if (!running || activeGame !== 'snake') return;
      const map = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
        W: { x: 0, y: -1 }, S: { x: 0, y: 1 },
        A: { x: -1, y: 0 }, D: { x: 1, y: 0 },
      };
      const nextDirection = map[event.key];
      if (nextDirection) {
        requestDirection(nextDirection);
        event.preventDefault();
      }
    };

    currentRedraw = draw;
    reset();
    draw();
  }

  document.addEventListener('keydown', (event) => {
    if (snakeKeyHandler) snakeKeyHandler(event);
  });

  /* ============================================================
     GAME — MEMORY
     ============================================================ */
  function initMemory() {
    if (!gameStage) return;
    const emojis = ['🧠', '🤖', '📊', '🚀', '💡', '🔥', '🎯', '⚡'];
    let cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flipped = [];
    let matchedArray = [];
    let matched = 0;
    let moves = 0;
    let lock = false;

    gameStage.innerHTML = `
      <h3>Memory match</h3>
      <p class="game-info">Moves: <span id="memMoves">0</span> · Matched: <span id="memMatched">0</span>/8</p>
      <div class="game-grid memory-grid" id="memGrid"></div>
      <div class="game-row"><button class="game-btn primary" id="memReset" type="button">Shuffle &amp; restart</button></div>
      <p class="game-info" id="memStatus" aria-live="polite"></p>`;

    const grid = $('memGrid');
    const status = $('memStatus');

    function render() {
      if (!grid) return;
      grid.innerHTML = '';
      cards.forEach((card, index) => {
        const cell = document.createElement('button');
        const isFlipped = flipped.includes(index);
        const isMatched = matchedArray.includes(index);
        cell.type = 'button';
        cell.className = 'memory-card';
        if (isFlipped || isMatched) {
          cell.textContent = card;
          cell.classList.add('flipped');
        }
        if (isMatched) cell.classList.add('matched');
        cell.setAttribute('aria-label', isFlipped || isMatched ? `Card showing ${card}` : `Hidden card ${index + 1}`);
        cell.addEventListener('click', () => flip(index));
        grid.appendChild(cell);
      });
    }

    function flip(index) {
      if (lock || flipped.includes(index) || matchedArray.includes(index)) return;
      flipped.push(index);
      render();

      if (flipped.length !== 2) return;

      moves += 1;
      setText('memMoves', moves);
      lock = true;

      const [a, b] = flipped;
      if (cards[a] === cards[b]) {
        matchedArray.push(a, b);
        matched += 1;
        setText('memMatched', matched);
        flipped = [];
        lock = false;
        render();
        if (matched === 8 && status) status.textContent = `Cleared in ${moves} moves.`;
      } else {
        window.setTimeout(() => {
          flipped = [];
          lock = false;
          render();
        }, 800);
      }
    }

    function reset() {
      cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
      flipped = [];
      matchedArray = [];
      matched = 0;
      moves = 0;
      lock = false;
      setText('memMoves', 0);
      setText('memMatched', 0);
      if (status) status.textContent = '';
      render();
    }

    $('memReset')?.addEventListener('click', reset);
    reset();
  }

  /* ============================================================
     GAME — TIC-TAC-TOE
     ============================================================ */
  function initTTT() {
    if (!gameStage) return;
    let board = Array(9).fill(null);
    let over = false;
    let winLine = null;

    gameStage.innerHTML = `
      <h3>Tic-tac-toe</h3>
      <p class="game-info" id="tttInfo">Your turn (X). The computer is playing O.</p>
      <div class="game-grid ttt-grid" id="tttGrid"></div>
      <div class="game-row"><button class="game-btn primary" id="tttReset" type="button">Restart</button></div>`;

    const grid = $('tttGrid');

    function render() {
      if (!grid) return;
      grid.innerHTML = '';
      board.forEach((value, index) => {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = `ttt-cell${winLine && winLine.includes(index) ? ' win' : ''}`;
        cell.textContent = value || '';
        cell.setAttribute('aria-label', value ? `${value} at square ${index + 1}` : `Square ${index + 1}`);
        cell.addEventListener('click', () => move(index));
        grid.appendChild(cell);
      });
    }

    function checkWinner(current) {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];
      for (const line of lines) {
        if (current[line[0]] && current[line[0]] === current[line[1]] && current[line[1]] === current[line[2]]) {
          return { winner: current[line[0]], line };
        }
      }
      if (current.every(Boolean)) return { winner: 'draw', line: null };
      return null;
    }

    function move(index) {
      if (over || board[index]) return;
      board[index] = 'X';
      let result = checkWinner(board);
      if (result) { end(result); return; }

      const best = minimax(board, 'O');
      board[best] = 'O';
      result = checkWinner(board);

      if (result) end(result);
      else setText('tttInfo', 'Your turn (X).');
      render();
    }

    function minimax(current, player) {
      const result = checkWinner(current);
      if (result) {
        if (result.winner === 'O') return 10;
        if (result.winner === 'X') return -10;
        return 0;
      }

      const moves = [];
      current.forEach((value, index) => {
        if (value) return;
        current[index] = player;
        moves.push({ index, score: minimax(current, player === 'O' ? 'X' : 'O') });
        current[index] = null;
      });

      if (player === 'O') {
        let best = moves[0];
        for (const option of moves) if (option.score > best.score) best = option;
        return best.index;
      }

      let best = moves[0];
      for (const option of moves) if (option.score < best.score) best = option;
      return best.index;
    }

    function end(result) {
      over = true;
      winLine = result.line;
      render();
      if (result.winner === 'draw') setText('tttInfo', "It's a draw. 🤝");
      else if (result.winner === 'X') setText('tttInfo', 'You win! 🎉');
      else setText('tttInfo', 'The computer wins this one. 🤖');
    }

    function reset() {
      board = Array(9).fill(null);
      over = false;
      winLine = null;
      setText('tttInfo', 'Your turn (X). The computer is playing O.');
      render();
    }

    $('tttReset')?.addEventListener('click', reset);
    render();
  }

  /* ============================================================
     GAME — REACTION
     ============================================================ */
  function initReaction() {
    if (!gameStage) return;
    gameStage.innerHTML = `
      <h3>Reaction time</h3>
      <p class="game-info">Wait for green, then click as fast as you can. Don't click early.</p>
      <button class="reaction-box" id="reactBox" type="button">Click to start</button>
      <p class="game-info" id="reactResult" aria-live="polite"></p>`;

    const box = $('reactBox');
    const result = $('reactResult');
    if (!box) return;

    let state = 'idle';
    let start = 0;
    let timeout;

    function handleReactionInput(event) {
      event.preventDefault();
      if (state === 'idle' || state === 'done') {
        state = 'waiting';
        box.className = 'reaction-box wait';
        box.textContent = 'Wait for green…';
        if (result) result.textContent = '';
        const delay = 1500 + Math.random() * 3000;
        timeout = window.setTimeout(() => {
          state = 'go';
          start = performance.now();
          box.className = 'reaction-box go';
          box.textContent = 'CLICK NOW';
        }, delay);
      } else if (state === 'waiting') {
        window.clearTimeout(timeout);
        state = 'idle';
        box.className = 'reaction-box';
        box.textContent = 'Too early! Click to retry';
        if (result) result.textContent = 'You clicked too early. 😅';
      } else if (state === 'go') {
        const receivedAt = performance.now();
        const ms = Math.max(0, Math.round(receivedAt - start));
        state = 'done';
        box.className = 'reaction-box';
        box.textContent = 'Click to try again';
        if (result) result.textContent = `Your reaction time: ${ms} ms ${ms < 250 ? '⚡ Fast!' : ms < 400 ? '👍 Good' : '🐢 Slow'}`;
      }
    }

    box.addEventListener('pointerdown', handleReactionInput);
    box.addEventListener('click', (event) => {
      // Pointer input is handled on pointerdown for immediate touch and mouse response.
      if (event.detail === 0) handleReactionInput(event);
    });
  }

  /* ============================================================
     GAME — ROCK PAPER SCISSORS
     ============================================================ */
  function initRPS() {
    if (!gameStage) return;
    const choices = ['✊', '✋', '✌️'];
    const names = ['Rock', 'Paper', 'Scissors'];

    gameStage.innerHTML = `
      <h3>Rock paper scissors</h3>
      <p class="game-info" id="rpsInfo">Pick your move.</p>
      <div class="rps-choices">
        ${choices.map((choice, index) => `<button class="rps-choice" type="button" data-i="${index}" aria-label="${names[index]}">${choice}</button>`).join('')}
      </div>
      <p class="game-info" id="rpsResult" aria-live="polite"></p>
      <p class="game-info">Score — You: <span id="rpsYou">0</span> · CPU: <span id="rpsCpu">0</span></p>`;

    let you = 0;
    let cpu = 0;

    function choose(index) {
      const player = Number(index);
      const computer = Math.floor(Math.random() * 3);
      const outcome = (player - computer + 3) % 3;

      setText('rpsInfo', `You: ${names[player]} ${choices[player]}  vs  CPU: ${names[computer]} ${choices[computer]}`);

      if (outcome === 0) setText('rpsResult', "It's a draw. 🤝");
      else if (outcome === 1) { you += 1; setText('rpsResult', 'You win! 🎉'); }
      else { cpu += 1; setText('rpsResult', 'CPU wins. 🤖'); }

      setText('rpsYou', you);
      setText('rpsCpu', cpu);
    }

    $$('.rps-choice', gameStage).forEach((element) => {
      element.addEventListener('click', () => choose(element.dataset.i));
    });
  }

  /* ============================================================
     GAME — GUESS THE NUMBER
     ============================================================ */
  function initGuess() {
    if (!gameStage) return;
    let target = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;

    gameStage.innerHTML = `
      <h3>Guess the number</h3>
      <p class="game-info">I'm thinking of a number between 1 and 100.</p>
      <div class="game-row">
        <input type="number" id="guessInput" class="game-input" min="1" max="100" placeholder="Your guess" aria-label="Your guess" />
        <button class="game-btn primary" id="guessBtn" type="button">Guess</button>
        <button class="game-btn" id="guessReset" type="button">New number</button>
      </div>
      <p class="game-info" id="guessResult" aria-live="polite"></p>
      <p class="game-info">Attempts: <span id="guessAttempts">0</span></p>`;

    const input = $('guessInput');
    const result = $('guessResult');
    if (!input) return;

    function guess() {
      const value = Number(input.value);
      if (!value || value < 1 || value > 100) {
        setText('guessResult', 'Enter a number from 1 to 100.');
        return;
      }
      attempts += 1;
      setText('guessAttempts', attempts);

      if (value === target) setText('guessResult', `🎉 Correct! The number was ${target}. It took ${attempts} attempts.`);
      else if (value < target) setText('guessResult', `${value} is too low. Try higher. ⬆️`);
      else setText('guessResult', `${value} is too high. Try lower. ⬇️`);

      input.value = '';
      input.focus();
    }

    $('guessBtn')?.addEventListener('click', guess);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') guess();
    });

    $('guessReset')?.addEventListener('click', () => {
      target = Math.floor(Math.random() * 100) + 1;
      attempts = 0;
      setText('guessAttempts', 0);
      setText('guessResult', 'New number picked. Guess again.');
      input.value = '';
      input.focus();
    });
  }

  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      try { currentRedraw(); } catch (e) { /* ignore */ }
    });
  });

  /* ============================================================
     MATRIX RAIN + KONAMI
     ============================================================ */
  const matrixCanvas = $('matrixCanvas');
  const matrixContext = matrixCanvas ? matrixCanvas.getContext('2d') : null;
  const matrixFontSize = 13;
  const matrixCharacters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>{}[]';
  let matrixOn = false;
  let matrixColumns = [];
  let matrixWidth = 0;
  let matrixHeight = 0;

  function resizeMatrix() {
    if (!matrixCanvas || !matrixContext) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    matrixWidth = window.innerWidth;
    matrixHeight = window.innerHeight;
    matrixCanvas.width = Math.round(matrixWidth * dpr);
    matrixCanvas.height = Math.round(matrixHeight * dpr);
    matrixContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    matrixColumns = Array(Math.ceil(matrixWidth / matrixFontSize)).fill(1);
  }

  function drawMatrix() {
    if (!matrixOn || !matrixContext) {
      window.requestAnimationFrame(drawMatrix);
      return;
    }

    const p = palette();
    matrixContext.fillStyle = rgba(p.canvas, 0.08);
    matrixContext.fillRect(0, 0, matrixWidth, matrixHeight);
    matrixContext.fillStyle = p.accent;
    matrixContext.font = `${matrixFontSize}px "JetBrains Mono", monospace`;

    matrixColumns.forEach((y, index) => {
      const character = matrixCharacters[Math.floor(Math.random() * matrixCharacters.length)];
      matrixContext.fillText(character, index * matrixFontSize, y * matrixFontSize);
      if (y * matrixFontSize > matrixHeight && Math.random() > 0.975) matrixColumns[index] = 0;
      matrixColumns[index] += 1;
    });

    window.requestAnimationFrame(drawMatrix);
  }

  function setMatrix(on) {
    matrixOn = on;
    matrixCanvas?.classList.toggle('show', on);
    if (!on && matrixContext) {
      matrixContext.clearRect(0, 0, matrixWidth, matrixHeight);
    }
  }

  resizeMatrix();
  window.addEventListener('resize', resizeMatrix);
  drawMatrix();

  const konamiOverlay = $('konamiOverlay');
  const konamiClose = $('konamiClose');
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  let lastFocused = null;

  function openKonami() {
    if (!prefersReduced) setMatrix(true);
    lastFocused = document.activeElement;
    konamiOverlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
    konamiClose?.focus();
  }

  function closeKonami() {
    konamiOverlay?.classList.remove('show');
    document.body.style.overflow = '';
    setMatrix(false);
    if (lastFocused?.focus) lastFocused.focus();
  }

  window.addEventListener('keydown', (event) => {
    if (konamiOverlay?.classList.contains('show')) return;

    if (event.key === konamiSequence[konamiIndex]) {
      konamiIndex += 1;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        openKonami();
      }
    } else {
      konamiIndex = 0;
    }
  });

  konamiClose?.addEventListener('click', closeKonami);
  konamiOverlay?.addEventListener('click', (event) => {
    if (event.target === konamiOverlay) closeKonami();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && konamiOverlay?.classList.contains('show')) closeKonami();
  });

  /* ============================================================
     BOOT THE ARCADE
     ============================================================ */
  loadGame('snake');
})();
