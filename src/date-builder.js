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

export const getSecondsData = function(bday) {
  const now = moment();
  const data = {
    fromDate: bday.format('MMMM Do YYYY, h:mm a'),
    dateValid: bday.format() === 'Invalid date' ? false : true,
    billionthSecondDay: {
      date: bday
        .clone()
        .add(1000000000, 'seconds')
        .format('MMM Do YYYY, HH:mm'),
      tense: now.diff(bday, 'seconds') < 1000000000 ? 'will be' : 'was',
    },
    twoBillionthSecondDay: {
      date: bday
        .clone()
        .add(2000000000, 'seconds')
        .format('MMM Do YYYY, HH:mm'),
      tense: now.diff(bday, 'seconds') < 2000000000 ? 'will be' : 'was',
    },
  };
  return data;
};
