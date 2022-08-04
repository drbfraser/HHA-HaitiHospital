import { expect } from 'sinon';
import { NumericQuestion, TextQuestion } from '../../../src/common/Questions/SimpleQuestionTypes';
import { ObjectSerializer } from '../../../src/common/Serializer/ObjectSerializer';

describe('SimpleQuestions', function () {
  describe('NumericQuestion', function () {
    it('Should be able to Serialize and Deserialize Numeric Questions', function () {
      //Arrange
      let objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
      let numericQuestion: NumericQuestion<number> = new NumericQuestion<number>(
        1,
        'What is Age of Patient?',
      );
      //Act
      let json: string = objectSerializer.serialize(numericQuestion);
      let newNumericQuestion: NumericQuestion<number> = objectSerializer.deserialize(json);
      //Assert
      expect(newNumericQuestion).to.be.instanceof(NumericQuestion);
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
