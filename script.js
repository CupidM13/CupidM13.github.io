/* ============================================================
   Portfolio interactions
   ============================================================ */
const S = window.SITE || {};

/* ---------- Theme ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ---------- Mobile nav ---------- */
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ---------- Typing rotator ---------- */
const roles = [
  S.role || "Aspiring AI / ML Engineer",
  "Quant-minded builder",
  "IIT Delhi '26",
  "Lover of data & models",
];
const typingEl = document.getElementById('typingText');
let ri = 0, ci = 0, deleting = false;
function typeLoop() {
  const word = roles[ri];
  if (!deleting) {
    typingEl.textContent = word.slice(0, ci + 1);
    ci++;
    if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    typingEl.textContent = word.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

/* ---------- Hero fill ---------- */
document.getElementById('heroName').textContent = (S.name || "Cupid").split(' ')[0];
document.getElementById('heroTag').textContent = S.tagline || "";
const badge = document.getElementById('heroBadge');
if (!S.available) badge.style.display = 'none';

/* ---------- Counters ---------- */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.count;
    let v = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const t = setInterval(() => {
      v = Math.min(target, v + step);
      el.textContent = v;
      if (v >= target) clearInterval(t);
    }, 40);
  });
}
setTimeout(animateCounters, 600);

/* ---------- About ---------- */
document.getElementById('aboutText').textContent = S.about || "";
const eduList = document.getElementById('eduList');
if (S.education && S.education.length) {
  eduList.innerHTML = `<h3>Education</h3>` + S.education.map(e => `
    <div class="edu-item">
      <strong>${e.school}</strong>
      <span>${e.degree} · ${e.years}${e.grade ? ' · Grade: ' + e.grade : ''}${e.note ? ' · ' + e.note : ''}</span>
      ${e.activities ? `<span class="sub">Activities: ${e.activities}</span>` : ''}
      ${e.coursework && e.coursework.length ? `<span class="sub">Coursework: ${e.coursework.join(', ')}</span>` : ''}
    </div>
  `).join('');
}
const expList = document.getElementById('expList');
if (S.experience && S.experience.length) {
  expList.innerHTML = `<h3>Experience</h3>` + S.experience.map(e => `
    <div class="exp-item">
      <strong>${e.role} — ${e.org}${e.type ? ' · ' + e.type : ''}</strong>
      <span>${e.years}${e.location ? ' · ' + e.location : ''}${e.note ? ' · ' + e.note : ''}</span>
    </div>
  `).join('');
}
const facts = document.getElementById('funFacts');
(S.funFacts || []).forEach(f => {
  const d = document.createElement('div'); d.className = 'fact-card reveal'; d.textContent = f; facts.appendChild(d);
});

/* ---------- Skills ---------- */
const skillsGrid = document.getElementById('skillsGrid');
Object.entries(S.skills || {}).forEach(([cat, items]) => {
  const card = document.createElement('div'); card.className = 'skill-card reveal';
  card.innerHTML = `<h3>${cat}</h3><div class="skill-tags">${items.map(i => `<span class="tag">${i}</span>`).join('')}</div>`;
  skillsGrid.appendChild(card);
});

/* ---------- Projects ---------- */
const projectsGrid = document.getElementById('projectsGrid');
(S.projects || []).forEach(p => {
  const card = document.createElement('div'); card.className = 'project-card reveal';
  card.innerHTML = `
    <div class="project-inner">
      <span class="project-emoji">${p.emoji || '✨'}</span>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="project-tags">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <a class="project-link" href="${p.link||'#'}" target="_blank" rel="noopener">${p.link && p.link.startsWith('http') ? 'View project →' : 'Explore →'}</a>
    </div>`;
  projectsGrid.appendChild(card);
});

