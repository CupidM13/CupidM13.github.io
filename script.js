/* ============================================================
   Cupid Moolchandani — personal site interactions
   ============================================================ */

const S = window.SITE || {};
const root = document.documentElement;
const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, '0');
const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = $('nav');
const navLinks = $('navLinks');
const burger = $('burger');
const themeBtn = $('themeToggle');

/* ============================================================
   THEME
   ============================================================ */
function syncThemeLabel() {
  const isDark = root.getAttribute('data-theme') !== 'light';
  themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#0b0b0c' : '#f4efe6');
}
syncThemeLabel();

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
  syncThemeLabel();
});

/* ============================================================
   MOBILE NAV
   ============================================================ */
function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
}

burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    burger.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760 && nav.classList.contains('open')) setMenu(false);
});

/* ============================================================
   SITE CONTENT
   ============================================================ */
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

$('heroFirst').textContent = firstName;
$('heroLast').textContent = lastName;
$('brandName').textContent = name;
$('brandMark').textContent = initials;
$('footerMark').textContent = initials;
$('heroTag').textContent = S.tagline || '';
$('heroFocus').textContent = S.role || 'AI / ML engineering';
$('heroBase').textContent = baseLocation;
$('heroCountry').textContent = baseLocation;

document.querySelectorAll('[data-availability]').forEach((el) => {
  if (S.available) return;
  if (el.id === 'heroNow') {
    el.textContent = 'Building & learning';
  } else {
    el.style.display = 'none';
  }
});

/* ---------- typing rotator ---------- */
const roles = [
  S.role || 'Aspiring AI / ML Engineer',
  'Quant-minded builder',
  "IIT Delhi · Class of 2026",
  'Turning data into decisions',
];
const typingEl = $('typingText');

if (prefersReduced) {
  typingEl.textContent = roles[0];
} else {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  (function typeLoop() {
    const word = roles[roleIndex];

    if (!deleting) {
      typingEl.textContent = word.slice(0, charIndex + 1);
      charIndex += 1;
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      typingEl.textContent = word.slice(0, charIndex - 1);
      charIndex -= 1;
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(typeLoop, deleting ? 38 : 72);
  })();
}

/* ---------- background ---------- */
const education = S.education || [];
const experience = S.experience || [];

$('expCount').textContent = pad(experience.length);
$('eduCount').textContent = pad(education.length);
$('skillCount').textContent = pad(Object.keys(S.skills || {}).length);

$('eduList').innerHTML = education.map((item) => {
  const degree = (item.degree || '').replace(/^Bachelor of Technology/i, 'B.Tech');
  const school = (item.school || '').replace(/^Indian Institute of Technology,?\s*/i, 'IIT ');

  return `
    <article class="cv-item reveal">
      <span class="cv-when">${esc(item.years || '')}</span>
      <div class="cv-body">
        <h4 class="cv-role">${esc(degree)}</h4>
        <p class="cv-org">
          ${esc(school)}${item.grade ? ` <span>· Grade ${esc(item.grade)}</span>` : ''}
        </p>
      </div>
    </article>`;
}).join('');

$('expList').innerHTML = experience.map((item) => `
  <article class="cv-item reveal">
    <span class="cv-when">${esc(item.years || '')}</span>
    <div class="cv-body">
      <h4 class="cv-role">${esc(item.role || '')}</h4>
      <p class="cv-org">
        ${esc(item.org || '')}${item.type ? ` <span>· ${esc(item.type)}</span>` : ''}
      </p>
    </div>
  </article>
`).join('');

/* ---------- skills ---------- */
$('skillsGrid').innerHTML = Object.entries(S.skills || {}).map(([category, items], index) => `
  <div class="skill-row reveal">
    <span class="skill-index">${pad(index + 1)}</span>
    <h3 class="skill-name">${esc(category)}</h3>
    <div class="skill-tags">
      ${(items || []).map((item) => `<span class="tag">${esc(item)}</span>`).join('')}
    </div>
  </div>
`).join('');

/* ---------- contact ---------- */
const links = S.links || {};
const emailLink = $('emailLink');
const contactLinks = $('contactLinks');
const copyEmailButton = $('copyEmail');
const copyStatus = $('copyStatus');
const copyEmailLabel = copyEmailButton?.querySelector('.copy-email-label');
let copyResetTimer = 0;

function markEmailCopied() {
  copyEmailButton.classList.add('is-copied');
  copyEmailButton.setAttribute('aria-label', 'Email address copied');
  if (copyEmailLabel) copyEmailLabel.textContent = 'Copied';
  if (copyStatus) copyStatus.textContent = 'Email address copied to your clipboard.';

  clearTimeout(copyResetTimer);
  copyResetTimer = setTimeout(() => {
    copyEmailButton.classList.remove('is-copied');
    copyEmailButton.setAttribute('aria-label', 'Copy email address');
    if (copyEmailLabel) copyEmailLabel.textContent = 'Copy';
    if (copyStatus) copyStatus.textContent = '';
  }, 2200);
}

async function copyEmailAddress() {
  if (!S.email) return;
  let copied = false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(S.email);
      copied = true;
    }
  } catch (error) {
    copied = false;
  }

  if (!copied) {
    try {
      const field = document.createElement('textarea');
      field.value = S.email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      copied = document.execCommand('copy');
      field.remove();
    } catch (error) {
      copied = false;
    }
  }

  if (copied) {
    markEmailCopied();
  } else if (copyStatus) {
    copyStatus.textContent = `Could not copy automatically. The address is ${S.email}.`;
  }
}

