// Configuración inicial del canvas
const fireworksCanvas = document.getElementById("fireworks");
const ctx = fireworksCanvas.getContext("2d");
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

let particles = [];
let isFinalCountdown = false;

const targetDate = new Date('2025-01-01T00:00:00'); 

function countdown() {
  const now = new Date();
  const diff = targetDate - now;
  const totalSeconds = Math.floor(diff / 1000);

  if (totalSeconds <= 10 && totalSeconds > 0) {
    isFinalCountdown = true;
    handleFinalCountdown(totalSeconds);
  } else if (totalSeconds === 0) {
    isFinalCountdown = false;
    handleCelebration();
  } else if (totalSeconds > 0) {
    isFinalCountdown = false;
    updateRegularCountdown(diff);
  }
}

function updateRegularCountdown(diff) {
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

function handleFinalCountdown(secondsLeft) {
  const countdownElement = document.getElementById("countdown");
  countdownElement.innerHTML = `<div class="final-countdown-container">${secondsLeft}</div>`;
}

function handleCelebration() {
  const countdownElement = document.getElementById("countdown");

  countdownElement.innerHTML = `
  <div class="celebration celebration-left">
  <video id="celebration-video" autoplay muted loop>
    <source src="vecteezy_happy-new-year-2025_51585843.mp4" type="video/mp4">
    Tu navegador no soporta este formato de video.
  </video>
</div>`;

  const button = document.getElementById("showIframeButton");
  button.style.display = "none";

  startFireworks();
}

function startFireworks() {
  createSparks(); 
  setTimeout(() => {
    particles = []; 
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  }, 15000);
}

function drawSparks() {
  ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  particles.forEach((p, index) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;
    p.radius *= 0.98;

    if (p.radius < 0.5 || p.x < 0 || p.x > fireworksCanvas.width || p.y < 0 || p.y > fireworksCanvas.height) {
      particles.splice(index, 1);
    }
  });

  createSparks();
  requestAnimationFrame(drawSparks);
}

function createSparks() {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: Math.random() * fireworksCanvas.width,
      y: Math.random() * fireworksCanvas.height,
      radius: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speedX: Math.random() * 4 - 2,
      speedY: Math.random() * 4 - 2,
    });
  }
}

countdown();
setInterval(countdown, 1000);


const iframe = document.getElementById("radioIframe");
const button = document.getElementById("showIframeButton");

button.addEventListener("click", function () {
  if (iframe.style.opacity === "0") {
    iframe.style.opacity = "1";
    iframe.style.pointerEvents = "auto";
  } else {
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
  }
});