/* ---------- 3D tilt on project cards ---------- */
document.querySelectorAll('.project-card').forEach(card => {
  const inner = card.querySelector('.project-inner');
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    inner.style.transform = `rotateY(${x*12}deg) rotateX(${-y*12}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', () => { inner.style.transform = 'rotateY(0) rotateX(0)'; });
});

/* ---------- Contact links ---------- */
const cl = document.getElementById('contactLinks');
const L = S.links || {};
const linkDefs = [
  { key: 'github', label: 'GitHub', icon: '🐙' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { key: 'twitter', label: 'Twitter / X', icon: '🐦' },
  { key: 'kaggle', label: 'Kaggle', icon: '📊' },
  { key: 'resume', label: 'Resume (PDF)', icon: '📄' },
];
linkDefs.forEach(d => {
  if (L[d.key]) {
    const a = document.createElement('a');
    a.className = 'contact-link'; a.href = L[d.key]; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = `<span class="icon">${d.icon}</span><span>${d.label}</span>`;
    cl.appendChild(a);
  }
});
// email link
if (S.email) {
  const a = document.createElement('a');
  a.className = 'contact-link'; a.href = 'mailto:' + S.email;
  a.innerHTML = `<span class="icon">✉️</span><span>${S.email}</span>`;
  cl.appendChild(a);
}

/* ---------- Contact form ---------- */
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const fd = new FormData(contactForm);
  const name = (fd.get('name') || '').toString().trim();
  const email = (fd.get('email') || '').toString().trim();
  const msg = (fd.get('message') || '').toString().trim();
  if (!name || !email || !msg) {
    formNote.textContent = "Please fill in all fields.";
    formNote.style.color = "#ff6b6b";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formNote.textContent = "Please enter a valid email.";
    formNote.style.color = "#ff6b6b";
    return;
  }
  btn.disabled = true;
  btn.textContent = "Sending…";
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
  window.location.href = `mailto:${S.email}?subject=${subject}&body=${body}`;
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = "Send message →";
    formNote.style.color = "";
    formNote.textContent = "Thanks! Your email client should have opened with the message. If not, email me directly at " + S.email;
    contactForm.reset();
  }, 800);
});

/* ---------- Footer ---------- */
document.getElementById('footerName').textContent = S.name || "";
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Neural network background canvas ---------- */
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');
let nodes = [], W, H;
function resizeCanvas() {
  W = canvas.width = canvas.offsetWidth * devicePixelRatio;
  H = canvas.height = canvas.offsetHeight * devicePixelRatio;
  canvas.style.width = canvas.offsetWidth + 'px';
  canvas.style.height = canvas.offsetHeight + 'px';
  initNodes();
}
function initNodes() {
  const count = Math.min(70, Math.floor((W*H)/(devicePixelRatio*devicePixelRatio*18000)));
  nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4 });
  }
}
function drawNeural() {
  ctx.clearRect(0,0,W,H);
  // edges
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i+1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy);
      const maxD = 130 * devicePixelRatio;
      if (d < maxD) {
        ctx.strokeStyle = `rgba(108,140,255,${(1 - d/maxD)*0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
      }
    }
  }
  // nodes
  nodes.forEach(n => {
    ctx.fillStyle = 'rgba(176,108,255,0.9)';
    ctx.beginPath(); ctx.arc(n.x, n.y, 2*devicePixelRatio, 0, Math.PI*2); ctx.fill();
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });
  requestAnimationFrame(drawNeural);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawNeural();

/* ---------- Playground: single neuron ---------- */
const sigmoid = x => 1/(1+Math.exp(-x));
function bindSlider(id, vid, cb) {
  const el = document.getElementById(id), v = document.getElementById(vid);
  el.addEventListener('input', () => { v.textContent = (+el.value).toFixed(1); cb(); });
  cb();
}
function drawNeuron() {
  const c = document.getElementById('neuronCanvas'); const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  const x = +document.getElementById('nX').value;
  const w = +document.getElementById('nW').value;
  const b = +document.getElementById('nB').value;
  const z = w*x + b;
  const out = sigmoid(z);
  document.getElementById('nZ').textContent = z.toFixed(2);
  document.getElementById('nOut').textContent = out.toFixed(3);

  // draw sigmoid curve
  ctx.strokeStyle = 'rgba(108,140,255,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= W; i++) {
    const xx = (i/W)*6 - 3;
    const yy = sigmoid(xx);
    const px = i, py = H - yy*H*0.8 - H*0.1;
    if (i === 0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.stroke();
  // axes
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
  // point
  const px = ((z+3)/6)*W;
  const py = H - out*H*0.8 - H*0.1;
  ctx.fillStyle = '#5cf0d0';
  ctx.beginPath(); ctx.arc(Math.min(W,Math.max(0,px)), py, 6, 0, Math.PI*2); ctx.fill();
  // label
  ctx.fillStyle = '#e8eaf2'; ctx.font = '12px JetBrains Mono, monospace';
  ctx.fillText(`z=${z.toFixed(2)}`, px+8, py-8);
}
bindSlider('nX','nXv',drawNeuron);
bindSlider('nW','nWv',drawNeuron);
bindSlider('nB','nBv',drawNeuron);

/* ---------- Playground: tiny MLP ---------- */
let weights = null;
function initWeights() {
  // 2 inputs -> 3 hidden -> 1 output
  weights = {
    w1: Array.from({length:3}, ()=> Array.from({length:2}, ()=> (Math.random()*2-1))),
    b1: Array.from({length:3}, ()=> Math.random()*2-1),
    w2: Array.from({length:3}, ()=> Math.random()*2-1),
    b2: Math.random()*2-1,
  };
}
initWeights();
function mlpForward(x1, x2) {
  const h = weights.w1.map((row, i) => sigmoid(row[0]*x1 + row[1]*x2 + weights.b1[i]));
  const z = weights.w2.reduce((s, w, i) => s + w*h[i], 0) + weights.b2;
  return { h, out: sigmoid(z) };
}
function drawMLP() {
  const c = document.getElementById('mlpCanvas'); const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);
  const x1 = +document.getElementById('mX1').value;
  const x2 = +document.getElementById('mX2').value;
  document.getElementById('mX1v').textContent = x1.toFixed(1);
  document.getElementById('mX2v').textContent = x2.toFixed(1);
  const { h, out } = mlpForward(x1, x2);
  document.getElementById('mH').textContent = h.map(v=>v.toFixed(2)).join(', ');
  document.getElementById('mOut').textContent = out.toFixed(3);

  // layout
  const leftX = 40, midX = W/2, rightX = W-40;
  const inpY = [H*0.3, H*0.7];
  const hidY = [H*0.2, H*0.5, H*0.8];
  const outY = H/2;
  // edges input->hidden
  for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) {
    const w = weights.w1[j][i];
    ctx.strokeStyle = w > 0 ? `rgba(92,240,208,${Math.min(1,Math.abs(w)/2)})` : `rgba(176,108,255,${Math.min(1,Math.abs(w)/2)})`;
    ctx.lineWidth = Math.min(3, Math.abs(w)+0.5);
    ctx.beginPath(); ctx.moveTo(leftX, inpY[i]); ctx.lineTo(midX, hidY[j]); ctx.stroke();
  }
  // edges hidden->output
  for (let j = 0; j < 3; j++) {
    const w = weights.w2[j];
    ctx.strokeStyle = w > 0 ? `rgba(92,240,208,${Math.min(1,Math.abs(w)/2)})` : `rgba(176,108,255,${Math.min(1,Math.abs(w)/2)})`;
    ctx.lineWidth = Math.min(3, Math.abs(w)+0.5);
    ctx.beginPath(); ctx.moveTo(midX, hidY[j]); ctx.lineTo(rightX, outY); ctx.stroke();
  }
  // nodes
  function node(x,y,val,color) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x,y,16,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#0a0b14'; ctx.font = 'bold 11px JetBrains Mono, monospace'; ctx.textAlign = 'center';
    ctx.fillText(val.toFixed(2), x, y+4);
    ctx.textAlign = 'left';
  }
  node(leftX, inpY[0], x1, '#6c8cff');
  node(leftX, inpY[1], x2, '#6c8cff');
  hidY.forEach((y,j) => node(midX, y, h[j], '#b06cff'));
  node(rightX, outY, out, '#5cf0d0');
}
['mX1','mX2'].forEach(id => document.getElementById(id).addEventListener('input', drawMLP));
document.getElementById('randomizeWeights').addEventListener('click', () => { initWeights(); drawMLP(); });
drawMLP();
setInterval(() => { /* gentle idle pulse handled by slider redraws */ }, 1000);