if (S.email) {
  $('contactEmail').textContent = S.email;
  emailLink.href = `mailto:${S.email}`;
  copyEmailButton?.addEventListener('click', copyEmailAddress);
} else {
  emailLink.closest('.email-row').style.display = 'none';
}

const linkDefinitions = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'kaggle', label: 'Kaggle' },
  { key: 'resume', label: 'Resume (PDF)' },
];

const socialMarkup = linkDefinitions
  .filter((definition) => links[definition.key])
  .map((definition) => `
    <a class="contact-link" href="${esc(links[definition.key])}" target="_blank" rel="noopener">
      <span>${definition.label}</span>
      <span class="contact-link-arrow" aria-hidden="true">↗</span>
    </a>`)
  .join('');

contactLinks.innerHTML = socialMarkup;
if (!socialMarkup) contactLinks.style.display = 'none';

$('contactLocation').innerHTML = `${esc(baseLocation)} · <span id="contactTime">--:--</span> IST`;

/* ---------- clock ---------- */
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

  const footerClock = $('localTime');
  if (footerClock) footerClock.textContent = `India — ${time} IST`;

  const contactTime = $('contactTime');
  if (contactTime) contactTime.textContent = time;
}
updateClock();
setInterval(updateClock, 30000);

/* ---------- contact form ---------- */
/* ---------- footer ---------- */
$('footerName').textContent = name;
$('year').textContent = new Date().getFullYear();

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReduced) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('in'));
}

/* ============================================================
   SCROLL UI
   ============================================================ */
const scrollProgress = $('scrollProgress');
const backToTop = $('backToTop');
let scrollTicking = false;

function onScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.style.width = `${max > 0 ? (scrollTop / max) * 100 : 0}%`;
  nav.classList.toggle('scrolled', scrollTop > 8);
  backToTop.classList.toggle('show', scrollTop > 600);
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(onScroll);
}, { passive: true });

onScroll();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
});

/* ---------- active nav section ---------- */
const sections = [...document.querySelectorAll('main section[id], footer[id]')];
const navAnchors = [...navLinks.querySelectorAll('a')];

if ('IntersectionObserver' in window) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const current = `#${entry.target.id}`;
      navAnchors.forEach((anchor) => {
        const isCurrent = anchor.getAttribute('href') === current;
        anchor.classList.toggle('active', isCurrent);
        if (isCurrent) anchor.setAttribute('aria-current', 'true');
        else anchor.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

  sections.forEach((section) => spyObserver.observe(section));
}

/* ============================================================
   PLAYGROUND — single neuron
   ============================================================ */
const sigmoid = (x) => 1 / (1 + Math.exp(-x));

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

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: cssWidth, height: cssWidth / ratio };
}

