import { QUESTION_FOR_REGEX } from 'constants/strings';

export const toSnakeCase = (str: string) => str.toLowerCase().replaceAll(' ', '_');

export const refornatQuestionPrompt = (questionId: string, questionPrompt: string) => {
  let formattedQuestionId = questionId.replaceAll('_', '.');

  const qRegex = /(q|Q)/g;

  formattedQuestionId = formattedQuestionId.replace(qRegex, '');

  const questionForRegex = QUESTION_FOR_REGEX;

  formattedQuestionId = formattedQuestionId.replace(questionForRegex, '');

  return formattedQuestionId + '-' + questionPrompt;
};