/* ============================================================
   VISUAL ENHANCEMENTS
   ============================================================ */

/* ---- scroll progress bar ---- */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  scrollProgress.style.width = pct + '%';
  const btt = document.getElementById('backToTop');
  if (h.scrollTop > 400) btt.classList.add('show'); else btt.classList.remove('show');
});
document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- custom cursor ---- */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
function cursorLoop() {
  cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px';
  rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
  requestAnimationFrame(cursorLoop);
}
cursorLoop();
document.querySelectorAll('a, button, .project-card, .game-tab, .ttt-cell, .memory-card, .rps-choice').forEach(el => {
  el.addEventListener('mouseenter', () => { cursorRing.style.width = '52px'; cursorRing.style.height = '52px'; });
  el.addEventListener('mouseleave', () => { cursorRing.style.width = '34px'; cursorRing.style.height = '34px'; });
});

/* ---- matrix rain (easter egg) ---- */
const matrixCanvas = document.getElementById('matrixCanvas');
const mctx = matrixCanvas.getContext('2d');
let matrixOn = false, matrixCols = [], matrixFontSize = 14;
function resizeMatrix() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  const cols = Math.floor(matrixCanvas.width / matrixFontSize);
  matrixCols = Array(cols).fill(1);
}
resizeMatrix();
window.addEventListener('resize', resizeMatrix);
const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>{}[]';
function drawMatrix() {
  if (!matrixOn) { requestAnimationFrame(drawMatrix); return; }
  mctx.fillStyle = 'rgba(10,11,20,0.08)';
  mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  mctx.fillStyle = '#5cf0d0';
  mctx.font = matrixFontSize + 'px monospace';
  matrixCols.forEach((y, i) => {
    const ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    mctx.fillText(ch, i * matrixFontSize, y * matrixFontSize);
    if (y * matrixFontSize > matrixCanvas.height && Math.random() > 0.975) matrixCols[i] = 0;
    matrixCols[i]++;
  });
  requestAnimationFrame(drawMatrix);
}
drawMatrix();

