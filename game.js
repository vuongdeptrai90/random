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

// ---------- Nhạc nền (đặt file theme.mp3 cạnh index.html) ----------
const bgm = new Audio("theme.mp3");
bgm.loop = true;
bgm.volume = 0.4;
function startBgm() { bgm.play().catch(function () {}); }
function stopBgm() { bgm.pause(); bgm.currentTime = 0; }
document.addEventListener("visibilitychange", function () {
  if (document.hidden) bgm.pause();
  else if (started && !gameOver) startBgm();
});

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
  startBgm();
  bird.velocity = bird.jump;
  spawnParticles(bird.x - 10, bird.y + 8, 3, ["#ffffff", "#dfe6e9"], 1);
}

function die() {
  if (gameOver) return;
  gameOver = true;
  stopBgm();
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
birdImg.onerror = function () { console.log("Không tải được hình nhân vật"); };
birdImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABgCAYAAACQVxWOAAAWfmNhQlgAABZ+anVtYgAAAB5qdW1kYzJwYQARABCAAACqADibcQNjMnBhAAAAFlhqdW1iAAAAR2p1bWRjMm1hABEAEIAAAKoAOJtxA3VybjpjMnBhOjk2YzIzZWVkLTYxYWEtNGRjYi1iMDM2LTM1MmJhMzk3ZjEzYgAAAAOTanVtYgAAAClqdW1kYzJhcwARABCAAACqADibcQNjMnBhLmFzc2VydGlvbnMAAAAAuGp1bWIAAABEanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5pbmdyZWRpZW50LnYzAAAAABhjMnNoA1ySH90L7rb3Ayg2VtcMHgAAAGxjYm9yo2lkYzpmb3JtYXRpaW1hZ2UvcG5namluc3RhbmNlSUR4LHhtcDppaWQ6MTI4ODc5ZjItZTQ0MS00ZmZjLTkzNDUtYmYxN2VkYzZhOGE1bHJlbGF0aW9uc2hpcGhwYXJlbnRPZgAAAeJqdW1iAAAAQWp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuYWN0aW9ucy52MgAAAAAYYzJzaOjtYyvgGlDNm4ooECFlFQEAAAGZY2JvcqJnYWN0aW9uc4KiZmFjdGlvbmtjMnBhLm9wZW5lZGpwYXJhbWV0ZXJzoWtpbmdyZWRpZW50c4GiY3VybHgtc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5pbmdyZWRpZW50LnYzZGhhc2hYILw/VrvfYSBeMD77eTSC8u5J+QGSH6SZDraujF8nnkjipGZhY3Rpb254HWNvbS5hbnRocm9waWMuY2xhdWRlLnByb3ZpZGVkanBhcmFtZXRlcnOheB9jb20uYW50aHJvcGljLm9yaWdpbi1jb25maWRlbmNlZ3Vua25vd25rZGVzY3JpcHRpb254ZkNsYXVkZSBwcm92aWRlZCB0aGlzIGZpbGUgYXQgdGhlIHJlcXVlc3Qgb2YgYSB1c2VyIGFuZCBtYXkgaGF2ZSBjcmVhdGVkIG9yIG1vZGlmaWVkIHRoZSBmaWxlIGNvbnRlbnRzLm1zb2Z0d2FyZUFnZW50oWRuYW1lZkNsYXVkZXJhbGxBY3Rpb25zSW5jbHVkZWT1AAAAyGp1bWIAAABAanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5oYXNoLmRhdGEAAAAAGGMyc2josGbPG3l7zML/JmkSASGwAAAAgGNib3KlY2FsZ2ZzaGEyNTZjcGFkTQAAAAAAAAAAAAAAAABkaGFzaFggu3ZReXmroyJlVCM3ynIQPKbmFqJL5w5p3MJwjT+SDrFkbmFtZW5qdW1iZiBtYW5pZmVzdGpleGNsdXNpb25zgaJlc3RhcnQYIWZsZW5ndGgZFooAAAI+anVtYgAAACdqdW1kYzJjbAARABCAAACqADibcQNjMnBhLmNsYWltLnYyAAAAAg9jYm9ypWNhbGdmc2hhMjU2aXNpZ25hdHVyZXhNc2VsZiNqdW1iZj0vYzJwYS91cm46YzJwYTo5NmMyM2VlZC02MWFhLTRkY2ItYjAzNi0zNTJiYTM5N2YxM2IvYzJwYS5zaWduYXR1cmVqaW5zdGFuY2VJRHgseG1wOmlpZDo3OGVhN2I2ZC0yMDcwLTRkZDMtYTE4ZS1lODQ5NTcwM2EwZDByY3JlYXRlZF9hc3NlcnRpb25zg6JjdXJseC1zZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmluZ3JlZGllbnQudjNkaGFzaFggvD9Wu99hIF4wPvt5NILy7kn5AZIfpJkOtq6MXyeeSOKiY3VybHgqc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5hY3Rpb25zLnYyZGhhc2hYIMovYQgNFoBxXgrGi+IajyyfVdFttUsHo9YirIJpJ+Q4omN1cmx4KXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaGFzaC5kYXRhZGhhc2hYICya6NGfLuLSL9mXxWcu5Q9FFmSf2LwbWg/tIem7o0GmdGNsYWltX2dlbmVyYXRvcl9pbmZvo2RuYW1lb0FudGhyb3BpYyBGaWxlc2d2ZXJzaW9uZTEuMC4wa3NwZWNWZXJzaW9uZTIuNC4wAAAQOGp1bWIAAAAoanVtZGMyY3MAEQAQgAAAqgA4m3EDYzJwYS5zaWduYXR1cmUAAAAQCGNib3LShFkCEqIBJhghWQIKMIICBjCCAY2gAwIBAgIUQOWgCu7COdC+uIP6BkIFPWdVEwAwCgYIKoZIzj0EAwMwSTEXMBUGA1UEChMOQW50aHJvcGljLCBQQkMxLjAsBgNVBAMTJUFudGhyb3BpYyBDb250ZW50IENyZWRlbnRpYWxzIFJvb3QgQ0EwHhcNMjYwODA3MTg0MzU2WhcNMjgwODA2MTk0MzU2WjBEMRcwFQYDVQQKEw5BbnRocm9waWMsIFBCQzEpMCcGA1UEAxMgQW50aHJvcGljIENsYXVkZSBDb250ZW50IFNpZ25pbmcwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASYegpry1AYBRTVNL1CpTlbROnY3dey+UrsF9C3phYrATN3ZHf93Mo8RQN0KOUuOn19P4oWNFWe5n2/She9N7eTo1gwVjAOBgNVHQ8BAf8EBAMCB4AwFQYDVR0lBA4wDAYKKwYBBAGD6F4CATAMBgNVHRMBAf8EAjAAMB8GA1UdIwQYMBaAFM5R4gSBTmRbI/jjxM+aPpzB11zCMAoGCCqGSM49BAMDA2cAMGQCMDFzHRSeAXrSy1WOzkbhPZ6Km2wGTmZ/2gK18k8BQGXyqz88Rdrz6CTX9flAnYNVxgIwcF9c3fVhqmJKpi+UhasNUMko69cyX6STPfta3Q8EjyzDjzoyrol46FP6VFHhvUcJoWNwYWRZDZ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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"; // ảnh nhúng sẵn, không cần file logo.png

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
