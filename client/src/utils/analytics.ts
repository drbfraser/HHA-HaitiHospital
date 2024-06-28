import { AnalyticsResponse, DepartmentJson, QuestionPrompt } from '@hha/common';
import { reformatQuestionPrompt } from './string';
import { MONTH_AND_YEAR_DATE_FORMAT, YEAR_ONLY_DATE_FORMAT } from 'constants/date';
import moment from 'moment';
import { AnalyticsMap, QuestionPromptUI } from 'pages/analytics/Analytics';
import { DataSet, DataSetMap } from 'components/charts/ChartSelector';

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

const compareDataSet = (dataSet1: DataSet, dataSet2: DataSet) => {
  if (dataSet1.x < dataSet2.x) {
    return -1;
  } else if (dataSet1.x > dataSet2.x) {
    return 1;
  }

  return 0;
};
export const prepareDataSetForChart = (analyticsMap: AnalyticsMap): DataSetMap => {
  const dataSetMap: DataSetMap = {};
  Object.keys(analyticsMap).forEach((depatmentQuestion) => {
    let dateFormat = MONTH_AND_YEAR_DATE_FORMAT;

    const [department, questionId] = depatmentQuestion.split('+');

    const dataSetsByQuestion: DataSet[] = [];
    analyticsMap[depatmentQuestion].forEach((analyticsData) => {
      let { month, year } = analyticsData;

      if (month === 0) {
        dateFormat = YEAR_ONLY_DATE_FORMAT;
        month = 1;
      }

      const formattedDate = moment(new Date(year, month - 1)).format(dateFormat);

      const dataSet: DataSet = {
        x: formattedDate,
        y: analyticsData.answer,
      };

      dataSetsByQuestion.push(dataSet);
    });

    dataSetsByQuestion.sort(compareDataSet);
    dataSetMap[`${questionId} for ${department}`] = dataSetsByQuestion;
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