/* ---- Konami code ---- */
const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
window.addEventListener('keydown', (e) => {
  if (e.key === konamiSeq[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === konamiSeq.length) {
      konamiIdx = 0;
      matrixOn = !matrixOn;
      matrixCanvas.classList.toggle('show', matrixOn);
      document.getElementById('konamiOverlay').classList.add('show');
    }
  } else {
    konamiIdx = 0;
  }
});
document.getElementById('konamiClose').addEventListener('click', () => {
  document.getElementById('konamiOverlay').classList.remove('show');
});

/* ============================================================
   MINI-GAMES ARCADE
   ============================================================ */
const gameTabs = document.getElementById('gameTabs');
const gameStage = document.getElementById('gameStage');
const games = [
  { id: 'snake', name: '🐍 Snake' },
  { id: 'memory', name: '🃏 Memory' },
  { id: 'ttt', name: '⭕ Tic-Tac-Toe' },
  { id: 'reaction', name: '⚡ Reaction' },
  { id: 'rps', name: '✂️ Rock Paper Scissors' },
  { id: 'guess', name: '🎯 Guess Number' },
];
let activeGame = null;
games.forEach(g => {
  const btn = document.createElement('button');
  btn.className = 'game-tab';
  btn.textContent = g.name;
  btn.dataset.id = g.id;
  btn.addEventListener('click', () => loadGame(g.id));
  gameTabs.appendChild(btn);
});
function loadGame(id) {
  document.querySelectorAll('.game-tab').forEach(t => t.classList.toggle('active', t.dataset.id === id));
  gameStage.innerHTML = '';
  activeGame = id;
  if (id === 'snake') initSnake();
  else if (id === 'memory') initMemory();
  else if (id === 'ttt') initTTT();
  else if (id === 'reaction') initReaction();
  else if (id === 'rps') initRPS();
  else if (id === 'guess') initGuess();
}
// load first game
loadGame('snake');

