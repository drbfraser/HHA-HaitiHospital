export type AnalyticsQuery = {
  departmentId: string;
  questionId: string;
  startDate: string;
  endDate: string;
  timeStep: 'month' | 'year';
  aggregateBy: 'month' | 'year';
};

export type AnalyticsResponse = {
  departmentId: string;
  month: number;
  year: number;
  answer: number;
};

export type MonthOrYearOption = 'month' | 'year';
