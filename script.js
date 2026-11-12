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
