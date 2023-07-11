import { language, timezone } from 'constants/timezones';

import { DayRange } from 'react-modern-calendar-datepicker';

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

const getDateStrComponents = (dateStr: string): string[] => dateStr.split(' at ');

const getReformattedDateStr = (dateStr: string): string => getDateStrComponents(dateStr).join(' ');

const getDateTimeFromDateStr = (dateStr: string): Date => new Date(getReformattedDateStr(dateStr));

const getDateFromDateStr = (dateStr: string): Date => new Date(getDateStrComponents(dateStr)[0]);

const makeDateShort = (dateStr: string): string => {
  const date = getDateFromDateStr(dateStr);

  const month = date.getMonth();
  const day = date.getDate();

  return `${Month[month]}/${day}`;
};

const isDateInRange = (dateStr: string | Date, dateRange: DayRange) => {
  const date = new Date(dateStr);

  const from =
    dateRange.from && new Date(dateRange.from.year, dateRange.from.month - 1, dateRange.from.day);

  const to = dateRange.to && new Date(dateRange.to.year, dateRange.to.month - 1, dateRange.to.day);

  if (from && from > date) return false;
  if (to && to < date) return false;

  return true;
};

export {
  Month,
  currDate,
  currMonth,
  currMonthLastDate,
  currMonthLastDay,
  currYear,
  isDateInRange,
  makeDateShort,
  getDateFromDateStr,
  getDateTimeFromDateStr,
  getReformattedDateStr,
};
