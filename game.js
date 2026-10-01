/* ==================== PHẦN 2: GAME FLAPPY VƯƠNG (v2) ==================== */
const canvas = document.getElementById("birdGame");
const ctx = canvas.getContext("2d");

const GROUND_H = 24;
const PLAY_H = canvas.height - GROUND_H;
const PIPE_W = 35;
const PIPE_SPACING = 170;

let bird = { x: 50, y: 120, radius: 14, velocity: 0, gravity: 0.25, jump: -4.5 };
let pipes = [];
let particles = [];
let clouds = [];
let score = 0;
let highScore = 0;
try { highScore = parseInt(localStorage.getItem("flappyHighScore")) || 0; } catch (e) {}
let bestAtStart = highScore;

let gameOver = false;
let started = false;
let gameOverTime = 0;
let idleT = 0;
let groundX = 0;
let shake = 0;
let flash = 0;
let scorePop = 0;

// Bầu trời đổi màu mỗi 10 điểm: ngày -> hoàng hôn -> đêm
const SKIES = [
  ["#70a1ff", "#a5d8ff"],
  ["#ff9f68", "#ffd89b"],
  ["#1e2a5a", "#4a5fa8"]
];
let skyCur = [SKIES[0][0], SKIES[0][1]];

for (let i = 0; i < 4; i++) {
  clouds.push({ x: Math.random() * canvas.width, y: 20 + Math.random() * 120, s: 0.6 + Math.random() * 0.8 });
}

/* ---------- Tiện ích ---------- */
function safeSound(name) { try { playSound(name); } catch (e) {} }

function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
function mixColor(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return "#" + c.map(v => v.toString(16).padStart(2, "0")).join("");
}

function spawnParticles(x, y, n, colors, power) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = (0.5 + Math.random()) * power;
    particles.push({
      x: x, y: y,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1,
      life: 30 + Math.random() * 20, max: 50,
      size: 2 + Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

/* ---------- Điều khiển ---------- */
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    e.preventDefault();
    if (!e.repeat) flap();
  }
});
canvas.addEventListener("touchstart", function (e) { e.preventDefault(); flap(); });
canvas.addEventListener("mousedown", flap);

function flap() {
  if (gameOver) {
    if (performance.now() - gameOverTime > 500) resetFlappy();
    return;
  }
  started = true;
  bird.velocity = bird.jump;
  spawnParticles(bird.x - 10, bird.y + 8, 3, ["#ffffff", "#dfe6e9"], 1);
}

function die() {
  if (gameOver) return;
  gameOver = true;
  gameOverTime = performance.now();
  shake = 12;
  flash = 1;
  bird.velocity = -3;
  spawnParticles(bird.x, bird.y, 22, ["#ff4757", "#ffffff", "#ffb6c1"], 3);
  safeSound("hit");
}

function resetFlappy() {
  safeSound("click");
  bird.y = 120;
  bird.velocity = 0;
  pipes = [];
  particles = [];
  score = 0;
  bestAtStart = highScore;
  started = false;
  gameOver = false;
}

/* ---------- Độ khó theo điểm ---------- */
function currentSpeed() { return 2 + Math.min(score * 0.04, 1.4); }
function currentGap() { return Math.max(82, 106 - score * 1.1); }

function spawnPipe() {
  const gap = currentGap();
  const minPipe = 30;
  const moving = score >= 10;
  const amp = moving ? 12 + Math.random() * 16 : 0;
  const lo = minPipe + amp;
  const hi = PLAY_H - gap - minPipe - amp;
  const base = lo + Math.random() * Math.max(hi - lo, 1);
  pipes.push({
    x: canvas.width,
    base: base, top: base, gap: gap,
    amp: amp, phase: Math.random() * Math.PI * 2, age: 0,
    passed: false
  });
}

