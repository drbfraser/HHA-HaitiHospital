import { timezone, language } from 'constants/timezones';

// Haiti is GMT-5 (EASTERN TIME ET)
enum Month {
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
}

const currDate = new Date(new Date().toLocaleString(language, { timeZone: timezone }));
const currMonth = currDate.getMonth();
const currYear = currDate.getFullYear();
const currMonthLastDay = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();
const currMonthLastDate = new Date(currYear, currMonth, currMonthLastDay, 23, 59, 59);
const makeDateShort = (date: string): string => {
  return Month[parseInt(date.substring(5, 7)) - 1].concat(' ').concat(date.substring(0, 4));
};

export { Month, currDate, currMonth, currYear, currMonthLastDay, currMonthLastDate, makeDateShort };