function bindSlider(id, valueId, callback) {
  const input = $(id);
  const output = $(valueId);
  input.addEventListener('input', () => {
    output.textContent = Number(input.value).toFixed(1);
    callback();
  });
  callback();
}

function drawNeuron() {
  const canvas = $('neuronCanvas');
  if (!canvas) return;
  const { ctx, width: W, height: H } = prepareCanvas(canvas);

  ctx.clearRect(0, 0, W, H);

  const x = Number($('nX').value);
  const w = Number($('nW').value);
  const b = Number($('nB').value);
  const z = w * x + b;
  const out = sigmoid(z);

  $('nZ').textContent = z.toFixed(2);
  $('nOut').textContent = out.toFixed(3);

  // sigmoid curve
  ctx.strokeStyle = 'rgba(255, 106, 61, 0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= W; i += 1) {
    const xx = (i / W) * 6 - 3;
    const yy = sigmoid(xx);
    const px = i;
    const py = H - yy * H * 0.8 - H * 0.1;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // baseline
  ctx.strokeStyle = 'rgba(243, 239, 231, 0.14)';
  ctx.beginPath();
  ctx.moveTo(0, H / 2);
  ctx.lineTo(W, H / 2);
  ctx.stroke();

  // current point
  const px = ((z + 3) / 6) * W;
  const py = H - out * H * 0.8 - H * 0.1;
  ctx.fillStyle = '#98e3c2';
  ctx.beginPath();
  ctx.arc(Math.min(W, Math.max(0, px)), py, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f3efe7';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.fillText(`z=${z.toFixed(2)}`, Math.min(W - 58, Math.max(8, px + 8)), Math.max(18, py - 10));
}

let weights = null;

function initWeights() {
  weights = {
    w1: Array.from({ length: 3 }, () => Array.from({ length: 2 }, () => Math.random() * 2 - 1)),
    b1: Array.from({ length: 3 }, () => Math.random() * 2 - 1),
    w2: Array.from({ length: 3 }, () => Math.random() * 2 - 1),
    b2: Math.random() * 2 - 1,
  };
}

initWeights();

function mlpForward(x1, x2) {
  const hidden = weights.w1.map((row, i) => sigmoid(row[0] * x1 + row[1] * x2 + weights.b1[i]));
  const z = weights.w2.reduce((sum, weight, i) => sum + weight * hidden[i], 0) + weights.b2;
  return { hidden, out: sigmoid(z) };
}

function drawMLP() {
  const canvas = $('mlpCanvas');
  if (!canvas) return;
  const { ctx, width: W, height: H } = prepareCanvas(canvas);

  ctx.clearRect(0, 0, W, H);

  const x1 = Number($('mX1').value);
  const x2 = Number($('mX2').value);
  $('mX1v').textContent = x1.toFixed(1);
  $('mX2v').textContent = x2.toFixed(1);

  const { hidden, out } = mlpForward(x1, x2);
  $('mH').textContent = hidden.map((value) => value.toFixed(2)).join(', ');
  $('mOut').textContent = out.toFixed(3);

  const leftX = 44;
  const midX = W / 2;
  const rightX = W - 44;
  const inputY = [H * 0.3, H * 0.7];
  const hiddenY = [H * 0.2, H * 0.5, H * 0.8];
  const outputY = H / 2;

  const edgeColor = (weight) => (
    weight > 0
      ? `rgba(152, 227, 194, ${Math.min(1, Math.abs(weight) / 2)})`
      : `rgba(255, 106, 61, ${Math.min(1, Math.abs(weight) / 2)})`
  );

  // input -> hidden
  for (let i = 0; i < 2; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      const weight = weights.w1[j][i];
      ctx.strokeStyle = edgeColor(weight);
      ctx.lineWidth = Math.min(3, Math.abs(weight) + 0.5);
      ctx.beginPath();
      ctx.moveTo(leftX, inputY[i]);
      ctx.lineTo(midX, hiddenY[j]);
      ctx.stroke();
    }
  }

  // hidden -> output
  for (let j = 0; j < 3; j += 1) {
    const weight = weights.w2[j];
    ctx.strokeStyle = edgeColor(weight);
    ctx.lineWidth = Math.min(3, Math.abs(weight) + 0.5);
    ctx.beginPath();
    ctx.moveTo(midX, hiddenY[j]);
    ctx.lineTo(rightX, outputY);
    ctx.stroke();
  }

  function drawNode(x, y, value, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0b0b0c';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(value.toFixed(2), x, y + 4);
    ctx.textAlign = 'left';
  }

  drawNode(leftX, inputY[0], x1, '#ff6a3d');
  drawNode(leftX, inputY[1], x2, '#ff6a3d');
  hiddenY.forEach((y, j) => drawNode(midX, y, hidden[j], '#b3ada3'));
  drawNode(rightX, outputY, out, '#98e3c2');
}

