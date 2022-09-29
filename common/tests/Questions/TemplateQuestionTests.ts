import { expect } from 'chai';
import { QuestionLeaf, ValidationResult, QuestionNode } from '../../src';
import { serializableTest, testSetAndGetHOF } from '../testUtils';

// Method Test HOF
// ----------------------------------------------------------------------------
export interface IdTestArgs<ID, QuestionType extends QuestionNode<ID, unknown>> {
  id: ID;
  questionCreator: (id: ID) => QuestionType;
}

export const idTest = <ID, QuestionType extends QuestionNode<ID, unknown>>(args: IdTestArgs<ID, QuestionType>): void => {
  testSetAndGetHOF({
    testName: `Should be able to create and get question ID`,
    setter: args.questionCreator,
    getter: (question) => question.getId(),
    mapping: (id) => id,
    prop: args.id
  });
};

export interface PromptTestArgs<T, QuestionType extends QuestionLeaf<unknown, T, unknown>> {
  prompt: string;
  questionCreator: (prompt: string) => QuestionType;
}

export const promptTest = <T, QuestionType extends QuestionLeaf<unknown, T, unknown>>(args: PromptTestArgs<T, QuestionType>): void => {
  testSetAndGetHOF({
    testName: `Should be able to create and get question prompt`,
    setter: args.questionCreator,
    getter: (question) => question.getPrompt(),
    mapping: (prompt) => prompt,
    prop: args.prompt
  });
};

export interface AnswerTestArgs<T, QuestionType extends QuestionLeaf<unknown, T, unknown>> {
  answer: T;
  questionCreator: () => QuestionType;
}

export const answerTest = <T, QuestionType extends QuestionLeaf<unknown, T, unknown>>(args: AnswerTestArgs<T, QuestionType>): void => {
  testSetAndGetHOF<T, QuestionType>({
    testName: `Should be able to set and get question answer`,
    setter: (answerArg) => {
      let question = args.questionCreator();
      question.setAnswer(args.answer);
      return question;
    },
    getter: (question) => question.getAnswer(),
    mapping: (answer) => answer,
    prop: args.answer
  });
};

export interface ValidationTestArgs<T, ErrorType, QuestionType extends QuestionLeaf<unknown, T, ErrorType>> {
  sampleAnswer: T;
  questionCreator: () => QuestionType;
  getDefaultErrorType: (index: number) => ErrorType;
  getDefaultErrorMessage: (index: number) => string;
}

export const validationTest = <T, ErrorType, QuestionType extends QuestionLeaf<unknown, T, ErrorType>>(args: ValidationTestArgs<T, ErrorType, QuestionType>): void => {
  const MAX_VALIDATION_ARRAY_SIZE = 100;

  const getRandomSize = Math.floor(Math.random() * MAX_VALIDATION_ARRAY_SIZE);

  const generateValidValidators = (size: number): Array<(answer?: T) => ValidationResult<ErrorType>> => {
    return new Array(size).fill({ isValid: true }).map((validator) => (answer?: T) => validator);
  };

  const generateInvalidValidators = (size: number): Array<(answer?: T) => ValidationResult<ErrorType>> => {
    return new Array(size).fill({ isValid: false }).map((validator, index) => (answer?: T) => {
      let newValidator: ValidationResult<ErrorType> = {
        ...validator,
        error: args.getDefaultErrorType(index),
        message: args.getDefaultErrorMessage(index)
      };
      return newValidator;
    });
  };

  const addValidators = (question: QuestionType, validValidators: number, invalidValidators: number): QuestionType => {
    generateValidValidators(validValidators)
      .concat(generateInvalidValidators(invalidValidators))
      .forEach((validator) => question.addValidator(validator));
    return question;
  };

  it(`Should be valid if all validators return valid results`, function () {
    // Arrange/Act
    const validQuestion = args.questionCreator();
    addValidators(validQuestion, getRandomSize, 0);

    // Assert
    expect(validQuestion.isValid()).to.be.true;
  });

  it(`Should be invalid if one or more validators return invalid results`, function () {
    // Arrange/Act
    const invalidQuestion = args.questionCreator();
    addValidators(invalidQuestion, getRandomSize, getRandomSize);

    // Assert
    expect(invalidQuestion.isValid()).to.be.false;
  });

  it(`Should act upon undefined if answer has not been set`, function () {
    // Arrange/Act
    const question = args.questionCreator();
    question.addValidator((answer?: T) => (answer === undefined ? { isValid: true } : { isValid: false }));

    // Assert
    expect(question.isValid()).to.be.true;
  });

  it(`Validation should act upon set answer`, function () {
    // Arrange/Act
    const question = args.questionCreator();
    question.setAnswer(args.sampleAnswer);
    question.addValidator((answer?: T) => (answer === args.sampleAnswer ? { isValid: true } : { isValid: false }));

    // Assert
    expect(question.isValid()).to.be.true;
  });

  it(`Validation should preserve error type and message`, function () {
    // Arrange/Act
    const question = args.questionCreator();
    addValidators(question, 0, getRandomSize);

    question.getValidationResults().forEach((result, index) => {
      expect(result.error).to.be.equal(args.getDefaultErrorType(index));
      expect(result.message).to.be.equal(args.getDefaultErrorMessage(index));
    });
  });
};

export interface SerializableQuestionTestArgs<ID, QuestionType extends QuestionNode<ID, unknown>> {
  /*  Here the name is QuestionArranger rather than the default QuestionCreator
      because in this case, it is not sufficient to simply create the question,
      but also to perform any necessary setup so that it can meet the
      expectations under normal conditions.
  */
  questionArranger: () => QuestionType;
  expectations: Array<(deserialized: QuestionType) => void>;
}

// Serialization Testing HOF
// ----------------------------------------------------------------------------

export const serializableQuestionTest = <ID, QuestionType extends QuestionNode<ID, unknown>>(args: SerializableQuestionTestArgs<ID, QuestionType>): void =>
  serializableTest({
    testName: `Serialization and deserialization should work`,
    getObj: args.questionArranger,
    expectations: args.expectations
  });

export interface SimpleQuestionTestsArgs<ID, T, ErrorType> {
  idTestArgs: IdTestArgs<ID, QuestionLeaf<ID, T, unknown>>;
  promptTestArgs: PromptTestArgs<T, QuestionLeaf<ID, T, unknown>>;
  answerTestArgs: AnswerTestArgs<T, QuestionLeaf<ID, T, unknown>>;
  validationTestArgs: ValidationTestArgs<T, ErrorType, QuestionLeaf<ID, T, ErrorType>>;
  serializableQuestionTestArgs: SerializableQuestionTestArgs<ID, QuestionLeaf<ID, T, unknown>>;
}

// Comprehensive Testing Templates
// ----------------------------------------------------------------------------
export const simpleQuestionDefaultTests = <ID, T, ErrorType>(args: SimpleQuestionTestsArgs<ID, T, ErrorType>): void => {
  idTest(args.idTestArgs);
  promptTest(args.promptTestArgs);
  answerTest(args.answerTestArgs);
  validationTest(args.validationTestArgs);
  serializableQuestionTest(args.serializableQuestionTestArgs);
};
