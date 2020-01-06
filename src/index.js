import moment from 'moment';
import secondsTemplate from './template/seconds.hbs';
import './scss/style.scss';
import * as dateBuilder from './date-builder';

const renderSeconds = secondsData => {
  const main = document.querySelector('#seconds');
  main.innerHTML = secondsTemplate(secondsData);
};

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

// Initial date options
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

setTimeout(() => {
  bday = moment([1979, 0, 4]);
  secondsData = dateBuilder.getSecondsData(bday);
}, 5000);

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