/* ---------- Update ---------- */
function updateFlappy(dt) {
  // Hiệu ứng luôn chạy
  for (let p of particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 0.12 * dt;
    p.life -= dt;
  }
  particles = particles.filter(p => p.life > 0);

  if (shake > 0) shake = Math.max(0, shake - dt * 0.8);
  if (flash > 0) flash = Math.max(0, flash - dt * 0.08);
  if (scorePop > 0) scorePop = Math.max(0, scorePop - dt * 0.08);

  // Mây và nền trời
  if (!gameOver) {
    for (let c of clouds) {
      c.x -= c.s * 0.3 * dt;
      if (c.x < -60) { c.x = canvas.width + 20; c.y = 20 + Math.random() * 120; }
    }
    groundX = (groundX - currentSpeed() * dt) % 24;
  }
  const target = SKIES[Math.floor(score / 10) % SKIES.length];
  skyCur[0] = mixColor(skyCur[0], target[0], 0.02);
  skyCur[1] = mixColor(skyCur[1], target[1], 0.02);

  // Chết rồi: chim rơi xuống đất rồi nằm im
  if (gameOver) {
    if (bird.y + bird.radius < PLAY_H) {
      bird.velocity += bird.gravity * dt;
      bird.y += bird.velocity * dt;
      if (bird.y + bird.radius > PLAY_H) bird.y = PLAY_H - bird.radius;
    }
    return;
  }

  // Chưa bắt đầu: chim bay lơ lửng
  if (!started) {
    idleT += dt * 0.08;
    bird.y = 120 + Math.sin(idleT) * 4;
    return;
  }

  bird.velocity += bird.gravity * dt;
  bird.y += bird.velocity * dt;

  if (bird.y + bird.radius >= PLAY_H || bird.y - bird.radius <= 0) die();

  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - PIPE_SPACING) {
    spawnPipe();
  }

  const speed = currentSpeed();
  for (let p of pipes) {
    p.x -= speed * dt;
    p.age += dt;
    if (p.amp > 0) p.top = p.base + Math.sin(p.age * 0.04 + p.phase) * p.amp;

    if (
      bird.x + bird.radius > p.x - 3 &&
      bird.x - bird.radius < p.x + PIPE_W + 3 &&
      (bird.y - bird.radius < p.top || bird.y + bird.radius > p.top + p.gap)
    ) die();

    if (!p.passed && p.x + PIPE_W < bird.x) {
      p.passed = true;
      score++;
      scorePop = 1;
      safeSound("score");
      spawnParticles(bird.x + 14, bird.y, 6, ["#feca57", "#fff200", "#ffffff"], 1.6);
      if (score > highScore) {
        highScore = score;
        try { localStorage.setItem("flappyHighScore", highScore); } catch (e) {}
      }
    }
  }
  pipes = pipes.filter(p => p.x > -PIPE_W - 10);
}

