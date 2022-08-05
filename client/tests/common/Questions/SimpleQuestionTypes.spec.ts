import { expect } from 'chai';
import { number } from 'yup';
import { Question } from '../../../src/common/Questions/Question';
import { NumericQuestion, TextQuestion } from '../../../src/common/Questions/SimpleQuestionTypes';
import { ObjectSerializer } from '../../../src/common/Serializer/ObjectSerializer';
import {
  answerTest,
  idTest,
  promptTest,
  serializableQuestionTest,
  validationTest,
} from './TemplateQuestionTests';

describe('SimpleQuestions', function () {
  describe('NumericQuestion', function () {
    const DEFAULT_ID: number = 1;
    const DEFAULT_PROMPT: string = 'What is Age of Patient?';
    const DEFAULT_ANSWER: number = 19;

    idTest(
      DEFAULT_ID,
      (id: number): NumericQuestion<number, unknown> =>
        new NumericQuestion<number, unknown>(id, DEFAULT_PROMPT),
    );

    promptTest<number, NumericQuestion<number, unknown>>(
      DEFAULT_PROMPT,
      (prompt: string) => new NumericQuestion<number, unknown>(DEFAULT_ID, prompt),
    );

    answerTest<number, NumericQuestion<number, unknown>>(
      DEFAULT_ANSWER,
      () => new NumericQuestion<number, unknown>(DEFAULT_ID, DEFAULT_PROMPT),
    );

    validationTest<number, NumericQuestion<number, string>>(
      () => new NumericQuestion<number, string>(DEFAULT_ID, DEFAULT_PROMPT),
      DEFAULT_ANSWER,
    );

    serializableQuestionTest(
      () => {
        let question = new NumericQuestion<number, unknown>(DEFAULT_ID, DEFAULT_PROMPT);
        question.setAnswer(DEFAULT_ANSWER);
        return question;
      },
      (deserialized) => expect(deserialized).to.be.instanceof(NumericQuestion),
      (deserialized) => expect(deserialized.getId()).to.be.equal(DEFAULT_ID),
      (deserialized) => expect(deserialized.getPrompt()).to.be.equal(DEFAULT_PROMPT),
      (deserialized) => expect(deserialized.getAnswer()).to.be.equal(DEFAULT_ANSWER),
    );
  });
});
