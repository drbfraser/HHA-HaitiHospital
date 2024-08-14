import { AnalyticsResponse } from '@hha/common';
import { MONTH_AND_YEAR_DATE_FORMAT, YEAR_ONLY_DATE_FORMAT } from 'constants/date';
import { language, timezone } from 'constants/timezones';
import moment from 'moment';

import { DayRange } from 'react-modern-calendar-datepicker';
import { DateWithFormat } from './analytics';

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

const currentYearAndMonth = () => {
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};

// Return the translation key string of the translation EN/FR JSON file
const translateMonth = (index: number): string => {
  const months = [
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
  ];
  return `month${months[index - 1]}`;
};

const formatDateString = (date: Date): string =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

const compareDateWithFormat = (
  dateWithFormat1: DateWithFormat,
  dateWithFormat2: DateWithFormat,
) => {
  if (dateWithFormat1.time < dateWithFormat2.time) {
    return -1;
  } else if (dateWithFormat1.time > dateWithFormat2.time) {
    return 1;
  }

  return 0;
};
const getDateForAnalytics = (analyticsData: AnalyticsResponse) => {
  let { month, year } = analyticsData;
  let dateFormat = MONTH_AND_YEAR_DATE_FORMAT;

  // when the API returns month = 0, this means that only year should be used as time value

  if (month === 0) {
    // set month to 1 so it can be parsed correctly in the Date class

    month = 1;
    dateFormat = YEAR_ONLY_DATE_FORMAT;
  }

  const date = new Date(year, month - 1);

  const dateWithFormat: DateWithFormat = {
    time: date,
    format: dateFormat,
  };

  return dateWithFormat;
};

const compareDate = (timeData1: AnalyticsResponse, timeData2: AnalyticsResponse) => {
  const dateWithFormat1 = getDateForAnalytics(timeData1);
  const dateWithFormat2 = getDateForAnalytics(timeData2);

  return compareDateWithFormat(dateWithFormat1, dateWithFormat2);
};
const formatDateForChart = (dateWithFormat: DateWithFormat) => {
  const formattedDate = moment(dateWithFormat.time).format(dateWithFormat.format);

  return formattedDate;
};

const defaultFromDate = () => {
  const now = new Date();

  now.setFullYear(now.getFullYear() - 1);

  return now.toISOString().split('T')[0];
};

const defaultToDate = () => {
  const now = new Date();

  now.setFullYear(now.getFullYear() + 1);

  return now.toISOString().split('T')[0];
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
  currentYearAndMonth,
  translateMonth,
  formatDateString,
  formatDateForChart,
  getDateForAnalytics,
  compareDateWithFormat,
  defaultFromDate,
  defaultToDate,
  compareDate,
};
