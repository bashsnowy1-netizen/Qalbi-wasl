/* =========================================================
   QALBI WASL — RECITATION ENGINE
   Original procedural live wallpapers
   ========================================================= */

const state = {
  environment: "rain",
  motionSpeed: 0.9,
  blur: 8,
  fontScale: 100,
  playing: false,
  bookmarked: false,
  syncWithRecitation: true,
  reciter: "Abdurrahman ibn Musad"
};


/* =========================================================
   ELEMENTS
   ========================================================= */

const background = document.getElementById("liveBackground");
const playButton = document.getElementById("playButton");
const bookmarkButton = document.getElementById("bookmarkButton");

const arabicText = document.getElementById("arabicText");
const fontSizeLabel = document.getElementById("fontSizeLabel");

const environmentName = document.getElementById("environmentName");

const textModal = document.getElementById("textModal");
const reciterModal = document.getElementById("reciterModal");

const blurSlider = document.getElementById("blurSlider");
const arabicSizeSlider = document.getElementById("arabicSizeSlider");

const currentTimeElement = document.getElementById("currentTime");
const audioProgress = document.getElementById("audioProgress");


/* =========================================================
   CANVAS
   ========================================================= */

const canvas = document.createElement("canvas");

canvas.id = "liveWallpaperCanvas";

canvas.style.position = "fixed";
canvas.style.inset = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";
canvas.style.pointerEvents = "none";

background.innerHTML = "";
background.appendChild(canvas);

const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let animationFrame = null;
let lastFrame = performance.now();

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =========================================================
   UTILITY
   ========================================================= */

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}


/* =========================================================
   PARTICLES
   ========================================================= */

let rainParticles = [];
let stars = [];
let birds = [];
let fireParticles = [];
let sandParticles = [];

function createRain() {
  rainParticles = [];

  const count = Math.floor(
    clamp((width * height) / 11000, 80, 230)
  );

  for (let i = 0; i < count; i++) {
    rainParticles.push({
      x: random(0, width),
      y: random(0, height),
      length: random(10, 24),
      speed: random(500, 850),
      drift: random(-30, -10)
    });
  }
}

function createStars() {
  stars = [];

  const count = Math.floor(
    clamp((width * height) / 9000, 100, 300)
  );

  for (let i = 0; i < count; i++) {
    stars.push({
      x: random(0, width),
      y: random(0, height * 0.8),
      radius: random(0.4, 1.8),
      alpha: random(0.25, 0.9),
      phase: random(0, Math.PI * 2)
    });
  }
}

function createBirds() {
  birds = [];

  for (let i = 0; i < 8; i++) {
    birds.push({
      x: random(-100, width),
      y: random(height * 0.15, height * 0.45),
      speed: random(12, 24),
      size: random(4, 8),
      phase: random(0, Math.PI * 2)
    });
  }
}

function createFire() {
  fireParticles = [];

  for (let i = 0; i < 70; i++) {
    fireParticles.push({
      x: random(-45, 45),
      y: random(-10, 10),
      size: random(2, 8),
      speed: random(18, 42),
      phase: random(0, Math.PI * 2)
    });
  }
}

function createSand() {
  sandParticles = [];

  for (let i = 0; i < 90; i++) {
    sandParticles.push({
      x: random(0, width),
      y: random(height * 0.45, height),
      speed: random(4, 12),
      size: random(1, 3)
    });
  }
}

createRain();
createStars();
createBirds();
createFire();
createSand();


/* =========================================================
   ENVIRONMENT BACKGROUNDS
   ========================================================= */

function drawGradient(top, bottom) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);

  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}


function drawRainEnvironment(time) {

  drawGradient(
    "#243b38",
    "#07130f"
  );

  // soft forest silhouettes
  drawForest(time);

  ctx.strokeStyle = "rgba(210,230,225,0.42)";
  ctx.lineWidth = 1;

  for (const drop of rainParticles) {

    drop.y +=
      drop.speed *
      state.motionSpeed *
      0.001;

    drop.x +=
      drop.drift *
      state.motionSpeed *
      0.001;

    if (drop.y > height + 30) {
      drop.y = -30;
      drop.x = random(0, width);
    }

    ctx.beginPath();

    ctx.moveTo(
      drop.x,
      drop.y
    );

    ctx.lineTo(
      drop.x - 3,
      drop.y + drop.length
    );

    ctx.stroke();
  }
}


function drawForest(time) {

  const baseY = height * 0.72;

  ctx.fillStyle = "rgba(8,25,20,0.82)";

  ctx.beginPath();
  ctx.moveTo(0, baseY);

  for (let x = 0; x <= width; x += 50) {

    const treeHeight =
      80 +
      Math.sin(x * 0.02) * 40;

    ctx.lineTo(
      x,
      baseY - treeHeight
    );
  }

  ctx.lineTo(width, height);
  ctx.lineTo(0, height);

  ctx.closePath();

  ctx.fill();
}


