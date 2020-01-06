import moment from 'moment';

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const years = [...Array(101).keys()]
  .map(x => moment().year() - 100 + x)
  .reverse(); // Array of last 100 years

export const dates = (year, month) => {
  const lastDay = moment([year, month, 1])
    .add(1, 'months')
    .subtract(1, 'days')
    .date();
  return [...Array(lastDay).keys()].map(x => 1 + x);
};

export const hours = [...Array(24).keys()].map(x => x);
export const minutes = [...Array(60).keys()].map(x => x);
