import { expect } from 'chai';
import { QuestionItem } from '../../../src/common/Questions/QuestionItem';

export const IdTest = <ID, Question extends QuestionItem<ID>>(
  id: ID,
  questionCreator: (id: ID) => Question,
) => {
  return it('Should be able to set and get question ID', function () {
    // Arrange/Act
    let question: Question = questionCreator(id);

    // Assert
    expect(question.getId()).to.be.equal(id);
  });
};
