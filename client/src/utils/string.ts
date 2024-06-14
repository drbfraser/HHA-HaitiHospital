export const toSnakeCase = (str: string) => str.toLowerCase().replaceAll(' ', '_');

export const refornatQuestionPrompt = (questionId: string, questionPrompt: string) => {
  let formattedQuestionId = questionId.replaceAll('_', '.');

  const qRegex = /(q|Q)/g;

  formattedQuestionId = formattedQuestionId.replace(qRegex, '');

  return formattedQuestionId + '-' + questionPrompt;
};
