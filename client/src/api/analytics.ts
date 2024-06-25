import { AnalyticsQuery, AnalyticsResponse, QuestionPrompt } from '@hha/common';
import Api from 'actions/Api';
import { ENDPOINT_ANALYTICS, ENDPOINT_ANALYTICS_GET_QUESTIONS } from 'constants/endpoints';
import { History } from 'history';

export const getAllQuestionPrompts = async (history: History, departmentId: string) => {
  const controller = new AbortController();

  const departmentQuery = { departmentId };

  try {
    const questionPrompts: QuestionPrompt[] = await Api.Get(
      ENDPOINT_ANALYTICS_GET_QUESTIONS,
      'Error fetching questions',
      history,
      controller.signal,
      departmentQuery,
    );

    return questionPrompts;
  } catch (error) {
    console.error('Error fetching questions for a department: ', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const getAnalyticsData = async (history: History, analyticsQuery: AnalyticsQuery) => {
  const controller = new AbortController();

  try {
    const analytics: AnalyticsResponse[] = await Api.Get(
      ENDPOINT_ANALYTICS,
      'Error fetching analytics',
      history,
      controller.signal,
      analyticsQuery,
    );
    return analytics;
  } catch (error) {
    console.error('Error fetching analytics for a department: ', error);
  } finally {
    controller.abort();
  }
};
