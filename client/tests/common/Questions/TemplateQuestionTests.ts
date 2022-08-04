import { QuestionItem } from '../../../src/common/Questions/QuestionItem';
import { testSetAndGetHOF } from '../../testUtils';

export const IdTest = <ID, Question extends QuestionItem<ID>>(
  id: ID,
  questionCreator: (id: ID) => Question,
): void => {
  testSetAndGetHOF({
    testName: `Should be able to create and get question ID`,
    setter: questionCreator,
    getter: (question) => question.getId(),
    mapping: (id) => id,
    prop: id,
  });
};