/* =========================================================
   BIRDS
   ========================================================= */

function drawBirdEnvironment(time) {

  drawGradient(
    "#a9c4c0",
    "#e5d9bd"
  );

  ctx.fillStyle = "rgba(80,95,75,0.45)";

  ctx.fillRect(
    0,
    height * 0.72,
    width,
    height * 0.28
  );

  ctx.strokeStyle = "rgba(35,50,42,0.65)";
  ctx.lineWidth = 2;

  for (const bird of birds) {

    bird.x +=
      bird.speed *
      state.motionSpeed *
      0.001;

    bird.y +=
      Math.sin(
        time * 0.001 +
        bird.phase
      ) *
      0.12;

    if (bird.x > width + 50) {
      bird.x = -50;
    }

    ctx.beginPath();

    ctx.arc(
      bird.x - bird.size,
      bird.y,
      bird.size,
      Math.PI,
      0
    );

    ctx.arc(
      bird.x + bird.size,
      bird.y,
      bird.size,
      Math.PI,
      0
    );

    ctx.stroke();
  }
}


/* =========================================================
   MORNING
   ========================================================= */

function drawMorningEnvironment(time) {

  drawGradient(
    "#c5d6d1",
    "#d9b57b"
  );

  const sunX = width * 0.72;
  const sunY = height * 0.28;

  const pulse =
    1 +
    Math.sin(time * 0.0003) * 0.015;

  const radius =
    75 * pulse;

  const glow = ctx.createRadialGradient(
    sunX,
    sunY,
    10,
    sunX,
    sunY,
    radius
  );

  glow.addColorStop(
    0,
    "rgba(255,240,180,0.8)"
  );

  glow.addColorStop(
    1,
    "rgba(255,200,100,0)"
  );

  ctx.fillStyle = glow;

  ctx.beginPath();

  ctx.arc(
    sunX,
    sunY,
    radius,
    0,
    Math.PI * 2
  );

  ctx.fill();

  drawMountains();
}


/* =========================================================
   FOREST RAIN
   ========================================================= */