/* ---------- lab panels rendered inside the arcade ---------- */
function initNeuronLab() {
  gameStage.innerHTML = `
    <div class="lab-panel">
      <div class="lab-head">
        <div>
          <span class="lab-tag">Lab 01</span>
          <h3>Single neuron</h3>
        </div>
        <span class="live-tag"><i aria-hidden="true"></i>Live</span>
      </div>
      <div class="canvas-wrap">
        <canvas id="neuronCanvas" width="420" height="260" aria-label="Sigmoid activation plot of a single neuron"></canvas>
      </div>
      <div class="controls">
        <label class="ctl">
          <span class="ctl-name">Input · x</span>
          <span class="ctl-val" id="nXv">1.2</span>
          <input type="range" id="nX" min="-3" max="3" step="0.1" value="1.2" />
        </label>
        <label class="ctl">
          <span class="ctl-name">Weight · w</span>
          <span class="ctl-val" id="nWv">1.0</span>
          <input type="range" id="nW" min="-3" max="3" step="0.1" value="1.0" />
        </label>
        <label class="ctl">
          <span class="ctl-name">Bias · b</span>
          <span class="ctl-val" id="nBv">0.0</span>
          <input type="range" id="nB" min="-3" max="3" step="0.1" value="0.0" />
        </label>
        <div class="readout">
          <div><span>z = w·x + b</span><b id="nZ">0.00</b></div>
          <div><span>σ(z)</span><b id="nOut">0.00</b></div>
        </div>
      </div>
    </div>`;

  bindSlider('nX', 'nXv', drawNeuron);
  bindSlider('nW', 'nWv', drawNeuron);
  bindSlider('nB', 'nBv', drawNeuron);
}

function initMLPLab() {
  gameStage.innerHTML = `
    <div class="lab-panel">
      <div class="lab-head">
        <div>
          <span class="lab-tag">Lab 02</span>
          <h3>Tiny MLP <span>2-3-1</span></h3>
        </div>
        <span class="live-tag"><i aria-hidden="true"></i>Live</span>
      </div>
      <div class="canvas-wrap">
        <canvas id="mlpCanvas" width="420" height="260" aria-label="A two input, three hidden node, one output neural network diagram"></canvas>
      </div>
      <div class="controls">
        <label class="ctl">
          <span class="ctl-name">Input · x₁</span>
          <span class="ctl-val" id="mX1v">0.8</span>
          <input type="range" id="mX1" min="-2" max="2" step="0.1" value="0.8" />
        </label>
        <label class="ctl">
          <span class="ctl-name">Input · x₂</span>
          <span class="ctl-val" id="mX2v">-0.4</span>
          <input type="range" id="mX2" min="-2" max="2" step="0.1" value="-0.4" />
        </label>
        <div class="readout">
          <div><span>Hidden</span><b id="mH">—</b></div>
          <div><span>σ(·)</span><b id="mOut">0.00</b></div>
        </div>
        <button class="btn btn-quiet btn-small" id="randomizeWeights" type="button">Randomize weights <span aria-hidden="true">↻</span></button>
      </div>
    </div>`;

  ['mX1', 'mX2'].forEach((id) => {
    $(id).addEventListener('input', drawMLP);
  });

  $('randomizeWeights').addEventListener('click', () => {
    initWeights();
    drawMLP();
  });

  drawMLP();
}

