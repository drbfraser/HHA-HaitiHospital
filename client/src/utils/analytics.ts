import { AnalyticsQuery, AnalyticsResponse, DepartmentJson, MonthOrYearOption } from '@hha/common';
import { formatQuestion, separateDepartmentAndQuestion } from './string';
import { YEAR_DASH_MONTH_FORMAT } from 'constants/date';
import moment from 'moment';
import {
  AnalyticsMap,
  QuestionMap,
  QuestionPromptUI,
  TimeOptions,
} from 'pages/analytics/Analytics';
import { DataSet, DataSetMap } from 'components/charts/ChartSelector';
import { compareDateWithFormat, formatDateForChart, getDateForAnalytics } from './dateUtils';
import i18next from 'i18next';

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

export const findQuestion = (questionId: string, questions: QuestionPromptUI[]) => {
  return questions.find((question) => question.id === questionId)!;
};
export const prepareAnalyticsQuery = (
  departmentId: string,
  questionId: string,
  aggregateBy: MonthOrYearOption,
  timeOptions: TimeOptions,
): AnalyticsQuery => {
  // date in API calls have to be in ISO format as defined by backend

  const startDate = moment(timeOptions.from, YEAR_DASH_MONTH_FORMAT).toISOString();
  const endDate = moment(timeOptions.to, YEAR_DASH_MONTH_FORMAT).toISOString();

  const analyticsQuery: AnalyticsQuery = {
    departmentId: departmentId,
    questionId: questionId,
    startDate: startDate,
    endDate: endDate,
    aggregateBy: aggregateBy,
    timeStep: timeOptions.timeStep,
  };

  return analyticsQuery;
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

  // when multiple questions from the same department are analyzed, they share the same time data
  //so, use a set to remove duplicate time data

  const noDuplicateTimeData = new Set(formattedTimeData);

  return Array.from(noDuplicateTimeData);
};

const isTimeInAnalyticsData = (analyticsData: AnalyticsResponse, time: string) => {
  const date = getDateForAnalytics(analyticsData);
  const formattedDate = formatDateForChart(date);
  return formattedDate === time;
};

const fillUpDataSet = (timeData: string[], analyticsData: AnalyticsResponse[]) => {
  const dataSets: DataSet[] = [];

  //every dataset will have the same sorted time data

  timeData.forEach((time) => {
    const analyticData = analyticsData.find((analyticData) =>
      isTimeInAnalyticsData(analyticData, time),
    );

    const dataSet: DataSet = {
      x: '',
      y: 0,
    };

    // if time data is present in dataset, assign a non-null y value to represent the answer to the question
    if (analyticData) {
      dataSet.x = time;
      dataSet.y = analyticData.answer;
    } else {
      dataSet.x = time;

      //if time data is not present in dataset, assign a null y-value indicating that chartjs should skip that data point
      dataSet.y = null;
    }

    dataSets.push(dataSet);
  });

  return dataSets;
};
export const prepareDataSetForChart = (analyticsMap: AnalyticsMap): DataSetMap => {
  // we would like to sort time data from ascending to descendig order across all datasets
  // we cannot simply sort each time data in each data set as this does not mean the overall time data will be sorted, example:
  //  dataset1: {Jan 2024, Feb 2024, Mar 2024, Aug 2024} (sorted), dataset2: {Feb 2024, June 2024} (sorted)
  //  result: {Jan 2024, Feb 2024, Mar 2024, Aug 2024, June 2024}
  //solution:
  // - sort all time data regardless of data set
  // - every dataset will have the same sorted time data (that is, every time data)
  // - if time data was not initially present in dataset, then assign the y value of the datapoint as null
  // - when a datapoint's y value is null, chartjs library ignores the datapoint in the chart
  // - this guarantees that the timedata is sorted

  const dataSetMap: DataSetMap = {};

  // sort all time data regardless of data set

  const timeData = getSortedTimeData(analyticsMap);

  Object.keys(analyticsMap).forEach((departmentQuestionKey) => {
    const dataSet = fillUpDataSet(timeData, analyticsMap[departmentQuestionKey]);

    dataSetMap[departmentQuestionKey] = dataSet;
  });

  return dataSetMap;
};

export const sumUpAnalyticsData = (analyticsData: AnalyticsResponse[]) => {
  let sum = 0;

  analyticsData.forEach((analyticData) => (sum += analyticData.answer));

  return sum;
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

export const translateChartLabel = (label: string, questionMap: QuestionMap) => {
  // provide translations for french and english
  //label is in the format <department> + <question id>

  const [department, questionId] = separateDepartmentAndQuestion(label);

  // the original question object that contains french and english translation is needed

  const questionPrompt = findQuestion(questionId, questionMap[department]);

  const departmentTranslated = i18next.t(`departments.${department}`);

  const questionTranslated = formatQuestion(questionPrompt, i18next.language);

  const forTranslated = i18next.t('analyticsFor');

  return `${questionTranslated} ${forTranslated} ${departmentTranslated}`;
};

const isTimeInYearOnlyFormat = (time: string) => {
  // space is the delimeter in the time format: Jan 2024
  //there are two time formats: Jan 2024 or 2024 (MMM YYYY or YYYY)
  return time.split(' ').length <= 1;
};
export const translateTimeCategory = (dataSets: DataSet[]) => {
  if (dataSets.length === 0) {
    return dataSets;
  }

  if (isTimeInYearOnlyFormat(dataSets[0].x)) {
    return dataSets;
  }

  return dataSets.map((dataSet) => {
    const time = dataSet.x;

    const [month, year] = time.split(' ');

    const translatedMonth = i18next.t(`months.${month}`);

    const translatedDataSet: DataSet = {
      x: `${translatedMonth} ${year}`,
      y: dataSet.y,
    };

    return translatedDataSet;
  });
};
