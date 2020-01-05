import moment from 'moment';
import template from './template/seconds.hbs';
import './scss/style.scss';

const render = function(secondsData) {
  const main = document.querySelector('#seconds');
  main.innerHTML = template(secondsData);
};

const bday = moment([1979, 4, 19]);
const secondsData = {
  fromDate: bday.format('MMMM Do YYYY, h:mm a'),

  billionthSecondDay: bday
    .clone()
    .add(1000000000, 'seconds')
    .format('MMMM Do YYYY'),
};
console.log('log: secondsData', secondsData);
setInterval(() => {
  let now = moment();
  console.log('log: now', now);
  let duration = now.diff(bday, 'seconds');
  console.log('log: duration', duration);
  secondsData.seconds = duration
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  secondsData.tense = duration < 1000000000 ? 'will be' : 'was';
  render(secondsData);
}, 1000);
