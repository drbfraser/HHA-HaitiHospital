import { expect } from 'chai';
import { deserialize } from 'v8';
import { number, string } from 'yup';
import { Question } from '../../../src/common/Questions/Question';
import { NumericQuestion, TextQuestion } from '../../../src/common/Questions/SimpleQuestionTypes';
import { ObjectSerializer } from '../../../src/common/Serializer/ObjectSerializer';
import {
  answerTest,
  idTest,
  promptTest,
  serializableQuestionTest,
  simpleQuestionDefaultTests,
  validationTest,
} from './TemplateQuestionTests';

describe('SimpleQuestions', function () {
  describe('NumericQuestion', function () {
    const DEFAULT_ID: number = 1;
    const DEFAULT_PROMPT: string = 'What is Age of Patient?';
    const DEFAULT_ANSWER: number = 19;

    simpleQuestionDefaultTests<number, number, string>({
      idTestArgs: {
        id: DEFAULT_ID,
        questionCreator: (id) => new NumericQuestion(id, DEFAULT_PROMPT),
      },
      promptTestArgs: {
        prompt: DEFAULT_PROMPT,
        questionCreator: (prompt) => new NumericQuestion(DEFAULT_ID, prompt),
      },
      answerTestArgs: {
        answer: DEFAULT_ANSWER,
        questionCreator: () => new NumericQuestion(DEFAULT_ID, DEFAULT_PROMPT),
      },
      validationTestArgs: {
        sampleAnswer: DEFAULT_ANSWER,
        questionCreator: () => new NumericQuestion(DEFAULT_ID, DEFAULT_PROMPT),
        getDefaultErrorType: (number) => `ErrorType${number}`,
        getDefaultErrorMessage: (number) => `Error Message ${number}`,
      },
      serializableQuestionTestArgs: {
        questionArranger: () => {
          let question = new NumericQuestion(DEFAULT_ID, DEFAULT_PROMPT);
          question.setAnswer(DEFAULT_ANSWER);
          return question;
        },
        expectations: [
          (deserialized) => expect(deserialized).to.be.instanceof(NumericQuestion),
          (deserialized) => expect(deserialized.getId()).to.be.equal(DEFAULT_ID),
          (deserialized) => expect(deserialized.getPrompt()).to.be.equal(DEFAULT_PROMPT),
          (deserialized) => expect(deserialized.getAnswer()).to.be.equal(DEFAULT_ANSWER),
        ],
      },
    });
  });

  describe('TextQuestion', function () {
    const DEFAULT_ID: number = 3;
    const DEFAULT_PROMPT: string = "What's the magic word?";
    const DEFAULT_ANSWER: string = 'sudo';

    simpleQuestionDefaultTests<number, string, string>({
      idTestArgs: {
        id: DEFAULT_ID,
        questionCreator: (id) => new TextQuestion(id, DEFAULT_PROMPT),
      },
      promptTestArgs: {
        prompt: DEFAULT_PROMPT,
        questionCreator: (prompt) => new TextQuestion(DEFAULT_ID, prompt),
      },
      answerTestArgs: {
        answer: DEFAULT_ANSWER,
        questionCreator: () => new TextQuestion(DEFAULT_ID, DEFAULT_PROMPT),
      },
      validationTestArgs: {
        sampleAnswer: DEFAULT_ANSWER,
        questionCreator: () => new TextQuestion(DEFAULT_ID, DEFAULT_PROMPT),
        getDefaultErrorType: (number) => `ErrorType${number}`,
        getDefaultErrorMessage: (number) => `Error Message ${number}`,
      },
      serializableQuestionTestArgs: {
        questionArranger: () => {
          let question = new TextQuestion(DEFAULT_ID, DEFAULT_PROMPT);
          question.setAnswer(DEFAULT_ANSWER);
          return question;
        },
        expectations: [
          (deserialized) => expect(deserialized).to.be.instanceof(TextQuestion),
          (deserialized) => expect(deserialized.getId()).to.be.equal(DEFAULT_ID),
          (deserialized) => expect(deserialized.getPrompt()).to.be.equal(DEFAULT_PROMPT),
          (deserialized) => expect(deserialized.getAnswer()).to.be.equal(DEFAULT_ANSWER),
        ],
      },
    });
  });
});
