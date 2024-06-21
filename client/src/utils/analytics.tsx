import { AnalyticsQuestionResponse, AnalyticsResponse, DepartmentJson } from '@hha/common';
import { refornatQuestionPrompt } from './string';
import { MONTH_AND_YEAR_DATE_FORMAT, YEAR_ONLY_DATE_FORMAT } from 'constants/date';
import moment from 'moment';

export const findDepartmentIdsByNames = (
  departments: DepartmentJson[],
  selectedDepartmentNames: string[],
) => {
  const departmentIds: string[] = [];

  selectedDepartmentNames.forEach((selectedDepartment) => {
    departments.forEach((department) => {
      if (department.name === selectedDepartment) {
        departmentIds.push(department.id);
      }
    });
  });

  return departmentIds;
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
    let dateFormat = MONTH_AND_YEAR_DATE_FORMAT;
    let { month, year } = analyticData;

    if (month === 0) {
      dateFormat = YEAR_ONLY_DATE_FORMAT;
      month = 1;
    }

    const formattedDate = moment(new Date(year, month - 1)).format(dateFormat);
    timeData.push(formattedDate);
    questionData.push(analyticData.answer);
  });

  return [timeData, questionData];
};

export const getQuestionFromId = (
  questionPrompts: AnalyticsQuestionResponse[],
  questionId: string,
) => {
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
