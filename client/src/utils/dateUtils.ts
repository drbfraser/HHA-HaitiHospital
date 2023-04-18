import { DayRange } from 'react-modern-calendar-datepicker';
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
const isDateStrInDayRange = (dateStr: string, dayRange: DayRange) => {
  const createdAt = new Date(dateStr);
  const createdAtUTC = new Date(
    Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate()),
  );

  if (dayRange.from && dayRange.to) {
    const dayRangeFrom = new Date(
      Date.UTC(dayRange.from.year, dayRange.from.month - 1, dayRange.from.day),
    );
    const dayRangeTo = new Date(Date.UTC(dayRange.to.year, dayRange.to.month - 1, dayRange.to.day));

    return dayRangeFrom <= createdAtUTC && createdAtUTC <= dayRangeTo;
  } else if (dayRange.from) {
    const dayRangeFrom = new Date(
      Date.UTC(dayRange.from.year, dayRange.from.month - 1, dayRange.from.day),
    );

    return dayRangeFrom <= createdAtUTC;
  } else if (dayRange.to) {
    const dayRangeTo = new Date(Date.UTC(dayRange.to.year, dayRange.to.month - 1, dayRange.to.day));

    return createdAtUTC <= dayRangeTo;
  }
  return true;
};

export {
  Month,
  currDate,
  currMonth,
  currMonthLastDate,
  currMonthLastDay,
  currYear,
  isDateStrInDayRange,
  makeDateShort,
};
