import { expect } from 'chai';
import { number } from 'yup';
import { Question } from '../../../src/common/Questions/Question';
import { NumericQuestion, TextQuestion } from '../../../src/common/Questions/SimpleQuestionTypes';
import { ObjectSerializer } from '../../../src/common/Serializer/ObjectSerializer';
import { answerTest, idTest, promptTest, serializableQuestionTest } from './TemplateQuestionTests';

describe('SimpleQuestions', function () {
  describe('NumericQuestion', function () {
    const DEFAULT_ID: number = 1;
    const DEFAULT_PROMPT: string = 'What is Age of Patient?';
    const DEFAULT_ANSWER: number = 19;

    interface DefaultExpectations {
      defaultInstanceOf: () => void;
      defaultId: () => void;
      defaultPrompt: () => void;
      defaultAnswer: () => void;
    }

    idTest(
      DEFAULT_ID,
      (id: number): NumericQuestion<number> => new NumericQuestion<number>(id, DEFAULT_PROMPT),
    );

    promptTest<number, NumericQuestion<number>>(
      DEFAULT_PROMPT,
      (prompt: string) => new NumericQuestion<number>(DEFAULT_ID, prompt),
    );

    answerTest<number, NumericQuestion<number>>(
      DEFAULT_ANSWER,
      () => new NumericQuestion<number>(DEFAULT_ID, DEFAULT_PROMPT),
    );

    serializableQuestionTest(
      () => {
        let question = new NumericQuestion<number>(DEFAULT_ID, DEFAULT_PROMPT);
        question.setAnswer(DEFAULT_ANSWER);
        return question;
      },
      (deserialized) => expect(deserialized).to.be.instanceof(NumericQuestion),
      (deserialized) => expect(deserialized.getId()).to.be.equal(DEFAULT_ID),
      (deserialized) => expect(deserialized.getPrompt()).to.be.equal(DEFAULT_PROMPT),
      (deserialized) => expect(deserialized.getAnswer()).to.be.equal(DEFAULT_ANSWER),
    );
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
