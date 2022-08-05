import { kStringMaxLength } from 'buffer';
import { string } from 'yup';
import { Question } from '../../../src/common/Questions/Question';
import { QuestionItem } from '../../../src/common/Questions/QuestionItem';
import { serializableTest, testSetAndGetHOF } from '../../testUtils';

export const idTest = <ID, QuestionType extends QuestionItem<ID>>(
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

export const promptTest = <T, QuestionType extends Question<unknown, T>>(
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

export const answerTest = <T, QuestionType extends Question<unknown, T>>(
  answer: T,
  questionCreator: () => QuestionType,
): void => {
  testSetAndGetHOF<T, QuestionType>({
    testName: `Should be able to set and get question answer`,
    setter: (answerArg) => {
      let question = questionCreator();
      question.setAnswer(answer);
      return question;
    },
    getter: (question) => question.getAnswer(),
    mapping: (answer) => answer,
    prop: answer,
  });
};

export const serializableQuestionTest = <ID, QuestionType extends QuestionItem<ID>>(
  questionCreator: () => QuestionType,
  ...expectations: Array<(deserialized: QuestionType) => void>
): void =>
  serializableTest({
    testName: `Serialization and deserialization should work`,
    getObj: questionCreator,
    expectations: expectations,
  });