/* ---------- Snake ---------- */
function initSnake() {
  gameStage.innerHTML = `
    <h3>Snake</h3>
    <p class="game-info">Arrow keys / WASD on desktop. Swipe or use the D-pad on mobile.</p>
    <div class="game-row">
      <span class="snake-score">Score: <span id="snakeScore">0</span></span>
      <button class="game-btn primary" id="snakeStart">Start / Restart</button>
    </div>
    <canvas id="snakeCanvas" class="game-canvas" width="360" height="360"></canvas>
    <div class="dpad" id="snakeDpad">
      <div></div><button class="dpad-btn" data-dir="up">▲</button><div></div>
      <button class="dpad-btn" data-dir="left">◀</button><div></div><button class="dpad-btn" data-dir="right">▶</button>
      <div></div><button class="dpad-btn" data-dir="down">▼</button><div></div>
    </div>
  `;
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const grid = 18, cols = canvas.width / grid, rows = canvas.height / grid;
  let snake, dir, food, score, loop, running = false;
  function reset() {
    snake = [{ x: 10, y: 10 }]; dir = { x: 1, y: 0 }; score = 0;
    placeFood(); updateScore();
  }
  function placeFood() {
    do { food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) }; }
    while (snake.some(s => s.x === food.x && s.y === food.y));
  }
  function updateScore() { document.getElementById('snakeScore').textContent = score; }
  function draw() {
    ctx.fillStyle = '#11131f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let i = 0; i <= cols; i++) { ctx.beginPath(); ctx.moveTo(i*grid,0); ctx.lineTo(i*grid,canvas.height); ctx.stroke(); }
    for (let j = 0; j <= rows; j++) { ctx.beginPath(); ctx.moveTo(0,j*grid); ctx.lineTo(canvas.width,j*grid); ctx.stroke(); }
    // food
    ctx.fillStyle = '#5cf0d0';
    ctx.beginPath(); ctx.arc(food.x*grid+grid/2, food.y*grid+grid/2, grid/2-2, 0, Math.PI*2); ctx.fill();
    // snake
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#6c8cff' : '#b06cff';
      ctx.fillRect(s.x*grid+1, s.y*grid+1, grid-2, grid-2);
    });
  }
  function step() {
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(s => s.x === head.x && s.y === head.y)) {
      running = false; clearInterval(loop);
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 24px Space Grotesk, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Game Over', canvas.width/2, canvas.height/2);
      ctx.font = '14px Inter, sans-serif'; ctx.fillText('Score: ' + score, canvas.width/2, canvas.height/2 + 28);
      ctx.textAlign = 'left';
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) { score++; updateScore(); placeFood(); }
    else snake.pop();
    draw();
  }
  function start() { reset(); draw(); if (loop) clearInterval(loop); running = true; loop = setInterval(step, 120); }
  document.getElementById('snakeStart').addEventListener('click', start);
  window.addEventListener('keydown', snakeKey);
  // D-pad (mobile)
  const dpadMap = { up: {x:0,y:-1}, down: {x:0,y:1}, left: {x:-1,y:0}, right: {x:1,y:0} };
  document.querySelectorAll('#snakeDpad .dpad-btn').forEach(btn => {
    const handler = (e) => {
      e.preventDefault();
      if (!running) return;
      const nd = dpadMap[btn.dataset.dir];
      if (nd && !(nd.x === -dir.x && nd.y === -dir.y)) dir = nd;
    };
    btn.addEventListener('touchstart', handler, { passive: false });
    btn.addEventListener('click', handler);
  });
  // Swipe on canvas
  let touchStart = null;
  canvas.addEventListener('touchstart', (e) => { const t = e.touches[0]; touchStart = { x: t.clientX, y: t.clientY }; e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchend', (e) => {
    if (!touchStart || !running) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x, dy = t.clientY - touchStart.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    let nd;
    if (Math.abs(dx) > Math.abs(dy)) nd = dx > 0 ? {x:1,y:0} : {x:-1,y:0};
    else nd = dy > 0 ? {x:0,y:1} : {x:0,y:-1};
    if (!(nd.x === -dir.x && nd.y === -dir.y)) dir = nd;
    touchStart = null;
  }, { passive: false });
  function snakeKey(e) {
    if (!running || activeGame !== 'snake') return;
    const map = { ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0},
                  w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0} };
    const nd = map[e.key];
    if (nd && !(nd.x === -dir.x && nd.y === -dir.y)) { dir = nd; e.preventDefault(); }
  }
  reset(); draw();
}

