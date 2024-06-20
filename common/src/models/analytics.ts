export type AnalyticsQuery = {
  departmentIds: string;
  questionId: string;
  startDate: string;
  endDate: string;
  timeStep: 'month' | 'year';
  aggregateBy: 'month' | 'year';
};
