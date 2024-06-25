import { AnalyticsResponse, DepartmentJson, QuestionPrompt } from '@hha/common';
import { reformatQuestionPrompt } from './string';
import { MONTH_AND_YEAR_DATE_FORMAT, YEAR_ONLY_DATE_FORMAT } from 'constants/date';
import moment from 'moment';

export const findDepartmentIdByName = (departments: DepartmentJson[], departmentName: string) => {
  return departments.find((department) => department.name === departmentName)?.id;
};

export const filterDepartmentsByReport = (departments: DepartmentJson[]) => {
  return departments.filter((department) => department.hasReport);
};

export const getAllDepartmentsByName = (departments: DepartmentJson[]) => {
  return departments.map((department) => department.name);
};

export const separateTimeAndQuestionData = (
  analyticsData: AnalyticsResponse[],
): [string[], number[]] => {
  const timeData: string[] = [];
  const questionData: number[] = [];

  analyticsData.forEach((analyticData) => {
    let dateFormat = MONTH_AND_YEAR_DATE_FORMAT;
    let { month, year } = analyticData;

    if (month === 0) {
      dateFormat = YEAR_ONLY_DATE_FORMAT;
      month = 1;
    }

    const formattedDate = moment(new Date(year, month - 1)).format(dateFormat);
    timeData.push(formattedDate);
    timeData.sort();
    questionData.push(analyticData.answer);
  });

  return [timeData, questionData];
};

export const getQuestionFromId = (questionPrompts: QuestionPrompt[], questionId: string) => {
  const questionPrompt = questionPrompts.find(
    (questionPrompt) => questionPrompt.id === questionId,
  )!;

  return reformatQuestionPrompt(questionPrompt.id, questionPrompt.en);
};

export const sumUpAnalyticsData = (analyticsData: AnalyticsResponse[]) => {
  let sum = 0;

  analyticsData.forEach((analyticData) => (sum += analyticData.answer));

  return sum;
};

export const displayTotal = (
  questionPrompts: QuestionPrompt[],
  questionId: string,
  analyticsData: AnalyticsResponse[],
) => {
  const question = getQuestionFromId(questionPrompts, questionId);

  const total = sumUpAnalyticsData(analyticsData);

  return `Total ${question}: ${total}`;
};
