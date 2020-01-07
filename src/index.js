import moment from 'moment';
import secondsTemplate from './template/seconds.hbs';
import './scss/style.scss';
import 'animate.css';
import * as dateBuilder from './date-builder';

// Seconds Template
const renderSeconds = secondsData => {
  const main = document.querySelector('#seconds');
  main.innerHTML = secondsTemplate(secondsData);
};

// Set date picker
const year = document.querySelector('#year');
const modalYear = document.querySelector('#modalYear');
const yearsOptions = dateBuilder.years.map(
  year => `<option value="${year}">${year}</option>`
);
year.innerHTML = yearsOptions;
modalYear.innerHTML = yearsOptions;

const month = document.querySelector('#month');
const modalMonth = document.querySelector('#modalMonth');
const months = dateBuilder.months;
const monthsOptions = months.map(
  (month, i) => `<option value="${i}">${month}</option>`
);
month.innerHTML = monthsOptions;
modalMonth.innerHTML = monthsOptions;

const date = document.querySelector('#date');
const modalDate = document.querySelector('#modalDate');
const datesOptions = [...Array(31).keys()]
  .map(x => 1 + x)
  .map(date => `<option value="${date}">${date}</option>`);
date.innerHTML = datesOptions;
modalDate.innerHTML = datesOptions;

const hour = document.querySelector('#hour');
const modalHour = document.querySelector('#modalHour');
const hours = dateBuilder.hours;
const hoursOptions = hours.map((hour, i) => {
  return `<option value="${i}">${hour
    .toString()
    .replace(/(^\d$)/, '0$1')}</option>`;
});
hour.innerHTML = hoursOptions;
modalHour.innerHTML = hoursOptions;

const minute = document.querySelector('#minute');
const modalMinute = document.querySelector('#modalMinute');
const minutes = dateBuilder.minutes;
const minutesOptions = minutes.map((minute, i) => {
  return `<option value="${i}">${minute
    .toString()
    .replace(/(^\d$)/, '0$1')}</option>`;
});
minute.innerHTML = minutesOptions;
modalMinute.innerHTML = minutesOptions;

const modal = document.querySelector('.modal');
const selectors = modal.querySelectorAll('select');
for (const select of selectors) {
  select.addEventListener('change', () => {
    updateDate(
      modalYear.value,
      modalMonth.value,
      modalDate.value,
      modalHour.value,
      modalMinute.value
    );
  });
}

const footerSelectors = document.querySelectorAll('footer select');
for (const select of footerSelectors) {
  select.addEventListener('change', () => {
    updateDate(year.value, month.value, date.value, hour.value, minute.value);
  });
}

const newBirthday = document.querySelector('#getSeconds');

// Modal submit
newBirthday.addEventListener('click', () => {
  year.value = modalYear.value;
  month.value = modalMonth.value;
  date.value = modalDate.value;
  hour.value = modalHour.value;
  minute.value = modalMinute.value;

  const seconds = document.querySelector('#seconds');
  const footerDate = document.querySelector('footer .date-selectors');

  animateCSS('.modal', 'zoomOut', () =>
    modal.setAttribute('aria-hidden', 'true')
  );

  animateCSS('#seconds', 'zoomInUp');
  seconds.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    animateCSS('footer .date-selectors', 'bounceInUp');
    footerDate.setAttribute('aria-hidden', 'false');
  }, 800);
});

// setTimeout(() => {
//   bday = moment([1979, 0, 4]);
//   secondsData = dateBuilder.getSecondsData(bday);
//   animateCSS('#seconds', 'zoomInUp');
// }, 5000);

let bday;
let secondsData;

function updateDate(year, month, date, hour, minute) {
  bday = moment([year, month, date, hour, minute]);
  secondsData = dateBuilder.getSecondsData(bday);
}

updateDate(2020, 0, 1, 0, 0);

setInterval(() => {
  let interval = moment();
  let duration = interval.diff(bday, 'seconds');
  secondsData.seconds = duration
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  renderSeconds(secondsData);
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