function drawForestRainEnvironment(time) {

  drawGradient(
    "#1f3930",
    "#06110d"
  );

  drawForest(time);

  // Mist
  for (let i = 0; i < 4; i++) {

    const mistX =
      width *
      (0.2 + i * 0.25);

    const mistY =
      height *
      (0.35 + i * 0.07);

    const gradient =
      ctx.createRadialGradient(
        mistX,
        mistY,
        10,
        mistX,
        mistY,
        160
      );

    gradient.addColorStop(
      0,
      "rgba(220,235,225,0.12)"
    );

    gradient.addColorStop(
      1,
      "rgba(220,235,225,0)"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
      mistX,
      mistY,
      160,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  drawRainEnvironment(time);
}


/* =========================================================
   WATERFALL
   ========================================================= */

function drawWaterfallEnvironment(time) {

  drawGradient(
    "#28484a",
    "#071817"
  );

  drawForest(time);

  const waterfallX = width * 0.55;
  const waterfallTop = height * 0.15;
  const waterfallBottom = height * 0.8;

  ctx.fillStyle =
    "rgba(190,225,220,0.55)";

  ctx.fillRect(
    waterfallX,
    waterfallTop,
    100,
    waterfallBottom - waterfallTop
  );

  ctx.strokeStyle =
    "rgba(225,245,240,0.55)";

  ctx.lineWidth = 2;

  for (let i = 0; i < 20; i++) {

    const x =
      waterfallX +
      random(0, 100);

    const y =
      waterfallTop +
      (
        (time * 0.0004 * 300 + i * 30)
        % 500
      );

    ctx.beginPath();

    ctx.moveTo(
      x,
      y
    );

    ctx.lineTo(
      x,
      y + random(20, 60)
    );

    ctx.stroke();
  }
}


/* =========================================================
   MOUNTAINS
   ========================================================= */

function drawMountains() {

  ctx.fillStyle =
    "rgba(32,52,53,0.78)";

  ctx.beginPath();

  ctx.moveTo(0, height * 0.72);

  for (
    let x = 0;
    x <= width;
    x += 90
  ) {

    const peak =
      height *
      (0.30 + Math.sin(x * 0.01) * 0.09);

    ctx.lineTo(
      x,
      peak
    );
  }

  ctx.lineTo(width, height);
  ctx.lineTo(0, height);

  ctx.closePath();

  ctx.fill();
}


function drawMountainEnvironment(time) {

  drawGradient(
    "#506e73",
    "#101d20"
  );

  drawMountains();
}


/* =========================================================
   NIGHT SKY
   ========================================================= */

function drawNightEnvironment(time) {

  drawGradient(
    "#091427",
    "#02050b"
  );

  for (const star of stars) {

    const twinkle =
      0.55 +
      Math.sin(
        time * 0.001 +
        star.phase
      ) *
      0.35;

    ctx.globalAlpha =
      star.alpha *
      twinkle;

    ctx.fillStyle = "#f3eee0";

    ctx.beginPath();

    ctx.arc(
      star.x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.globalAlpha = 1;
}


/* =========================================================
   THUNDER
   ========================================================= */

let lightning = 0;
let nextLightning = performance.now() + random(5000, 12000);

function drawThunderEnvironment(time) {

  drawNightEnvironment(time);

  if (time > nextLightning) {

    lightning = 1;

    nextLightning =
      time +
      random(7000, 15000);
  }

  if (lightning > 0) {

    ctx.fillStyle =
      `rgba(235,245,255,${lightning * 0.22})`;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    lightning -= 0.035;

    if (lightning < 0) {
      lightning = 0;
    }
  }
}


/* =========================================================
   SAHARA
   ========================================================= */

function drawSaharaEnvironment(time) {

  drawGradient(
    "#9d7756",
    "#3e281e"
  );

  ctx.fillStyle =
    "rgba(220,180,125,0.45)";

  ctx.beginPath();

  ctx.moveTo(0, height * 0.64);

  for (
    let x = 0;
    x <= width;
    x += 50
  ) {

    ctx.lineTo(
      x,
      height * 0.64 +
      Math.sin(
        x * 0.009 +
        time * 0.0001
      ) * 25
    );
  }

  ctx.lineTo(width, height);
  ctx.lineTo(0, height);

  ctx.closePath();

  ctx.fill();

  for (const sand of sandParticles) {

    sand.x +=
      sand.speed *
      state.motionSpeed *
      0.001;

    if (sand.x > width) {
      sand.x = 0;
    }

    ctx.fillStyle =
      "rgba(240,205,150,0.28)";

    ctx.beginPath();

    ctx.arc(
      sand.x,
      sand.y,
      sand.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }
}


/* =========================================================
   SPACE
   ========================================================= */

function drawSpaceEnvironment(time) {

  drawGradient(
    "#060518",
    "#010108"
  );

  for (const star of stars) {

    const movement =
      time *
      0.00001 *
      state.motionSpeed;

    let x =
      (
        star.x +
        movement * 40
      ) %
      width;

    ctx.fillStyle =
      `rgba(240,240,255,${star.alpha})`;

    ctx.beginPath();

    ctx.arc(
      x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  // distant planet
  const planetX = width * 0.72;
  const planetY = height * 0.32;

  const planet = ctx.createRadialGradient(
    planetX - 30,
    planetY - 30,
    10,
    planetX,
    planetY,
    110
  );

  planet.addColorStop(
    0,
    "rgba(160,180,200,0.7)"
  );

  planet.addColorStop(
    1,
    "rgba(30,35,70,0)"
  );

  ctx.fillStyle = planet;

  ctx.beginPath();

  ctx.arc(
    planetX,
    planetY,
    110,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


/* =========================================================
   FIREPLACE
   ========================================================= */

function drawFireplace(time) {

  const x = width * 0.78;
  const y = height * 0.78;

  // fireplace glow
  const glow = ctx.createRadialGradient(
    x,
    y,
    10,
    x,
    y,
    260
  );

  glow.addColorStop(
    0,
    "rgba(255,180,80,0.28)"
  );

  glow.addColorStop(
    1,
    "rgba(255,120,30,0)"
  );

  ctx.fillStyle = glow;

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    260,
    0,
    Math.PI * 2
  );

  ctx.fill();


  // fireplace body
  ctx.fillStyle =
    "rgba(40,28,23,0.85)";

  ctx.fillRect(
    x - 100,
    y - 15,
    200,
    90
  );


  // flames
  for (const flame of fireParticles) {

    const flameX =
      x +
      flame.x +
      Math.sin(
        time * 0.004 +
        flame.phase
      ) * 10;

    const flameY =
      y -
      Math.abs(
        Math.sin(
          time * 0.003 +
          flame.phase
        )
      ) *
      90;

    const size =
      flame.size *
      (
        0.7 +
        Math.sin(
          time * 0.006 +
          flame.phase
        ) *
        0.25
      );

    const gradient =
      ctx.createRadialGradient(
        flameX,
        flameY,
        1,
        flameX,
        flameY,
        size * 4
      );

    gradient.addColorStop(
      0,
      "rgba(255,240,170,0.95)"
    );

    gradient.addColorStop(
      0.45,
      "rgba(255,150,50,0.75)"
    );

    gradient.addColorStop(
      1,
      "rgba(255,80,20,0)"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
      flameX,
      flameY,
      size * 4,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }
}


/* =========================================================
   FOREST + FIREPLACE
   ========================================================= */

function drawForestFireEnvironment(time) {

  drawForestRainEnvironment(time);

  drawFireplace(time);
}


/* =========================================================
   ENVIRONMENT RENDERER
   ========================================================= */

function renderEnvironment(time) {

  clearCanvas();

  switch (state.environment) {

    case "birds":
      drawBirdEnvironment(time);
      break;

    case "morning":
      drawMorningEnvironment(time);
      break;

    case "forest":
      drawForestRainEnvironment(time);
      break;

    case "waterfall":
      drawWaterfallEnvironment(time);
      break;

    case "mountains":
      drawMountainEnvironment(time);
      break;

    case "night":
      drawNightEnvironment(time);
      break;

    case "thunder":
      drawThunderEnvironment(time);
      break;

    case "sahara":
      drawSaharaEnvironment(time);
      break;

    case "space":
      drawSpaceEnvironment(time);
      break;

    case "fireplace":
      drawFireplaceEnvironment(time);
      break;

    case "forest-fire":
      drawForestFireEnvironment(time);
      break;

    case "rain":
    default:
      drawRainEnvironment(time);
      break;
  }

  drawAtmosphere();
}


/* =========================================================
   FIREPLACE ONLY
   ========================================================= */

function drawFireplaceEnvironment(time) {

  drawGradient(
    "#261b18",
    "#080706"
  );

  drawFireplace(time);
}


/* =========================================================
   ATMOSPHERE
   ========================================================= */

function drawAtmosphere() {

  // Dark translucent layer keeps Qur'an text readable.
  const overlay =
    state.environment === "morning"
      ? "rgba(15,25,20,0.15)"
      : "rgba(5,15,11,0.25)";

  ctx.fillStyle = overlay;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  ctx.globalAlpha = 1;
}


/* =========================================================
   ANIMATION LOOP
   ========================================================= */

function animate(time) {

  const delta =
    Math.min(
      time - lastFrame,
      50
    );

  lastFrame = time;

  renderEnvironment(time);

  animationFrame =
    requestAnimationFrame(animate);
}

animationFrame =
  requestAnimationFrame(animate);


/* =========================================================
   BLUR CONTROL
   ========================================================= */

function applyBlur(value) {

  state.blur =
    clamp(Number(value), 0, 20);

  background.style.filter =
    `blur(${state.blur}px)`;

  background.style.transform =
    `scale(${1.02 + state.blur * 0.004})`;
}

applyBlur(state.blur);


/* =========================================================
   FONT SIZE
   ========================================================= */

function applyFontScale(value) {

  state.fontScale =
    clamp(Number(value), 70, 180);

  arabicText.style.fontSize =
    `${state.fontScale}px`;

  fontSizeLabel.textContent =
    `${state.fontScale}%`;

  if (arabicSizeSlider) {
    arabicSizeSlider.value =
      state.fontScale;
  }
}


/* =========================================================
   FONT BUTTONS
   ========================================================= */

document
  .getElementById("increaseFont")
  ?.addEventListener(
    "click",
    () => {

      applyFontScale(
        state.fontScale + 10
      );
    }
  );

document
  .getElementById("decreaseFont")
  ?.addEventListener(
    "click",
    () => {

      applyFontScale(
        state.fontScale - 10
      );
    }
  );


arabicSizeSlider
  ?.addEventListener(
    "input",
    event => {

      applyFontScale(
        event.target.value
      );
    }
  );


/* =========================================================
   BLUR SLIDER
   ========================================================= */

blurSlider
  ?.addEventListener(
    "input",
    event => {

      applyBlur(
        event.target.value
      );
    }
  );


/* =========================================================
   QUICK BLUR BUTTON
   ========================================================= */

document
  .getElementById("blurButton")
  ?.addEventListener(
    "click",
    () => {

      const values = [
        0,
        4,
        8,
        12,
        16
      ];

      const currentIndex =
        values.indexOf(
          state.blur
        );

      const nextIndex =
        currentIndex >= 0
          ? (currentIndex + 1) % values.length
          : 2;

      applyBlur(
        values[nextIndex]
      );

      if (blurSlider) {
        blurSlider.value =
          values[nextIndex];
      }
    }
  );


/* =========================================================
   PLAYBACK UI
   ========================================================= */
