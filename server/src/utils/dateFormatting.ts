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

const currDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Cancun' }));
const currMonth = currDate.getMonth();
const currYear = currDate.getFullYear();
const currMonthLastDay = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();

export { Month, currDate, currMonth, currYear, currMonthLastDay };
