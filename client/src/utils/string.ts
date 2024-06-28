import { QUESTION_FOR_REGEX } from 'constants/strings';

export const toSnakeCase = (str: string) => str.toLowerCase().replaceAll(' ', '_');

export const reformatQuestionPrompt = (questionId: string, questionPrompt: string) => {
  let formattedQuestionId = questionId.replaceAll('_', '.');

  const qRegex = /(q|Q)/g;

  formattedQuestionId = formattedQuestionId.replace(qRegex, '');

  const questionForRegex = QUESTION_FOR_REGEX;

  questionPrompt = questionPrompt.replace(questionForRegex, '');

  return formattedQuestionId + '-' + questionPrompt;
};

export const createAnalyticsKey = (department: string, questionId: string) => {
  return `${department}+${questionId}`;
};
