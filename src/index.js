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

// Modal submit
const newBirthday = document.querySelector('#getSeconds');
newBirthday.addEventListener('click', () => {
  const modal = document.querySelector('.modal');
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

// Set date picker
const years = dateBuilder.years;
const yearsOptions = years.map(
  year => `<option value="${year}">${year}</option>`
);
document.querySelector('#year').innerHTML += yearsOptions;

const months = dateBuilder.months;
const monthsOptions = months.map(
  (month, i) => `<option value="${i}">${month}</option>`
);
document.querySelector('#month').innerHTML += monthsOptions;

// Initial date options to 31 days
const datesOptions = [...Array(31).keys()]
  .map(x => 1 + x)
  .map(date => `<option value="${date}">${date}</option>`);
document.querySelector('#date').innerHTML += datesOptions;

const hours = dateBuilder.hours;
const hoursOptions = hours.map((hour, i) => {
  return `<option value="${i}">${hour
    .toString()
    .replace(/(^\d$)/, '0$1')}</option>`;
});
document.querySelector('#hour').innerHTML += hoursOptions;

const minutes = dateBuilder.minutes;
const minutesOptions = minutes.map((minute, i) => {
  return `<option value="${i}">${minute
    .toString()
    .replace(/(^\d$)/, '0$1')}</option>`;
});
document.querySelector('#minute').innerHTML += minutesOptions;

// setTimeout(() => {
//   bday = moment([1979, 0, 4]);
//   secondsData = dateBuilder.getSecondsData(bday);
//   animateCSS('#seconds', 'zoomInUp');
// }, 5000);

let bday = moment([1989, 4, 19]);
let secondsData = dateBuilder.getSecondsData(bday);

setInterval(() => {
  let interval = moment();
  let duration = interval.diff(bday, 'seconds');
  secondsData.seconds = duration
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  renderSeconds(secondsData);
}, 1000);

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
