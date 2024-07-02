import { AnalyticsResponse, DepartmentJson, QuestionPrompt } from '@hha/common';
import { reformatQuestionPrompt } from './string';
import { MONTH_AND_YEAR_DATE_FORMAT, YEAR_ONLY_DATE_FORMAT } from 'constants/date';
import moment from 'moment';
import { AnalyticsMap, QuestionPromptUI } from 'pages/analytics/Analytics';
import { DataSet, DataSetMap } from 'components/charts/ChartSelector';
import { compareDateWithFormat, formatDateForChart, getDateForAnalytics } from './dateUtils';
import { time } from 'drizzle-orm/mysql-core';

export const findDepartmentIdByName = (departments: DepartmentJson[], departmentName: string) => {
  return departments.find((department) => department.name === departmentName)?.id;
};

export const filterDepartmentsByReport = (departments: DepartmentJson[]) => {
  return departments.filter((department) => department.hasReport);
};

export const getAllDepartmentsByName = (departments: DepartmentJson[]) => {
  return departments.map((department) => department.name);
};

export const filterQuestionsSelected = (questions: QuestionPromptUI[]) => {
  return questions.filter((question) => question.checked);
};

export type DateWithFormat = {
  time: Date;
  format: string;
};

const getSortedTimeData = (analyticsMap: AnalyticsMap) => {
  const timeData: DateWithFormat[] = [];
  Object.keys(analyticsMap).forEach((dataSet) => {
    analyticsMap[dataSet].forEach((analyticsData) => {
      const time = getDateForAnalytics(analyticsData);
      timeData.push(time);
    });
  });

  timeData.sort(compareDateWithFormat);

  const formattedTimeData = timeData.map((dateWithFormat) => formatDateForChart(dateWithFormat));

  return formattedTimeData;
};

const isTimeInAnalyticsData = (analyticsData: AnalyticsResponse, time: string) => {
  const date = getDateForAnalytics(analyticsData);
  const formattedDate = formatDateForChart(date);
  return formattedDate === time;
};

const fillUpDataSet = (timeData: string[], analyticsData: AnalyticsResponse[]) => {
  const dataSets: DataSet[] = [];

  timeData.forEach((time) => {
    const analyticData = analyticsData.find((analyticData) =>
      isTimeInAnalyticsData(analyticData, time),
    );

    const dataSet: DataSet = {
      x: '',
      y: 0,
    };

    if (analyticData) {
      dataSet.x = time;
      dataSet.y = analyticData.answer;
    } else {
      dataSet.x = time;
      dataSet.y = null;
    }

    dataSets.push(dataSet);
  });

  return dataSets;
};
export const prepareDataSetForChart = (analyticsMap: AnalyticsMap): DataSetMap => {
  const dataSetMap: DataSetMap = {};

  const timeData = getSortedTimeData(analyticsMap);

  Object.keys(analyticsMap).forEach((departmentQuestionKey) => {
    const [department, question] = departmentQuestionKey.split('+');

    const dataSet = fillUpDataSet(timeData, analyticsMap[departmentQuestionKey]);

    dataSetMap[`${question} for ${department}`] = dataSet;
  });

  return dataSetMap;
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

export const createAnalyticsMap = (
  analyticsResponses: AnalyticsResponse[][],
  analyticsMapKeys: string[],
) => {
  const analyticsMap: AnalyticsMap = {};

  analyticsMapKeys.forEach((analyticsMapKey, index) => {
    analyticsMap[analyticsMapKey] = analyticsResponses[index];
  });

  return analyticsMap;
};