let labResizeFrame = 0;
window.addEventListener('resize', () => {
  cancelAnimationFrame(labResizeFrame);
  labResizeFrame = requestAnimationFrame(() => {
    drawNeuron();
    drawMLP();
  });
});

/* ============================================================
   MATRIX RAIN (easter egg)
   ============================================================ */
const matrixCanvas = $('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');
let matrixOn = false;
let matrixColumns = [];
const matrixFontSize = 14;

function resizeMatrix() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  matrixColumns = Array(Math.floor(matrixCanvas.width / matrixFontSize)).fill(1);
}

resizeMatrix();
window.addEventListener('resize', resizeMatrix);

const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>{}[]';

function drawMatrix() {
  if (!matrixOn) {
    requestAnimationFrame(drawMatrix);
    return;
  }

  matrixCtx.fillStyle = 'rgba(11, 11, 12, 0.08)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  matrixCtx.fillStyle = '#98e3c2';
  matrixCtx.font = `${matrixFontSize}px monospace`;

  matrixColumns.forEach((y, i) => {
    const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    matrixCtx.fillText(char, i * matrixFontSize, y * matrixFontSize);
    if (y * matrixFontSize > matrixCanvas.height && Math.random() > 0.975) matrixColumns[i] = 0;
    matrixColumns[i] += 1;
  });

  requestAnimationFrame(drawMatrix);
}

drawMatrix();

/* ============================================================
   KONAMI CODE
   ============================================================ */
const konamiOverlay = $('konamiOverlay');
const konamiClose = $('konamiClose');
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
let lastFocused = null;

function openKonami() {
  if (!prefersReduced) {
    matrixOn = !matrixOn;
    matrixCanvas.classList.toggle('show', matrixOn);
  }
  lastFocused = document.activeElement;
  konamiOverlay.classList.add('show');
  konamiClose.focus();
}

function closeKonami() {
  konamiOverlay.classList.remove('show');
  if (lastFocused?.focus) lastFocused.focus();
}

window.addEventListener('keydown', (event) => {
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

konamiClose.addEventListener('click', closeKonami);

konamiOverlay.addEventListener('click', (event) => {
  if (event.target === konamiOverlay) closeKonami();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && konamiOverlay.classList.contains('show')) closeKonami();
});

/* ============================================================
   MINI-GAMES ARCADE
   ============================================================ */
const gameTabs = $('gameTabs');
const gameStage = $('gameStage');
const games = [
  { id: 'neuron', name: 'Neuron lab', lab: true },
  { id: 'mlp', name: 'Tiny MLP', lab: true },
  { id: 'snake', name: 'Snake' },
  { id: 'memory', name: 'Memory' },
  { id: 'ttt', name: 'Tic-tac-toe' },
  { id: 'reaction', name: 'Reaction' },
  { id: 'rps', name: 'RPS' },
  { id: 'guess', name: 'Guess' },
];

let activeGame = null;

games.forEach((game) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'game-tab';
  button.textContent = game.name;
  button.dataset.id = game.id;
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-selected', 'false');
  button.setAttribute('aria-controls', 'gameStage');
  button.addEventListener('click', () => loadGame(game.id));
  gameTabs.appendChild(button);
});

function loadGame(id) {
  const entry = games.find((game) => game.id === id);
  const isLab = Boolean(entry?.lab);

  document.querySelectorAll('.game-tab').forEach((tab) => {
    const selected = tab.dataset.id === id;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });

  gameStage.innerHTML = '';
  gameStage.classList.toggle('is-lab', isLab);
  activeGame = id;
  gameStage.setAttribute('aria-label', isLab ? (entry?.name || '') : `${entry?.name || ''} game`);

  if (id === 'neuron') initNeuronLab();
  else if (id === 'mlp') initMLPLab();
  else if (id === 'snake') initSnake();
  else if (id === 'memory') initMemory();
  else if (id === 'ttt') initTTT();
  else if (id === 'reaction') initReaction();
  else if (id === 'rps') initRPS();
  else if (id === 'guess') initGuess();
}

