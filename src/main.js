import './css/style.css';
import { initStars, setSpeedMultiplier } from './stars.js';
import { initRenderer } from './renderer.js';
import { initShare } from './share.js';
import { initEasterEgg } from './easter-egg.js';
import * as dateBuilder from './date-builder.js';

// Start the canvas starfield
initStars();

// Populate modal date/time selectors
const modalYear = document.querySelector('#modalYear');
const modalMonth = document.querySelector('#modalMonth');
const modalDate = document.querySelector('#modalDate');
const modalHour = document.querySelector('#modalHour');
const modalMinute = document.querySelector('#modalMinute');

modalYear.innerHTML = dateBuilder.years
  .map((y) => `<option value="${y}">${y}</option>`)
  .join('');

modalMonth.innerHTML = dateBuilder.months
  .map((m, i) => `<option value="${i}">${m}</option>`)
  .join('');

modalDate.innerHTML = [...Array(31).keys()]
  .map((x) => 1 + x)
  .map((d) => `<option value="${d}">${d}</option>`)
  .join('');

modalHour.innerHTML = dateBuilder.hours
  .map(
    (h, i) =>
      `<option value="${i}">${h.toString().replace(/(^\d$)/, '0$1')}</option>`,
  )
  .join('');

modalMinute.innerHTML = dateBuilder.minutes
  .map(
    (m, i) =>
      `<option value="${i}">${m.toString().replace(/(^\d$)/, '0$1')}</option>`,
  )
  .join('');

// Modal change listeners
const modal = document.querySelector('.modal');
const errorMsg = document.querySelector('#modal-error');

for (const select of modal.querySelectorAll('select')) {
  select.addEventListener('change', () => {
    errorMsg.setAttribute('aria-hidden', 'true');
    updateDate(
      modalYear.value,
      modalMonth.value,
      modalDate.value,
      modalHour.value,
      modalMinute.value,
    );
  });
}

const secondsContainer = document.querySelector('#seconds');
const getSecondsBtn = document.querySelector('#getSeconds');

let bday;
let secondsData;
let updateRenderer;
let destroyEasterEgg;

// Last submitted values — used to pre-fill modal on Start Over
let lastYear, lastMonth, lastDate, lastHour, lastMinute;

// Modal submit
getSecondsBtn.addEventListener('click', () => {
  if (!secondsData.dateValid) {
    return errorMsg.setAttribute('aria-hidden', 'false');
  }

  // Store submitted values for Start Over pre-fill
  lastYear = modalYear.value;
  lastMonth = modalMonth.value;
  lastDate = modalDate.value;
  lastHour = modalHour.value;
  lastMinute = modalMinute.value;

  // Warp speed as modal exits, hold for 2s, then ease back as results arrive
  setSpeedMultiplier(20, 600);

  animateCSS('.modal', 'zoomOut', () => {
    modal.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
      setSpeedMultiplier(1, 2000);

      secondsContainer.setAttribute('aria-hidden', 'false');
      animateCSS('#seconds', 'zoomInUp');

      updateRenderer = initRenderer(secondsContainer, onStartOver);
      initShare(secondsContainer, () => secondsData);
      destroyEasterEgg = initEasterEgg(() => secondsData);

      // Move focus to results for keyboard/AT users
      secondsContainer.focus();
    }, 500);
  });
});

function onStartOver() {
  updateRenderer = null;
  if (destroyEasterEgg) { destroyEasterEgg(); destroyEasterEgg = null; }

  animateCSS('#seconds', 'zoomOut', () => {
    secondsContainer.setAttribute('aria-hidden', 'true');
    secondsContainer.innerHTML = '';

    // Restore previous values in modal
    modalYear.value = lastYear;
    modalMonth.value = lastMonth;
    modalDate.value = lastDate;
    modalHour.value = lastHour;
    modalMinute.value = lastMinute;

    modal.setAttribute('aria-hidden', 'false');
    animateCSS('.modal', 'zoomInUp');
    modalYear.focus();
  });
}

function updateDate(y, m, d, h, min) {
  bday = dateBuilder.makeBday(
    Number(y),
    Number(m),
    Number(d),
    Number(h),
    Number(min),
  );
  secondsData = dateBuilder.getSecondsData(bday);
}

// Initialize with a default so secondsData is always defined before first interaction
updateDate(2020, 0, 1, 0, 0);

// Render loop — updates the live second count every 100ms
setInterval(() => {
  const liveSeconds = Math.floor((Date.now() - bday.valueOf()) / 1000);
  secondsData.seconds = liveSeconds
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (updateRenderer) {
    updateRenderer(secondsData);
  }
}, 100);

function animateCSS(element, animationName, callback) {
  const node = document.querySelector(element);
  node.classList.add('animated', animationName);

  function handleAnimationEnd() {
    node.classList.remove('animated', animationName);
    node.removeEventListener('animationend', handleAnimationEnd);
    if (typeof callback === 'function') callback();
  }

  node.addEventListener('animationend', handleAnimationEnd);
}
