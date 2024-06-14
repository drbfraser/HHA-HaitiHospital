export type AnalyticsQuery = {
  departmentIds: string;
  questionId: string;
  startDate: string;
  endDate: string;
  timeStep: string;
  aggregateBy: string;
};

export type AnalyticsResponse = {
  time: string;
  departmentId: string;
  answer: number;
};