loadGame('neuron');

/* ---------- Snake ---------- */
function initSnake() {
  gameStage.innerHTML = `
    <h3>Snake</h3>
    <p class="game-info">Arrow keys or WASD on desktop. Swipe or use the D-pad on mobile.</p>
    <div class="game-row">
      <span class="snake-score">Score: <span id="snakeScore">0</span></span>
      <button class="game-btn primary" id="snakeStart" type="button">Start / restart</button>
    </div>
    <canvas id="snakeCanvas" class="game-canvas" width="360" height="360" aria-label="Snake game board"></canvas>
    <div class="dpad" id="snakeDpad">
      <div></div><button class="dpad-btn" type="button" data-dir="up" aria-label="Up">▲</button><div></div>
      <button class="dpad-btn" type="button" data-dir="left" aria-label="Left">◀</button><div></div><button class="dpad-btn" type="button" data-dir="right" aria-label="Right">▶</button>
      <div></div><button class="dpad-btn" type="button" data-dir="down" aria-label="Down">▼</button><div></div>
    </div>
  `;

  const canvas = $('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const grid = 18;
  const cols = canvas.width / grid;
  const rows = canvas.height / grid;
  let snake;
  let direction;
  let food;
  let score;
  let loop;
  let running = false;

  function reset() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    score = 0;
    placeFood();
    updateScore();
  }

  function placeFood() {
    do {
      food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    } while (snake.some((part) => part.x === food.x && part.y === food.y));
  }

  function updateScore() {
    $('snakeScore').textContent = score;
  }

  function draw() {
    ctx.fillStyle = '#0f1012';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(243, 239, 231, 0.05)';
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

    ctx.fillStyle = '#98e3c2';
    ctx.beginPath();
    ctx.arc(food.x * grid + grid / 2, food.y * grid + grid / 2, grid / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? '#ff6a3d' : 'rgba(255, 106, 61, 0.55)';
      ctx.fillRect(part.x * grid + 1, part.y * grid + 1, grid - 2, grid - 2);
    });
  }

  function step() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const hitWall = head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
    const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);

    if (hitWall || hitSelf) {
      running = false;
      clearInterval(loop);
      ctx.fillStyle = 'rgba(11, 11, 12, 0.72)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f3efe7';
      ctx.font = 'bold 24px "Instrument Serif", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('Game over', canvas.width / 2, canvas.height / 2);
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#98e3c2';
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 28);
      ctx.textAlign = 'left';
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      updateScore();
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function start() {
    reset();
    draw();
    if (loop) clearInterval(loop);
    running = true;
    loop = setInterval(step, 120);
  }

  $('snakeStart').addEventListener('click', start);

  const dpadMap = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  document.querySelectorAll('#snakeDpad .dpad-btn').forEach((button) => {
    const handler = (event) => {
      event.preventDefault();
      if (!running) return;
      const nextDirection = dpadMap[button.dataset.dir];
      if (nextDirection && !(nextDirection.x === -direction.x && nextDirection.y === -direction.y)) {
        direction = nextDirection;
      }
    };
    button.addEventListener('touchstart', handler, { passive: false });
    button.addEventListener('click', handler);
  });

  let touchStart = null;
  canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
    event.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', (event) => {
    if (!touchStart || !running) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

    let nextDirection;
    if (Math.abs(dx) > Math.abs(dy)) nextDirection = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
    else nextDirection = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };

    if (!(nextDirection.x === -direction.x && nextDirection.y === -direction.y)) {
      direction = nextDirection;
    }
    touchStart = null;
  }, { passive: false });

  window.addEventListener('keydown', snakeKey);

  function snakeKey(event) {
    if (!running || activeGame !== 'snake') return;
    const map = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
      a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
    };
    const nextDirection = map[event.key];
    if (nextDirection && !(nextDirection.x === -direction.x && nextDirection.y === -direction.y)) {
      direction = nextDirection;
      event.preventDefault();
    }
  }

  reset();
  draw();
}