/* ---------- Memory ---------- */
function initMemory() {
  const emojis = ['🧠','🤖','📊','🚀','💡','🔥','🎯','⚡'];
  let cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  let flipped = [], matched = 0, moves = 0, lock = false;
  gameStage.innerHTML = `
    <h3>Memory Match</h3>
    <p class="game-info">Moves: <span id="memMoves">0</span> · Matched: <span id="memMatched">0</span>/8</p>
    <div class="game-grid" id="memGrid" style="grid-template-columns: repeat(4, 70px);"></div>
    <div class="game-row"><button class="game-btn primary" id="memReset">Shuffle & Restart</button></div>
  `;
  const grid = document.getElementById('memGrid');
  function render() {
    grid.innerHTML = '';
    cards.forEach((c, i) => {
      const d = document.createElement('div');
      d.className = 'memory-card';
      if (flipped.includes(i) || matchedArr.includes(i)) { d.textContent = c; d.classList.add('flipped'); }
      if (matchedArr.includes(i)) d.classList.add('matched');
      d.addEventListener('click', () => flip(i));
      grid.appendChild(d);
    });
  }
  let matchedArr = [];
  function flip(i) {
    if (lock || flipped.includes(i) || matchedArr.includes(i)) return;
    flipped.push(i); render();
    if (flipped.length === 2) {
      moves++; document.getElementById('memMoves').textContent = moves;
      lock = true;
      const [a, b] = flipped;
      if (cards[a] === cards[b]) {
        matchedArr.push(a, b); matched++;
        document.getElementById('memMatched').textContent = matched;
        flipped = []; lock = false; render();
        if (matched === 8) setTimeout(() => alert('You won in ' + moves + ' moves! 🎉'), 200);
      } else {
        setTimeout(() => { flipped = []; lock = false; render(); }, 800);
      }
    }
  }
  function reset() {
    cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    flipped = []; matchedArr = []; matched = 0; moves = 0; lock = false;
    document.getElementById('memMoves').textContent = 0;
    document.getElementById('memMatched').textContent = 0;
    render();
  }
  document.getElementById('memReset').addEventListener('click', reset);
  reset();
}

/* ---------- Tic-Tac-Toe ---------- */
function initTTT() {
  let board = Array(9).fill(null), over = false;
  gameStage.innerHTML = `
    <h3>Tic-Tac-Toe (vs AI)</h3>
    <p class="game-info" id="tttInfo">Your turn (X)</p>
    <div class="game-grid" id="tttGrid" style="grid-template-columns: repeat(3, 70px);"></div>
    <div class="game-row"><button class="game-btn primary" id="tttReset">Restart</button></div>
  `;
  const grid = document.getElementById('tttGrid');
  function render() {
    grid.innerHTML = '';
    board.forEach((v, i) => {
      const c = document.createElement('div');
      c.className = 'ttt-cell' + (winLine && winLine.includes(i) ? ' win' : '');
      c.textContent = v || '';
      c.addEventListener('click', () => move(i));
      grid.appendChild(c);
    });
  }
  let winLine = null;
  function checkWinner(b) {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const l of lines) if (b[l[0]] && b[l[0]]===b[l[1]] && b[l[1]]===b[l[2]]) return { w: b[l[0]], line: l };
    if (b.every(x => x)) return { w: 'draw', line: null };
    return null;
  }
  function move(i) {
    if (over || board[i]) return;
    board[i] = 'X';
    let r = checkWinner(board);
    if (r) { end(r); return; }
    // AI move (minimax)
    const best = minimax(board, 'O');
    board[best] = 'O';
    r = checkWinner(board);
    if (r) end(r);
    else document.getElementById('tttInfo').textContent = 'Your turn (X)';
    render();
  }
  function minimax(b, player) {
    const r = checkWinner(b);
    if (r) {
      if (r.w === 'O') return 10;
      if (r.w === 'X') return -10;
      return 0;
    }
    const moves = [];
    b.forEach((v, i) => {
      if (!v) {
        b[i] = player;
        moves.push({ i, score: minimax(b, player === 'O' ? 'X' : 'O') });
        b[i] = null;
      }
    });
    if (player === 'O') {
      let best = moves[0]; for (const m of moves) if (m.score > best.score) best = m; return best.i;
    } else {
      let best = moves[0]; for (const m of moves) if (m.score < best.score) best = m; return best.i;
    }
  }
  function end(r) {
    over = true; winLine = r.line; render();
    const info = document.getElementById('tttInfo');
    if (r.w === 'draw') info.textContent = "It's a draw! 🤝";
    else if (r.w === 'X') info.textContent = 'You win! 🎉';
    else info.textContent = 'AI wins! 🤖';
  }
  function reset() { board = Array(9).fill(null); over = false; winLine = null; document.getElementById('tttInfo').textContent = 'Your turn (X)'; render(); }
  document.getElementById('tttReset').addEventListener('click', reset);
  render();
}

