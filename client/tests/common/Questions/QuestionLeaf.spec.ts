import { QuestionLeaf, ValidationResult } from "../../../src/common/Questions/QuestionLeaf";
import { QuestionNodeTest, QuestionNodeTestArgs } from "./QuestionNode.spec";
import { expect } from 'chai';
import { TEST_ARGS_MSG, TEST_CLASS_MSG } from "../../Constants";

export interface QuestionLeafTestArgs<ID, T, ErrorType> extends QuestionNodeTestArgs<ID, ErrorType> {
  defaultPrompt: string,

  answerEqual: (answer1: T, answer2: T) => boolean,
  defaultAnswer: T,
  alternativeAnswer: T

  sampleValidator: (answer?: T) => ValidationResult<ErrorType>;
  validAnswer: T;
  invalidAnswer: T;
}

export abstract class QuestionLeafTest<ID, T, ErrorType> extends QuestionNodeTest<ID, ErrorType> {

  private readonly questionLeafConstructor: (id: ID, prompt: string, defaultAnswer?: T) => QuestionLeaf<ID, T, ErrorType>;
  private readonly answerEqual: (answer1: T, answer2: T) => boolean;

  // Must be valid when given validAnswer and invalid when given invalidAnswer for correct testing.
  private readonly sampleValidator: (answer?: T) => ValidationResult<ErrorType>;

  private readonly questionLeafDefaultId: ID;
  private readonly defaultPrompt: string;
  private readonly defaultAnswer: T;
  private readonly validAnswer: T;
  private readonly invalidAnswer: T;
  private readonly alternativeAnswer: T;

  constructor(
    questionLeafConstructor: (id: ID, prompt: string, defaultAnswer?: T) => QuestionLeaf<ID, T, ErrorType>,
    args: QuestionLeafTestArgs<ID, T, ErrorType>
  ) {
    super(
      (id: ID) => questionLeafConstructor(id, args.defaultPrompt),
      args
    );

    this.questionLeafConstructor = questionLeafConstructor;
    this.answerEqual = args.answerEqual;
    this.sampleValidator = args.sampleValidator;

    this.defaultPrompt = args.defaultPrompt;
    this.defaultAnswer = args.defaultAnswer;
    this.alternativeAnswer = args.alternativeAnswer;
    this.validAnswer = args.validAnswer;
    this.invalidAnswer = args.invalidAnswer;

    this.addTests(
      this.testGetPrompt,
      this.testGetAndSetAnswer,
      this.testIsValid,
      this.testValidationResults
    );
  }

  public readonly testGetPrompt = (): void => {
    describe(TEST_ARGS_MSG, () => {
      it('Should get prompt that was passed during object instantiation', () => {
        let questionLeaf = this.questionLeafConstructor(this.questionLeafDefaultId, this.defaultPrompt);
        expect(questionLeaf.getPrompt()).to.equal(this.defaultPrompt);
      });
    });
  };

  public readonly testGetAndSetAnswer = (): void => {

    describe(TEST_ARGS_MSG, () => {
      it('Default answer and alternative answer for testing should be different', () => {
        expect(this.defaultAnswer).to.not.equal(this.alternativeAnswer);
      });
    });

    describe(TEST_CLASS_MSG, () => {
      it('Should get undefined if no answer has been passed during object instantiation', () => {
        let questionLeaf = this.questionLeafConstructor(this.questionLeafDefaultId, this.defaultPrompt);
        expect(questionLeaf.getAnswer()).to.be.undefined;
      });

      it('Should get default answer if default answer has been passed during object instantiation and another answer has not been set', () => {
        let questionLeaf = this.questionLeafConstructor(this.questionLeafDefaultId, this.defaultPrompt, this.defaultAnswer);
        expect(this.answerEqual(questionLeaf.getAnswer(), this.defaultAnswer)).to.be.true;
      });

      it('Should get alternative answer if alternative answer has been set after object instantiation', () => {
        let questionLeaf = this.questionLeafConstructor(this.questionLeafDefaultId, this.defaultPrompt, this.defaultAnswer);
        questionLeaf.setAnswer(this.alternativeAnswer);
        expect(this.answerEqual(questionLeaf.getAnswer(), this.alternativeAnswer)).to.be.true;
      });
    });
  };

  public readonly testIsValid = (): void => {

    describe(TEST_ARGS_MSG, () => {
      it('Validator should be valid if answer is valid', () => {
        expect(this.sampleValidator(this.validAnswer).isValid).to.be.true;
      });

      it('Validator should be invalid if answer is invalid', () => {
        expect(this.sampleValidator(this.invalidAnswer).isValid).to.be.false;
      });
    });

    describe(TEST_CLASS_MSG, () => {
      it('isValid() should cause validators to act on answer', () => {
        let questionLeaf = this.questionLeafConstructor(this.questionLeafDefaultId, this.defaultPrompt, this.defaultAnswer);
        questionLeaf.setAnswer(this.validAnswer);
        questionLeaf.addValidator(this.sampleValidator);
        expect(questionLeaf.isValid()).to.be.true;

        questionLeaf.setAnswer(this.invalidAnswer);
        expect(questionLeaf.isValid()).to.be.false;
      });

      it('isValid() should return true if there are no validators', () => {
        let questionLeaf = this.questionLeafConstructor(this.questionLeafDefaultId, this.defaultPrompt, this.defaultAnswer);
        expect(questionLeaf.isValid()).to.be.true;
      });

      it('isValid() should return true iff all validators are valid', () => {
        let questionLeaf = this.questionLeafConstructor(this.questionLeafDefaultId, this.defaultPrompt, this.defaultAnswer);
        questionLeaf.addValidator((answer?: T) => { return { isValid: true } });
        questionLeaf.addValidator((answer?: T) => { return { isValid: true } });
        expect(questionLeaf.isValid()).to.be.true;
      });

      it('isValid() should return false iff at least one validator is invalid', () => {
        let questionLeaf = this.questionLeafConstructor(this.questionLeafDefaultId, this.defaultPrompt, this.defaultAnswer);
        questionLeaf.addValidator((answer?: T) => { return { isValid: true } });
        questionLeaf.addValidator((answer?: T) => { return { isValid: false } });
        expect(questionLeaf.isValid()).to.be.false;
      });
    });
  };

  public readonly testValidationResults = (): void => {
    const MAX_VALIDATORS = 10;
    const getRandomInteger = (): number => Math.floor(Math.random() * MAX_VALIDATORS);
    const generateValidator = (): (answer?: T) => ValidationResult<ErrorType> =>
      (answer?: T) => {
        return {
          isValid: true,
        }
      };

    const generateValidators = (): ((answer?: T) => ValidationResult<ErrorType>)[] => {
      return [...Array(getRandomInteger())
        .keys()]
        .map((num) => generateValidator());
    };

    describe(TEST_CLASS_MSG, () => {
      it('There should be one item in the validation result array for each validator', () => {
        const questionLeaf = this.questionLeafConstructor(this.questionLeafDefaultId, this.defaultPrompt, this.defaultAnswer);
        const validators = generateValidators();
        validators.forEach((validator) => questionLeaf.addValidator(validator));
        expect(questionLeaf.getValidationResults()).to.have.lengthOf(validators.length);
      });
    });
  };
}