/* ---------- Memory ---------- */
function initMemory() {
  const emojis = ['🧠', '🤖', '📊', '🚀', '💡', '🔥', '🎯', '⚡'];
  let cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let lock = false;
  let matchedArr = [];

  gameStage.innerHTML = `
    <h3>Memory match</h3>
    <p class="game-info">Moves: <span id="memMoves">0</span> · Matched: <span id="memMatched">0</span>/8</p>
    <div class="game-grid memory-grid" id="memGrid"></div>
    <div class="game-row"><button class="game-btn primary" id="memReset" type="button">Shuffle & restart</button></div>
  `;

  const grid = $('memGrid');

  function render() {
    grid.innerHTML = '';
    cards.forEach((card, index) => {
      const cell = document.createElement('div');
      cell.className = 'memory-card';
      if (flipped.includes(index) || matchedArr.includes(index)) {
        cell.textContent = card;
        cell.classList.add('flipped');
      }
      if (matchedArr.includes(index)) cell.classList.add('matched');
      cell.addEventListener('click', () => flip(index));
      grid.appendChild(cell);
    });
  }

  function flip(index) {
    if (lock || flipped.includes(index) || matchedArr.includes(index)) return;
    flipped.push(index);
    render();

    if (flipped.length !== 2) return;

    moves += 1;
    $('memMoves').textContent = moves;
    lock = true;

    const [a, b] = flipped;
    if (cards[a] === cards[b]) {
      matchedArr.push(a, b);
      matched += 1;
      $('memMatched').textContent = matched;
      flipped = [];
      lock = false;
      render();
      if (matched === 8) setTimeout(() => alert(`You won in ${moves} moves! 🎉`), 200);
    } else {
      setTimeout(() => {
        flipped = [];
        lock = false;
        render();
      }, 800);
    }
  }

  function reset() {
    cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    flipped = [];
    matchedArr = [];
    matched = 0;
    moves = 0;
    lock = false;
    $('memMoves').textContent = 0;
    $('memMatched').textContent = 0;
    render();
  }

  $('memReset').addEventListener('click', reset);
  reset();
}

