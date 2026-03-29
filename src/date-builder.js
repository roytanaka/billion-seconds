import dayjs from 'dayjs'

export const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const years = [...Array(101).keys()]
  .map(x => dayjs().year() - 100 + x)
  .reverse()

export const dates = (year, month) => {
  // Last day of the month: day 0 of next month
  const lastDay = dayjs(new Date(year, month + 1, 0)).date()
  return [...Array(lastDay).keys()].map(x => 1 + x)
}

export const hours = [...Array(24).keys()]
export const minutes = [...Array(60).keys()]

export function makeBday(year, month, date, hour, minute) {
  return dayjs(new Date(year, month, date, hour, minute))
}

export function getSecondsData(bday) {
  const now = dayjs()
  return {
    fromDate: bday.format('MMMM D YYYY, h:mm a'),
    dateValid: bday.isValid(),
    billionthSecondDay: {
      date: bday.add(1_000_000_000, 'second').format('MMM D YYYY, HH:mm'),
      tense: now.diff(bday, 'second') < 1_000_000_000 ? 'will be' : 'was',
    },
    twoBillionthSecondDay: {
      date: bday.add(2_000_000_000, 'second').format('MMM D YYYY, HH:mm'),
      tense: now.diff(bday, 'second') < 2_000_000_000 ? 'will be' : 'was',
    },
    trillionthSecondDay: {
      date: bday.add(1_000_000_000_000, 'second').format('MMM D YYYY, HH:mm'),
      tense: now.diff(bday, 'second') < 1_000_000_000_000 ? 'will be' : 'was',
    },
  }
}