/* ---------- Vẽ ---------- */
function drawMushroomCatFallback(x, y, velocity) {
  ctx.save();
  ctx.translate(x, y);

  let angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, velocity * 0.1));
  ctx.rotate(angle);

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(-10, -5); ctx.lineTo(-14, -15); ctx.lineTo(-4, -10);
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(4, -10); ctx.lineTo(14, -15); ctx.lineTo(10, -5);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#ffb6c1";
  ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(-12, -13); ctx.lineTo(-5, -9); ctx.fill();
  ctx.beginPath(); ctx.moveTo(5, -9); ctx.lineTo(12, -13); ctx.lineTo(9, -6); ctx.fill();

  ctx.fillStyle = "#ff4757";
  ctx.strokeStyle = "#222";
  ctx.beginPath();
  ctx.arc(0, -6, 15, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.arc(-7, -13, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -16, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(7, -12, 2.5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#222";
  ctx.beginPath();
  ctx.arc(0, 4, 12, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#222";
  if (gameOver) {
    // Mắt chữ X khi thua
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-7, 0); ctx.lineTo(-3, 4); ctx.moveTo(-3, 0); ctx.lineTo(-7, 4);
    ctx.moveTo(3, 0); ctx.lineTo(7, 4); ctx.moveTo(7, 0); ctx.lineTo(3, 4);
    ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(-5, 2, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, 2, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(-5.5, 1.2, 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4.5, 1.2, 0.8, 0, Math.PI * 2); ctx.fill();
  }

  ctx.fillStyle = "rgba(255, 105, 180, 0.6)";
  ctx.beginPath(); ctx.arc(-8, 5, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(8, 5, 2, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-2, 6, 1.8, 0, Math.PI, false);
  ctx.arc(2, 6, 1.8, 0, Math.PI, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-11, 4); ctx.lineTo(-16, 2);
  ctx.moveTo(-11, 6); ctx.lineTo(-16, 7);
  ctx.moveTo(11, 4); ctx.lineTo(16, 2);
  ctx.moveTo(11, 6); ctx.lineTo(16, 7);
  ctx.stroke();

  ctx.restore();
}

/* ---------- Hình nhân vật (logo.png) ---------- */
const birdImg = new Image();
let birdImgReady = false;
birdImg.onload = function () { birdImgReady = true; };
birdImg.src = "logo.png"; // đổi đường dẫn nếu bạn để ảnh ở thư mục khác

function drawMushroomCat(x, y, velocity) {
  if (!birdImgReady) { drawMushroomCatFallback(x, y, velocity); return; }

  const h = 42;
  const w = h * birdImg.width / birdImg.height;

  ctx.save();
  ctx.translate(x, y);
  let angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, velocity * 0.1));
  ctx.rotate(angle);
  if (gameOver) ctx.globalAlpha = 0.85;
  ctx.drawImage(birdImg, -w / 2, -h / 2 - 2, w, h);
  ctx.restore();
}

function drawCloud(c) {
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.arc(c.x, c.y, 12 * c.s, 0, Math.PI * 2);
  ctx.arc(c.x + 14 * c.s, c.y + 3, 10 * c.s, 0, Math.PI * 2);
  ctx.arc(c.x - 14 * c.s, c.y + 4, 9 * c.s, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipeBody(x, y, w, h) {
  if (h <= 0) return;
  ctx.fillStyle = "#2ed573";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillRect(x + 5, y, 5, h);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(x + w - 8, y, 8, h);
  ctx.strokeRect(x, y, w, h);
}

function drawPipeCap(x, y) {
  ctx.fillStyle = "#26c168";
  ctx.fillRect(x - 3, y, PIPE_W + 6, 12);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillRect(x + 2, y, 5, 12);
  ctx.strokeRect(x - 3, y, PIPE_W + 6, 12);
}

function drawMedal(cx, cy, s) {
  let color = null;
  if (s >= 20) color = "#feca57";
  else if (s >= 10) color = "#dfe6e9";
  else if (s >= 5) color = "#cd7f32";
  if (!color) return;
  ctx.fillStyle = color;
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.beginPath(); ctx.arc(cx - 4, cy - 4, 4, 0, Math.PI * 2); ctx.fill();
}

function drawFlappy() {
  ctx.save();
  if (shake > 0) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

  // Nền trời
  const g = ctx.createLinearGradient(0, 0, 0, PLAY_H);
  g.addColorStop(0, skyCur[0]);
  g.addColorStop(1, skyCur[1]);
  ctx.fillStyle = g;
  ctx.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);

  clouds.forEach(drawCloud);

  // Ống
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  pipes.forEach(p => {
    drawPipeBody(p.x, 0, PIPE_W, p.top);
    drawPipeCap(p.x, p.top - 12);

    const by = p.top + p.gap;
    drawPipeBody(p.x, by, PIPE_W, PLAY_H - by);
    drawPipeCap(p.x, by);
  });

  // Mặt đất
  ctx.fillStyle = "#e0c58f";
  ctx.fillRect(-10, PLAY_H, canvas.width + 20, GROUND_H + 10);
  ctx.fillStyle = "#6ab04c";
  ctx.fillRect(-10, PLAY_H, canvas.width + 20, 6);
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  for (let x = groundX - 24; x < canvas.width + 24; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, PLAY_H + 6); ctx.lineTo(x + 12, PLAY_H + 6); ctx.lineTo(x, PLAY_H + 18);
    ctx.closePath(); ctx.fill();
  }
  ctx.strokeStyle = "#000";
  ctx.beginPath(); ctx.moveTo(-10, PLAY_H); ctx.lineTo(canvas.width + 10, PLAY_H); ctx.stroke();

  // Hạt hiệu ứng + chim
  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  ctx.globalAlpha = 1;

  drawMushroomCat(bird.x, bird.y, bird.velocity);
  ctx.restore();

  // Điểm lớn ở giữa (phóng to nhẹ khi ghi điểm)
  if (!gameOver) {
    const sc = 1 + scorePop * 0.35;
    ctx.save();
    ctx.translate(canvas.width / 2, 45);
    ctx.scale(sc, sc);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.font = "bold 30px Poppins";
    ctx.textAlign = "center";
    ctx.strokeText(score, 0, 0);
    ctx.fillText(score, 0, 0);
    ctx.restore();
  }

  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px Poppins";
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 3;
  ctx.textAlign = "left";
  ctx.fillText("Kỷ lục: " + highScore, 10, 20);
  ctx.shadowBlur = 0;

  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMedal(canvas.width / 2, 95, score);

    ctx.fillStyle = "#ff4757";
    ctx.font = "bold 20px Poppins";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", canvas.width / 2, 140);

    ctx.fillStyle = "#fff";
    ctx.font = "12px Poppins";
    ctx.fillText("Điểm: " + score + " | Kỷ lục: " + highScore, canvas.width / 2, 170);

    if (score > bestAtStart && score > 0) {
      ctx.fillStyle = "#feca57";
      ctx.font = "bold 13px Poppins";
      ctx.fillText("🏆 KỶ LỤC MỚI!", canvas.width / 2, 190);
      ctx.fillStyle = "#fff";
      ctx.font = "12px Poppins";
      ctx.fillText("Chạm màn hình để chơi lại", canvas.width / 2, 212);
    } else {
      ctx.fillText("Chạm màn hình để chơi lại", canvas.width / 2, 195);
    }
    ctx.textAlign = "left";
  }

  // Chớp trắng khi chết
  if (flash > 0) {
    ctx.fillStyle = "rgba(255,255,255," + (flash * 0.6) + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/* ---------- Vòng lặp ---------- */
let lastTime = performance.now();
function gameLoop(now) {
  const dt = Math.min((now - lastTime) / 16.67, 2); // 1 = một frame ở 60Hz
  lastTime = now;
  updateFlappy(dt);
  drawFlappy();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
