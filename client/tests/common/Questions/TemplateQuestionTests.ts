import { expect } from 'chai';
import { Question, ValidationResult } from '../../../src/common/Questions/Question';
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

export const promptTest = <T, QuestionType extends Question<unknown, T, unknown>>(
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

export const answerTest = <T, QuestionType extends Question<unknown, T, unknown>>(
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

export const validationTest = <T, QuestionType extends Question<unknown, T, string>>(
  questionCreator: () => QuestionType,
  sampleAnswer: T,
): void => {
  const MAX_VALIDATION_ARRAY_SIZE = 5;

  const getRandomSize = Math.floor(Math.random() * MAX_VALIDATION_ARRAY_SIZE);

  const generateValidValidators = (
    size: number,
  ): Array<(answer?: T) => ValidationResult<string>> => {
    return new Array(size).fill({ isValid: true }).map((validator) => (answer?: T) => validator);
  };

  const getDefaultErrorType = (index: number): string => `ErrorType${index}`;
  const getDefaultMessage = (index: number): string => `Message ${index}`;

  const generateInvalidValidators = (
    size: number,
  ): Array<(answer?: T) => ValidationResult<string>> => {
    return new Array(size).fill({ isValid: false }).map((validator, index) => (answer?: T) => {
      validator.error = getDefaultErrorType(index);
      validator.message = getDefaultMessage(index);
      return validator;
    });
  };

  const addValidators = (
    question: QuestionType,
    validValidators: number,
    invalidValidators: number,
  ): QuestionType => {
    generateValidValidators(validValidators)
      .concat(generateInvalidValidators(invalidValidators))
      .forEach((validator) => question.addValidator(validator));
    return question;
  };

  it(`Should be valid if all validators return valid results`, function () {
    // Arrange/Act
    const validQuestion = questionCreator();
    addValidators(validQuestion, getRandomSize, 0);

    // Assert
    expect(validQuestion.isValid()).to.be.true;
  });

  it(`Should be invalid if one or more validators return invalid results`, function () {
    // Arrange/Act
    const invalidQuestion = questionCreator();
    addValidators(invalidQuestion, getRandomSize, getRandomSize);

    // Assert
    expect(invalidQuestion.isValid()).to.be.false;
  });

  it(`Should act upon undefined if answer has not been set`, function () {
    // Arrange/Act
    const question = questionCreator();
    question.addValidator((answer?: T) =>
      answer === undefined ? { isValid: true } : { isValid: false },
    );

    // Assert
    expect(question.isValid()).to.be.true;
  });

  it(`Validation should act upon set answer`, function () {
    // Arrange/Act
    const question = questionCreator();
    question.setAnswer(sampleAnswer);
    question.addValidator((answer?: T) =>
      answer === sampleAnswer ? { isValid: true } : { isValid: false },
    );

    // Assert
    expect(question.isValid()).to.be.true;
  });

  it.only(`Validation should preserve error type and message`, function () {
    // Arrange/Act
    const question = questionCreator();
    addValidators(question, 0, getRandomSize);

    question.getValidationResults().forEach((result, index) => {
      expect(result.error).to.be.equal(getDefaultErrorType(index));
      expect(result.message).to.be.equal(getDefaultMessage(index));
    });
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
