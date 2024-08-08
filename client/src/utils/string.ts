import { QUESTION_FOR_REGEX, QUESTION_IDENTIFIER_PREFIX } from 'constants/strings';
import { QuestionPromptUI } from 'pages/analytics/Analytics';

export const toSnakeCase = (str: string) => str.toLowerCase().replaceAll(' ', '_');

export const reformatQuestionPrompt = (questionId: string, questionPrompt: string) => {
  let formattedQuestionId = questionId.replaceAll('_', '.');

  const qRegex = /(q|Q)/g;

  formattedQuestionId = formattedQuestionId.replace(qRegex, '');

  const questionForRegex = QUESTION_FOR_REGEX;

  questionPrompt = questionPrompt.replace(questionForRegex, '');

  // represent question display string in the format (Q <question id>)-<question prompt>

  return `(${QUESTION_IDENTIFIER_PREFIX} ${formattedQuestionId})-${questionPrompt}`;
};

export const createAnalyticsKey = (department: string, questionId: string) => {
  return `${department}+${questionId}`;
};

export const separateDepartmentAndQuestion = (departmentQuestion: string): string[] => {
  return departmentQuestion.split('+');
};

export const formatQuestion = (questionPrompt: QuestionPromptUI, currentLanguage: string) => {
  // it may be the case that there is no French translation for a question, fallback to English

  const shouldQuestionBeEnglish = currentLanguage === 'en' || !questionPrompt.fr;

  const question = shouldQuestionBeEnglish ? questionPrompt.en : questionPrompt.fr;

  return reformatQuestionPrompt(questionPrompt.id, question);
};