/* ---------- Tic-Tac-Toe ---------- */
function initTTT() {
  let board = Array(9).fill(null);
  let over = false;
  let winLine = null;

  gameStage.innerHTML = `
    <h3>Tic-tac-toe</h3>
    <p class="game-info" id="tttInfo">Your turn (X). The computer is playing O.</p>
    <div class="game-grid ttt-grid" id="tttGrid"></div>
    <div class="game-row"><button class="game-btn primary" id="tttReset" type="button">Restart</button></div>
  `;

  const grid = $('tttGrid');

  function render() {
    grid.innerHTML = '';
    board.forEach((value, index) => {
      const cell = document.createElement('div');
      cell.className = `ttt-cell${winLine && winLine.includes(index) ? ' win' : ''}`;
      cell.textContent = value || '';
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
    else $('tttInfo').textContent = 'Your turn (X).';
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
      for (const moveOption of moves) if (moveOption.score > best.score) best = moveOption;
      return best.index;
    }

    let best = moves[0];
    for (const moveOption of moves) if (moveOption.score < best.score) best = moveOption;
    return best.index;
  }

  function end(result) {
    over = true;
    winLine = result.line;
    render();
    const info = $('tttInfo');
    if (result.winner === 'draw') info.textContent = "It's a draw. 🤝";
    else if (result.winner === 'X') info.textContent = 'You win! 🎉';
    else info.textContent = 'The computer wins this one. 🤖';
  }

  function reset() {
    board = Array(9).fill(null);
    over = false;
    winLine = null;
    $('tttInfo').textContent = 'Your turn (X). The computer is playing O.';
    render();
  }

  $('tttReset').addEventListener('click', reset);
  render();
}

/* ---------- Reaction ---------- */
function initReaction() {
  gameStage.innerHTML = `
    <h3>Reaction time</h3>
    <p class="game-info">Wait for green, then click as fast as you can. Don't click early.</p>
    <div class="reaction-box" id="reactBox">Click to start</div>
    <p class="game-info" id="reactResult" aria-live="polite"></p>
  `;

  const box = $('reactBox');
  const result = $('reactResult');
  let state = 'idle';
  let start = 0;
  let timeout;

  box.addEventListener('click', () => {
    if (state === 'idle' || state === 'done') {
      state = 'waiting';
      box.className = 'reaction-box wait';
      box.textContent = 'Wait for green…';
      result.textContent = '';
      const delay = 1500 + Math.random() * 3000;
      timeout = setTimeout(() => {
        state = 'go';
        box.className = 'reaction-box go';
        box.textContent = 'CLICK NOW';
        start = performance.now();
      }, delay);
    } else if (state === 'waiting') {
      clearTimeout(timeout);
      state = 'idle';
      box.className = 'reaction-box';
      box.textContent = 'Too early! Click to retry';
      result.textContent = 'You clicked too early. 😅';
    } else if (state === 'go') {
      const ms = Math.round(performance.now() - start);
      state = 'done';
      box.className = 'reaction-box';
      box.textContent = 'Click to try again';
      result.textContent = `Your reaction time: ${ms} ms ${ms < 250 ? '⚡ Fast!' : ms < 400 ? '👍 Good' : '🐢 Slow'}`;
    }
  });
}

/* ---------- Rock Paper Scissors ---------- */
function initRPS() {
  const choices = ['✊', '✋', '✌️'];
  const names = ['Rock', 'Paper', 'Scissors'];

  gameStage.innerHTML = `
    <h3>Rock paper scissors</h3>
    <p class="game-info" id="rpsInfo">Pick your move.</p>
    <div class="rps-choices">
      ${choices.map((choice, index) => `<div class="rps-choice" data-i="${index}" role="button" tabindex="0" aria-label="${names[index]}">${choice}</div>`).join('')}
    </div>
    <p class="game-info" id="rpsResult" aria-live="polite"></p>
    <p class="game-info">Score — You: <span id="rpsYou">0</span> · CPU: <span id="rpsCpu">0</span></p>
  `;

  let you = 0;
  let cpu = 0;

  function choose(index) {
    const player = Number(index);
    const computer = Math.floor(Math.random() * 3);
    const outcome = (player - computer + 3) % 3;
    const info = $('rpsInfo');
    const result = $('rpsResult');

    info.textContent = `You: ${names[player]} ${choices[player]}  vs  CPU: ${names[computer]} ${choices[computer]}`;

    if (outcome === 0) result.textContent = "It's a draw. 🤝";
    else if (outcome === 1) { you += 1; result.textContent = 'You win! 🎉'; }
    else { cpu += 1; result.textContent = 'CPU wins. 🤖'; }

    $('rpsYou').textContent = you;
    $('rpsCpu').textContent = cpu;
  }

  document.querySelectorAll('.rps-choice').forEach((element) => {
    element.addEventListener('click', () => choose(element.dataset.i));
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose(element.dataset.i);
      }
    });
  });
}

/* ---------- Guess Number ---------- */
function initGuess() {
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
    <p class="game-info">Attempts: <span id="guessAttempts">0</span></p>
  `;

  const input = $('guessInput');
  const result = $('guessResult');
  const attemptsElement = $('guessAttempts');

  function guess() {
    const value = Number(input.value);
    if (!value || value < 1 || value > 100) {
      result.textContent = 'Enter a number from 1 to 100.';
      return;
    }
    attempts += 1;
    attemptsElement.textContent = attempts;

    if (value === target) result.textContent = `🎉 Correct! The number was ${target}. It took ${attempts} attempts.`;
    else if (value < target) result.textContent = `${value} is too low. Try higher. ⬆️`;
    else result.textContent = `${value} is too high. Try lower. ⬇️`;

    input.value = '';
    input.focus();
  }

  $('guessBtn').addEventListener('click', guess);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') guess();
  });

  $('guessReset').addEventListener('click', () => {
    target = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    attemptsElement.textContent = 0;
    result.textContent = 'New number picked. Guess again.';
    input.value = '';
    input.focus();
  });
}