/* ---------- Reaction ---------- */
function initReaction() {
  gameStage.innerHTML = `
    <h3>Reaction Time</h3>
    <p class="game-info">Wait for green, then click as fast as you can. Don't click early!</p>
    <div class="reaction-box" id="reactBox">Click to start</div>
    <p class="game-info" id="reactResult"></p>
  `;
  const box = document.getElementById('reactBox');
  const result = document.getElementById('reactResult');
  let state = 'idle', start = 0, timeout;
  box.addEventListener('click', () => {
    if (state === 'idle' || state === 'done') {
      state = 'waiting'; box.className = 'reaction-box wait'; box.textContent = 'Wait for green...';
      result.textContent = '';
      const delay = 1500 + Math.random() * 3000;
      timeout = setTimeout(() => {
        state = 'go'; box.className = 'reaction-box go'; box.textContent = 'CLICK NOW!';
        start = performance.now();
      }, delay);
    } else if (state === 'waiting') {
      clearTimeout(timeout); state = 'idle'; box.className = 'reaction-box'; box.textContent = 'Too early! Click to retry';
      result.textContent = 'You clicked too early. 😅';
    } else if (state === 'go') {
      const ms = Math.round(performance.now() - start);
      state = 'done'; box.className = 'reaction-box'; box.textContent = 'Click to try again';
      result.textContent = `Your reaction time: ${ms} ms ${ms < 250 ? '⚡ Fast!' : ms < 400 ? '👍 Good' : '🐢 Slow'}`;
    }
  });
}

/* ---------- Rock Paper Scissors ---------- */
function initRPS() {
  const choices = ['✊', '✋', '✌️'];
  const names = ['Rock', 'Paper', 'Scissors'];
  gameStage.innerHTML = `
    <h3>Rock Paper Scissors</h3>
    <p class="game-info" id="rpsInfo">Pick your move</p>
    <div class="rps-choices">
      ${choices.map((c, i) => `<div class="rps-choice" data-i="${i}">${c}</div>`).join('')}
    </div>
    <p class="game-info" id="rpsResult"></p>
    <p class="game-info">Score — You: <span id="rpsYou">0</span> · CPU: <span id="rpsCpu">0</span></p>
  `;
  let you = 0, cpu = 0;
  document.querySelectorAll('.rps-choice').forEach(el => {
    el.addEventListener('click', () => {
      const p = +el.dataset.i;
      const c = Math.floor(Math.random() * 3);
      const res = (p - c + 3) % 3;
      const info = document.getElementById('rpsInfo');
      const r = document.getElementById('rpsResult');
      info.textContent = `You: ${names[p]} ${choices[p]}  vs  CPU: ${names[c]} ${choices[c]}`;
      if (res === 0) r.textContent = "It's a draw! 🤝";
      else if (res === 1) { you++; r.textContent = 'You win! 🎉'; }
      else { cpu++; r.textContent = 'CPU wins! 🤖'; }
      document.getElementById('rpsYou').textContent = you;
      document.getElementById('rpsCpu').textContent = cpu;
    });
  });
}

/* ---------- Guess Number ---------- */
function initGuess() {
  let target = Math.floor(Math.random() * 100) + 1, attempts = 0;
  gameStage.innerHTML = `
    <h3>Guess the Number</h3>
    <p class="game-info">I'm thinking of a number between 1 and 100.</p>
    <div class="game-row">
      <input type="number" id="guessInput" min="1" max="100" placeholder="Your guess" style="width:120px;padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg-soft);color:var(--fg);">
      <button class="game-btn primary" id="guessBtn">Guess</button>
      <button class="game-btn" id="guessReset">New number</button>
    </div>
    <p class="game-info" id="guessResult"></p>
    <p class="game-info">Attempts: <span id="guessAttempts">0</span></p>
  `;
  const input = document.getElementById('guessInput');
  const result = document.getElementById('guessResult');
  const attemptsEl = document.getElementById('guessAttempts');
  function guess() {
    const v = +input.value;
    if (!v || v < 1 || v > 100) { result.textContent = 'Enter a number 1–100.'; return; }
    attempts++; attemptsEl.textContent = attempts;
    if (v === target) result.textContent = `🎉 Correct! The number was ${target}. It took ${attempts} attempts.`;
    else if (v < target) result.textContent = `${v} is too low. Try higher! ⬆️`;
    else result.textContent = `${v} is too high. Try lower! ⬇️`;
    input.value = ''; input.focus();
  }
  document.getElementById('guessBtn').addEventListener('click', guess);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') guess(); });
  document.getElementById('guessReset').addEventListener('click', () => {
    target = Math.floor(Math.random() * 100) + 1; attempts = 0;
    attemptsEl.textContent = 0; result.textContent = 'New number picked. Guess again!';
    input.value = ''; input.focus();
  });
}
