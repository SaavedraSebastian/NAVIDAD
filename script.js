
const fireworksCanvas = document.getElementById("fireworks");
const ctx = fireworksCanvas.getContext("2d");
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

let particles = [];
let fireworks = [];
let isFinalCountdown = false;


const targetDate = new Date('2024-12-25T00:00:00'); 

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

  drawFireworks(); 
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
  countdownElement.innerHTML = `<div class="final-countdown">${secondsLeft}</div>`;


}


function handleCelebration() {
  const countdownElement = document.getElementById("countdown");
  const fireworkCanvas = document.getElementById("fireworks");


  fireworkCanvas.style.display = "none";  
  countdownElement.innerHTML = `<div class="final-countdown"> ¡Faltan 10 segundos! </div>`;
  document.getElementById("mensaje").textContent = "🎄 ¡Hora de celebrar! 🎄";
  document.getElementById("titulo").textContent = "Navidad Llegó";


  let countdown = 10; 
  const countdownInterval = setInterval(() => {
    countdownElement.innerHTML = `<div class="final-countdown"> ¡Faltan ${countdown} segundos! </div>`;
    countdown--;

    if (countdown < 0) {
      clearInterval(countdownInterval);
      countdownElement.innerHTML = `<div class="final-countdown"> ¡Feliz Navidad! </div>`;
      startFireworks();  
    }
  }, 1000);  
}

function startFireworks() {

  const fireworkCanvas = document.getElementById("fireworks");
  fireworkCanvas.style.display = "block";  
  const fireworks = new Fireworks(fireworkCanvas, {
    autoresize: true,
    opacity: 0.9,
    acceleration: 1.05,
    friction: 0.98,
    gravity: 1.5,
    particles: 200,
    traceLength: 3,
    lineWidth: 2,
    explosion: 5,
    brightness: { min: 50, max: 80 },
    decay: { min: 0.015, max: 0.03 },
    boundaries: {
      x: 50,
      y: 50,
      width: fireworkCanvas.offsetWidth - 50,
      height: fireworkCanvas.offsetHeight - 50,
    },
  });


  fireworks.start();


  setTimeout(() => {
    fireworks.stop();
  }, 10000);
}


function createFirework() {
  const firework = {
    x: Math.random() * fireworksCanvas.width,
    y: fireworksCanvas.height,
    targetX: Math.random() * fireworksCanvas.width,
    targetY: Math.random() * fireworksCanvas.height / 2,
    speedX: (Math.random() - 0.5) * 5,
    speedY: Math.random() * -10 - 10,
    color: `hsl(${Math.random() * 360}, 100%, 70%)`,
    exploded: false,
    particles: [],
  };

  fireworks.push(firework);
}

function drawFireworks() {
  ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  if (particles.length < 100) {
    particles.push(createParticle());
  }
  particles.forEach((p, index) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;

    p.radius *= 0.98;
    if (p.radius < 0.5) {
      particles.splice(index, 1);
    }
  });

  fireworks.forEach((fw, index) => {
    if (!fw.exploded) {
      ctx.beginPath();
      ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = fw.color;
      ctx.fill();

      fw.x += fw.speedX;
      fw.y += fw.speedY;

      if (fw.y <= fw.targetY) {
        fw.exploded = true;
        for (let i = 0; i < 100; i++) {
          fw.particles.push(createExplosion(fw.x, fw.y, fw.color));
        }
      }
    } else {
      fw.particles.forEach((p, pIndex) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;
        p.radius *= 0.95;
        p.alpha -= 0.01;

        if (p.alpha <= 0) {
          fw.particles.splice(pIndex, 1);
        }
      });

      if (fw.particles.length === 0) {
        fireworks.splice(index, 1);
      }
    }
  });

  requestAnimationFrame(drawFireworks);
}

function createParticle() {
  return {
    x: Math.random() * fireworksCanvas.width,
    y: Math.random() * fireworksCanvas.height,
    radius: Math.random() * 3 + 1,
    color: `hsl(${Math.random() * 360}, 100%, ${Math.random() * 50 + 50}%)`,
    speedX: Math.random() * 4 - 2,
    speedY: Math.random() * 4 - 2,
  };
}

function createExplosion(x, y, baseColor) {
  const numParticles = Math.random() * 100 + 50; 
  const explosionParticles = [];
  for (let i = 0; i < numParticles; i++) {
    explosionParticles.push({
      x,
      y,
      radius: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speedX: Math.random() * 4 - 3,
      speedY: Math.random() * 4 - 3,
      alpha: 1,
    });
  }
  return explosionParticles;
}


countdown();
setInterval(countdown, 1000);
const giftContainer = document.querySelector('.gift-container');
const santa = document.querySelector('.santa');

function createGift() {
  const gift = document.createElement('div');
  gift.classList.add('gift');
  
 
  gift.style.left = `${Math.random() * 100}%`;
  
  giftContainer.appendChild(gift);
  

  setTimeout(() => {
    gift.remove();
  }, 3000); 
}


setInterval(createGift, 1000);
