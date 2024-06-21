export type DepartmentQuestion = {
  departmentId: string;
  questionId: string;
};
export type AnalyticsRequestBody = {
  departmentQuestions: DepartmentQuestion[];
  startDate: string;
  endDate: string;
  timeStep: 'month' | 'year';
  aggregateBy: 'month' | 'year';
};

export type AnalyticsResponse = {
  month: number;
  year: number;
  departmentId: string;
  answer: number;
  questionId: string;
};

export type AnalyticsQuestionRequestBody = {
  departmentIds: string[];
};

export interface AnalyticsQuestionResponse {
  en: string;
  fr: string;
  id: string;
  departmentId: string;
}
