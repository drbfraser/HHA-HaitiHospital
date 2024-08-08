import { ITemplate } from 'models/template';
import {
  ANSWER_INDENTIFIER,
  CLASS_KEY,
  COMPOSITE_QUESTION_IDENTIFIER,
  EXPANDABLE_QUESTION_IDENTIFIER,
  KEY_FOR_QUESTIONS,
  NUMERIC_QUESTION_IDENTIFIER,
  QUESTION_IDENTIFIER,
} from './constants';
import { AnalyticsForMonths } from 'routes/api/analytics';
import { AnalyticsResponse, IReport, QuestionPrompt } from '@hha/common';

type AggregatePiplelineParams = {
  departmentId: string;
  startDate: Date;
  endDate: Date;
  dateFormat: string;
};

export const createAnalyticsPipeline = ({
  departmentId,
  startDate,
  endDate,
  dateFormat,
}: AggregatePiplelineParams) => {
  return [
    {
      $match: {
        $and: [
          {
            departmentId: {
              $eq: departmentId,
            },
          },
          {
            reportMonth: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        yearMonth: {
          $dateToString: {
            date: '$reportMonth',
            format: dateFormat,
          },
        },
      },
    },
    {
      $group: {
        _id: '$yearMonth',
        reports: {
          $push: '$$ROOT',
        },
      },
    },
  ];
};

const recursivelyGetQuestionAnswers = (obj: any, questionId: string, answer: number[]) => {
  Object.keys(obj).forEach((key) => {
    // I am using prompt key and id key as an identifier for a question
    //Because, id key could be used to identify an object, but the object does not contain a question

    if (key == KEY_FOR_QUESTIONS && obj[QUESTION_IDENTIFIER] == questionId) {
      answer[0] = obj[ANSWER_INDENTIFIER];
    }

    if (typeof obj[key] == 'object') {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((subReport: any) => {
          recursivelyGetQuestionAnswers(subReport, questionId, answer);
        });
      } else {
        recursivelyGetQuestionAnswers(obj[key], questionId, answer);
      }
    }
  });
};

export const getAnswerInReport = (report: IReport, questionId: string) => {
  // using an array of element 1 instread of a variable to pass the variable as a reference in recursive calls
  // this helps avoid complex logic of the return statements in the recursive function, improving readability
  const answer = [0];

  recursivelyGetQuestionAnswers(report, questionId, answer);

  return answer[0];
};
const recursivelyParseQuestions = (template: any, result: QuestionPrompt[]) => {
  /***
   * This function extracts all the questions (both nested and not nested) for the analytics feature
   * We want to flatten the questions since questions are nested. This will make it easier to analyze
   *  - Loop through all the key-value pairs in template
   *  - if value at template[key] is an object, then template[key] is either an object or an array
   *      - if template[key] is an array, then recur on the array's element
   *      - if template[key] is an object, then recur on the object's value
   * - We use "prompt" as an identifier for a question and we are only intersted in questions of type:
   *  - NumericQuestion
   *  - ExpandableQuestion
   *  - CompositionQuestion
   * - We chose these 3 types because they are questions that have numeric answers from looking at template data
   */
  Object.keys(template).forEach((key) => {
    if (
      key == KEY_FOR_QUESTIONS &&
      (template[CLASS_KEY] == NUMERIC_QUESTION_IDENTIFIER ||
        template[CLASS_KEY] == EXPANDABLE_QUESTION_IDENTIFIER ||
        template[CLASS_KEY] == COMPOSITE_QUESTION_IDENTIFIER)
    ) {
      result.push({ ...template[key], id: template[QUESTION_IDENTIFIER] });
      return;
    }

    if (typeof template[key] == 'object') {
      if (Array.isArray(template[key])) {
        template[key].forEach((subTemplate: any) => {
          recursivelyParseQuestions(subTemplate, result);
        });
      } else {
        recursivelyParseQuestions(template[key], result);
      }
    }
  });
};

export const parseQuestions = (template: ITemplate) => {
  const result: QuestionPrompt[] = [];

  recursivelyParseQuestions(template, result);

  return result;
};

export const removeMonthsByTimeStep = (
  analyticsForMonths: AnalyticsForMonths[],
  startDate: Date,
) => {
  /**
   * remove dates that do not follow time step of a year
   * e.g, assume start date is June 2023, then the valid sequence of dates should be June 2023, June 2024, June 2025 ...
   */

  return analyticsForMonths.filter((analyticsForMonth) => {
    const yearMonth = analyticsForMonth._id.split(' ');

    //getMonth() returns values in the range [0, 11], so Janurary is 0, February is 1

    return startDate.getMonth() + 1 === +yearMonth[0];
  });
};

type DepartmentMap = {
  [key: string]: number | undefined;
};
export const processAnalytics = (analyticsForMonths: AnalyticsForMonths[], questionId: string) => {
  /**
   * Currently, analytics data is grouped by (month, year)
   * The goal is to sum up answers for each department in each (month, year)
   */
  const analyticsResponses: AnalyticsResponse[] = [];

  analyticsForMonths.forEach((analyticsForMonth) => {
    const departmentMap: DepartmentMap = {};
    analyticsForMonth.reports.forEach((report) => {
      if (!departmentMap[report.departmentId]) {
        departmentMap[report.departmentId] = getAnswerInReport(report, questionId);
      } else {
        departmentMap[report.departmentId]! += getAnswerInReport(report, questionId);
      }
    });

    //the identifier is either "month year" or "year" from query pipeline
    //convert string represntation of date to integer representation (month, year)
    // integer represntation of date is easier to parse on the frontend

    const time: string = analyticsForMonth._id;
    let month = 0;
    let year = 0;

    if (time.includes(' ')) {
      const monthYear = time.split(' ');
      month = +monthYear[0];
      year = +monthYear[1];
    } else {
      year = +time;
    }

    const analyticsResponse = Object.keys(departmentMap).map((departmentId) => {
      const analyticsResponseForDepartment: AnalyticsResponse = {
        month,
        year,
        answer: departmentMap[departmentId]!,
      };

      return analyticsResponseForDepartment;
    });
    analyticsResponses.push(...analyticsResponse);
  });

  return analyticsResponses;
};
