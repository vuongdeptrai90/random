/* ==================== PHẦN 2: GAME FLAPPY VƯƠNG ==================== */
const canvas = document.getElementById("birdGame");
const ctx = canvas.getContext("2d");

let bird = { 
  x: 50, 
  y: 120, 
  radius: 14, 
  velocity: 0, 
  gravity: 0.25, 
  jump: -4.5 
};
let pipes = [];
let score = 0;
let highScore = localStorage.getItem("flappyHighScore") || 0;
let gameOver = false;
let frameCount = 0;

document.addEventListener("keydown", function(e) { if (e.code === "Space") flap(); });
canvas.addEventListener("touchstart", function(e) { e.preventDefault(); flap(); });
canvas.addEventListener("mousedown", flap);

function flap() {
  if (gameOver) { resetFlappy(); return; }
  bird.velocity = bird.jump;
}

function resetFlappy() {
  playSound('click');
  bird.y = 120;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frameCount = 0;
  gameOver = false;
}

function updateFlappy() {
  if (gameOver) return;

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
    gameOver = true;
    playSound('hit');
  }

  frameCount++;

  if (frameCount % 85 === 0) {
    let gap = 100;
    let minPipe = 30;
    let topHeight = Math.floor(Math.random() * (canvas.height - gap - minPipe * 2)) + minPipe;
    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: canvas.height - topHeight - gap,
      passed: false
    });
  }

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;

    if (
      bird.x + bird.radius > p.x &&
      bird.x - bird.radius < p.x + 35 &&
      (bird.y - bird.radius < p.top || bird.y + bird.radius > canvas.height - p.bottom)
    ) {
      gameOver = true;
      playSound('hit');
    }

    if (!p.passed && p.x + 35 < bird.x) {
      p.passed = true;
      score++;
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("flappyHighScore", highScore);
      }
    }
  }

  pipes = pipes.filter(p => p.x > -35);
}

function drawMushroomCat(x, y, velocity) {
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
  ctx.beginPath(); ctx.arc(-5, 2, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, 2, 2.2, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(-5.5, 1.2, 0.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4.5, 1.2, 0.8, 0, Math.PI * 2); ctx.fill();

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

function drawFlappy() {
  ctx.fillStyle = "#70a1ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#2ed573";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, 35, p.top);
    ctx.strokeRect(p.x, 0, 35, p.top);
    ctx.fillRect(p.x - 3, p.top - 12, 41, 12);
    ctx.strokeRect(p.x - 3, p.top - 12, 41, 12);

    ctx.fillRect(p.x, canvas.height - p.bottom, 35, p.bottom);
    ctx.strokeRect(p.x, canvas.height - p.bottom, 35, p.bottom);
    ctx.fillRect(p.x - 3, canvas.height - p.bottom, 41, 12);
    ctx.strokeRect(p.x - 3, canvas.height - p.bottom, 41, 12);
  });

  drawMushroomCat(bird.x, bird.y, bird.velocity);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 15px Poppins";
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 3;
  ctx.fillText("Điểm: " + score, 10, 25);
  ctx.fillText("Kỷ lục: " + highScore, 10, 45);
  ctx.shadowBlur = 0;

  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#ff4757";
    ctx.font = "bold 20px Poppins";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", canvas.width / 2, 140);
    
    ctx.fillStyle = "#fff";
    ctx.font = "12px Poppins";
    ctx.fillText("Điểm: " + score + " | Kỷ lục: " + highScore, canvas.width / 2, 170);
    ctx.fillText("Chạm màn hình để chơi lại", canvas.width / 2, 195);
    ctx.textAlign = "left";
  }
}

function gameLoop() {
  updateFlappy();
  drawFlappy();
  requestAnimationFrame(gameLoop);
}

gameLoop();
