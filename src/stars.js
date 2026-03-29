const STAR_COLOR = '#66fcf1';

const LAYERS = [
  { count: 500, size: 1, baseSpeed: 0.5 },
  { count: 150, size: 2, baseSpeed: 0.3 },
  { count: 80, size: 3, baseSpeed: 0.1 },
];

let canvas, ctx, stars;
let speedMultiplier = 1.0;

// Tween state
let tweenFrom = 1.0;
let tweenTo = 1.0;
let tweenStart = 0;
let tweenDuration = 0;

function lerp(a, b, t) {
  return a + (b - a) * Math.min(t, 1);
}

function createStars() {
  stars = [];
  for (const layer of LAYERS) {
    for (let i = 0; i < layer.count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: layer.size,
        speed: layer.baseSpeed,
      });
    }
  }
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Redistribute stars across new dimensions
  if (stars) {
    for (const star of stars) {
      star.x = Math.random() * canvas.width;
      star.y = Math.random() * canvas.height;
    }
  }
}

function tick(timestamp) {
  // Update speed multiplier tween
  if (tweenDuration > 0) {
    const elapsed = timestamp - tweenStart;
    const t = elapsed / tweenDuration;
    speedMultiplier = lerp(tweenFrom, tweenTo, t);
    if (t >= 1) {
      speedMultiplier = tweenTo;
      tweenDuration = 0;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = STAR_COLOR;

  for (const star of stars) {
    star.y -= star.speed * speedMultiplier;

    // Wrap to bottom when off top of screen
    if (star.y < 0) {
      star.y = canvas.height;
      star.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(tick);
}

/**
 * Smoothly transition the star speed to a new multiplier.
 * @param {number} target - Target speed multiplier (1 = normal, 8 = warp)
 * @param {number} duration - Transition duration in milliseconds
 */
export function setSpeedMultiplier(target, duration) {
  tweenFrom = speedMultiplier;
  tweenTo = target;
  tweenDuration = duration;
  tweenStart = performance.now();
}

/**
 * Initialize the canvas starfield and start the animation loop.
 * Appends a <canvas> element to document.body.
 */
export function initStars() {
  canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  canvas.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100%',
    'height:100%',
    'z-index:0',
    'pointer-events:none',
  ].join(';');

  document.body.prepend(canvas);
  ctx = canvas.getContext('2d');

  resize();
  createStars();
  window.addEventListener('resize', resize);
  requestAnimationFrame(tick);
}
