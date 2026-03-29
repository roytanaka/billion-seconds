import { setSpeedMultiplier } from './stars.js';

/**
 * Attaches easter egg trigger to the results view.
 *
 * Desktop: rapid left-right mouse wiggle (5 direction reversals within 500ms)
 * Mobile:  device shake (acceleration > 15 m/s²)
 *
 * @param {Function} getSecondsData - Returns the current secondsData object
 */
export function initEasterEgg(getSecondsData) {
  let active = false;

  // Build overlay
  const overlay = document.createElement('div');
  overlay.className = 'easter-egg-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Trillion second milestone');

  const inner = document.createElement('div');
  inner.className = 'easter-egg-inner';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'easter-egg-eyebrow';
  eyebrow.textContent = 'Trillionth second easter egg';

  const heading = document.createElement('p');
  heading.className = 'easter-egg-heading';
  heading.textContent = 'Your 1 trillionth second';

  const dateEl = document.createElement('p');
  dateEl.className = 'easter-egg-date';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'easter-egg-close';
  closeBtn.type = 'button';
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', dismiss);

  inner.append(eyebrow, heading, dateEl, closeBtn);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && active) dismiss();
  });

  function trigger() {
    if (active) return;
    active = true;

    const data = getSecondsData();
    dateEl.textContent = `${data.trillionthSecondDay.tense} on ${data.trillionthSecondDay.date}`;

    setSpeedMultiplier(50, 800);

    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('easter-egg-visible');

    setTimeout(() => setSpeedMultiplier(1, 2000), 3000);
  }

  function dismiss() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('easter-egg-visible');
    active = false;
  }

  // Desktop: rapid mouse wiggle
  const pointerHistory = [];
  const WIGGLE_WINDOW_MS = 500;
  const WIGGLE_REVERSALS = 5;

  document.addEventListener('mousemove', (e) => {
    if (active) return;

    const now = Date.now();
    pointerHistory.push({ t: now, x: e.clientX });

    // Prune entries outside the window
    while (
      pointerHistory.length > 0 &&
      now - pointerHistory[0].t > WIGGLE_WINDOW_MS
    ) {
      pointerHistory.shift();
    }

    if (pointerHistory.length < 3) return;

    let reversals = 0;
    for (let i = 2; i < pointerHistory.length; i++) {
      const dx1 = pointerHistory[i - 1].x - pointerHistory[i - 2].x;
      const dx2 = pointerHistory[i].x - pointerHistory[i - 1].x;
      if (dx1 !== 0 && dx2 !== 0 && dx1 * dx2 < 0) reversals++;
    }

    if (reversals >= WIGGLE_REVERSALS) {
      pointerHistory.length = 0;
      trigger();
    }
  });

  // Mobile: device shake
  let lastShakeTime = 0;
  const SHAKE_THRESHOLD = 15;
  const SHAKE_COOLDOWN_MS = 1000;

  window.addEventListener('devicemotion', (e) => {
    if (active) return;

    const acc = e.accelerationIncludingGravity;
    if (!acc) return;

    const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
    const now = Date.now();

    if (
      magnitude > SHAKE_THRESHOLD &&
      now - lastShakeTime > SHAKE_COOLDOWN_MS
    ) {
      lastShakeTime = now;
      trigger();
    }
  });

  // Return teardown so main.js can clean up on Start Over
  return function destroy() {
    overlay.remove();
  };
}
