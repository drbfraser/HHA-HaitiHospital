import { AnalyticsResponse, DepartmentJson, QuestionPrompt } from '@hha/common';
import { refornatQuestionPrompt } from './string';

export const findDepartmentIdByName = (departments: DepartmentJson[], departmentName: string) => {
  return departments.find((department) => department.name == departmentName)?.id;
};

export const getAllDepartmentNames = (departments: DepartmentJson[]) => {
  return departments.map((department) => department.name);
};

export const separateTimeAndQuestionData = (
  analyticsData: AnalyticsResponse[],
): [string[], number[]] => {
  const timeData: string[] = [];
  const questionData: number[] = [];

  analyticsData.forEach((analyticData) => {
    timeData.push(analyticData.time);
    questionData.push(analyticData.answer);
  });

  return [timeData, questionData];
};

export const getQuestionFromId = (questionPrompts: QuestionPrompt[], questionId: string) => {
  const questionPrompt = questionPrompts.find(
    (questionPrompt) => questionPrompt.id === questionId,
  )!;

  return refornatQuestionPrompt(questionPrompt.id, questionPrompt.en);
};

export const sumUpAnalyticsData = (analyticsData: AnalyticsResponse[]) => {
  let sum = 0;

  analyticsData.forEach((analyticData) => (sum += analyticData.answer));

  return sum;
};
