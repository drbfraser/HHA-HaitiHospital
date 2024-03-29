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

export const userLocale = navigator.language;
