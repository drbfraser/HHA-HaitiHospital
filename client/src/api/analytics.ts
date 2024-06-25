import {
  AnalyticsQuestionRequestBody,
  AnalyticsQuestionResponse,
  AnalyticsRequestBody,
  AnalyticsResponse,
} from '@hha/common';
import { ENDPOINT_ANALYTICS, ENDPOINT_ANALYTICS_GET_QUESTIONS } from 'constants/endpoints';
import axios from 'axios';

export const getAllQuestionPrompts = async (
  analyticsQuestionBody: AnalyticsQuestionRequestBody,
) => {
  try {
    const response = await axios.post<AnalyticsQuestionResponse[]>(
      ENDPOINT_ANALYTICS_GET_QUESTIONS,
      analyticsQuestionBody,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching questions for a department: ', error);
  }
};

export const getAnalyticsData = async (analyticsRequestBody: AnalyticsRequestBody) => {
  const controller = new AbortController();

  try {
    const response = await axios.post<AnalyticsResponse[]>(
      ENDPOINT_ANALYTICS,
      analyticsRequestBody,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics for a department: ', error);
  } finally {
    controller.abort();
  }
};
