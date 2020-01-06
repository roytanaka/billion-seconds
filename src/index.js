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

const datesOptions = [...Array(31).keys()]
  .map(x => 1 + x)
  .map(date => `<option value="${date}">${date}</option>`);
document.querySelector('#date').innerHTML += datesOptions;

const dateData = {
  months: dateBuilder.months,
  years: dateBuilder.years,
  dates: [...Array(31).keys()].map(x => 1 + x),
  hours: dateBuilder.hours,
  minutes: dateBuilder.minutes,
};

setTimeout(() => {
  const dates = dateBuilder.dates(2020, 1);
  let options = '<option value="" disabled="" selected=""></option>';
  options += dates.map(date => {
    return `<option value="${date}">${date}</option>`;
  });
  document.querySelector('#date').innerHTML = options;
  bday = moment([1987, 4, 19]);
}, 5000);

let bday = moment([1989, 4, 19]);
const secondsData = {
  fromDate: bday.format('MMMM Do YYYY, h:mm a'),
  billionthSecondDay: bday
    .clone()
    .add(1000000000, 'seconds')
    .format('MMMM Do YYYY'),
};
setInterval(() => {
  let now = moment();
  let duration = now.diff(bday, 'seconds');
  secondsData.seconds = duration
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  secondsData.tense = duration < 1000000000 ? 'will be' : 'was';
  renderSeconds(secondsData);
}, 1000);
