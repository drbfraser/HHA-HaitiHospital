export const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
} as const;

export const monthYearOptions = {
  timeZone: 'UTC',
  month: 'long',
  year: 'numeric',
} as const;

export const toI18nDateString = (dateIsoString: string, locale: string = 'en-us'): string =>
  new Date(dateIsoString).toLocaleDateString(locale, dateOptions);

export const getMonthYear = (item: IReportObject<any>, locale: string = 'en-us'): string =>
  new Date(item.reportMonth).toLocaleDateString(locale, monthYearOptions);

export const getDate = (item: IReportObject<any>, locale: string = 'en-us'): string =>
  new Date(item.submittedDate).toLocaleDateString(locale, dateOptions);

export const userLocale = navigator.language;

export const YEAR_ONLY_DATE_FORMAT = 'YYYY';
export const MONTH_AND_YEAR_DATE_FORMAT = 'MMM YYYY';
export const MONTH_LITERAL = 'month';
export const YEAR_LITERAL = 'year';
export const YEAR_DASH_MONTH_FORMAT = 'YYYY-MM-DD';
