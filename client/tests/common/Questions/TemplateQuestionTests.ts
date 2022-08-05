import { kStringMaxLength } from 'buffer';
import { string } from 'yup';
import { Question } from '../../../src/common/Questions/Question';
import { QuestionItem } from '../../../src/common/Questions/QuestionItem';
import { testSetAndGetHOF } from '../../testUtils';

export const IdTest = <ID, QuestionType extends QuestionItem<ID>>(
  id: ID,
  questionCreator: (id: ID) => QuestionType,
): void => {
  testSetAndGetHOF({
    testName: `Should be able to create and get question ID`,
    setter: questionCreator,
    getter: (question) => question.getId(),
    mapping: (id) => id,
    prop: id,
  });
};

export const PromptTest = <T, QuestionType extends Question<unknown, T>>(
  prompt: string,
  questionCreator: (prompt: string) => QuestionType,
): void => {
  testSetAndGetHOF({
    testName: `Should be able to create and get question prompt`,
    setter: questionCreator,
    getter: (question) => question.getPrompt(),
    mapping: (prompt) => prompt,
    prop: prompt,
  });
};
