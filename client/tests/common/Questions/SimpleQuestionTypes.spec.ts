import { expect } from 'chai';
import { NumericQuestion, TextQuestion } from '../../../src/common/Questions/SimpleQuestionTypes';
import { ObjectSerializer } from '../../../src/common/Serializer/ObjectSerializer';

describe('SimpleQuestions', function () {
  describe('NumericQuestion', function () {
    const DEFAULT_ID: number = 1;
    const DEFAULT_QUESTION_PROMPT: string = 'What is Age of Patient?';
    const DEFAULT_ANSWER: number = 19;

    it('Should be able to Serialize and Deserialize Numeric Questions', function () {
      //Arrange

      let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      let numericQuestion: NumericQuestion<number> = new NumericQuestion<number>(
        DEFAULT_ID,
        DEFAULT_QUESTION_PROMPT,
      );
      numericQuestion.setAnswer(DEFAULT_ANSWER);

      //Act
      let json: string = objectSerializer.serialize(numericQuestion);
      let newNumericQuestion: NumericQuestion<number> = objectSerializer.deserialize(json);

      //Assert
      expect(newNumericQuestion).to.be.instanceof(NumericQuestion);
      expect(newNumericQuestion.getId()).to.be.equal(1);
      expect(newNumericQuestion.getPrompt()).to.be.equal(DEFAULT_QUESTION_PROMPT);
      expect(newNumericQuestion.getAnswer()).to.be.equal(DEFAULT_ANSWER);
    });
  });

  describe('TextQuestion', function () {
    it('Should be able to Serialize and Deserialize Text Questions', function () {
      //Arrange
      let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      let textQuestion: TextQuestion<number> = new TextQuestion<number>(
        1,
        'What is Age of Patient?',
      );
      //Act
      let json: string = objectSerializer.serialize(textQuestion);
      let newNumericQuestion: TextQuestion<number> = objectSerializer.deserialize(json);
      //Assert
      expect(newNumericQuestion).to.be.instanceof(TextQuestion);
    });
  });
});
