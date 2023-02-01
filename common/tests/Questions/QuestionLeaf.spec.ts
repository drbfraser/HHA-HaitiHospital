import { expect } from 'chai';
import { QuestionLeaf, ValidationResult } from '../../src';
import { QuestionNodeTest, QuestionNodeTestArgs } from './QuestionNode.spec';
import { TEST_ARGS_STR, TEST_CLASS_STR } from '../Constants';

export interface QuestionLeafTestArgs<ID, T, ErrorType>
  extends QuestionNodeTestArgs<ID, ErrorType> {
  answerEqual: (answer1: T, answer2: T) => boolean;
  defaultAnswer: T;
  alternativeAnswer: T;

  sampleValidator: string;
  validAnswer: T;
  invalidAnswer: T;
}

export abstract class QuestionLeafTest<ID, T, ErrorType> extends QuestionNodeTest<ID, ErrorType> {
  private readonly questionLeafTestArgs: QuestionLeafTestArgs<ID, T, ErrorType>;
  private readonly questionLeafConstructor: (
    id: ID,
    prompt: string,
    defaultAnswer?: T,
  ) => QuestionLeaf<ID, T, ErrorType>;
  constructor(
    questionLeafConstructor: (
      id: ID,
      prompt: string,
      defaultAnswer?: T,
    ) => QuestionLeaf<ID, T, ErrorType>,
    args: QuestionLeafTestArgs<ID, T, ErrorType>,
  ) {
    super((id: ID) => questionLeafConstructor(id, args.defaultPrompt), args);

    this.questionLeafConstructor = questionLeafConstructor;
    this.questionLeafTestArgs = args;

    this.addTests(this.testGetPrompt, this.testGetAndSetAnswer, this.testValidationResults);
  }

  public readonly testGetAndSetAnswer = (): void => {
    describe(TEST_ARGS_STR, () => {
      it('Default answer and alternative answer for testing should be different', () => {
        expect(this.questionLeafTestArgs.defaultAnswer).to.not.equal(
          this.questionLeafTestArgs.alternativeAnswer,
        );
      });
    });

    describe(TEST_CLASS_STR, () => {
      it('Should get undefined if no answer has been passed during object instantiation', () => {
        let questionLeaf = this.questionLeafConstructor(
          this.questionLeafTestArgs.defaultId,
          this.questionLeafTestArgs.defaultPrompt,
        );
        expect(questionLeaf.getAnswer()).to.be.undefined;
      });

      it('Should get default answer if default answer has been passed during object instantiation and another answer has not been set', () => {
        let questionLeaf = this.questionLeafConstructor(
          this.questionLeafTestArgs.defaultId,
          this.questionLeafTestArgs.defaultPrompt,
          this.questionLeafTestArgs.defaultAnswer,
        );
        expect(
          this.questionLeafTestArgs.answerEqual(
            questionLeaf.getAnswer(),
            this.questionLeafTestArgs.defaultAnswer,
          ),
        ).to.be.true;
      });

      it('Should get alternative answer if alternative answer has been set after object instantiation', () => {
        let questionLeaf = this.questionLeafConstructor(
          this.questionLeafTestArgs.defaultId,
          this.questionLeafTestArgs.defaultPrompt,
          this.questionLeafTestArgs.defaultAnswer,
        );
        questionLeaf.setAnswer(this.questionLeafTestArgs.alternativeAnswer);
        expect(
          this.questionLeafTestArgs.answerEqual(
            questionLeaf.getAnswer(),
            this.questionLeafTestArgs.alternativeAnswer,
          ),
        ).to.be.true;
      });
    });
  };

  public readonly testValidationResults = (): void => {
    const validatorsSucess: string[] = ['isEven', 'isPositive'];
    describe(TEST_CLASS_STR, () => {
      it('There should be one item in the validation result array for each validator', () => {
        const questionLeaf = this.questionLeafConstructor(
          this.questionLeafTestArgs.defaultId,
          this.questionLeafTestArgs.defaultPrompt,
          this.questionLeafTestArgs.defaultAnswer,
        );
        validatorsSucess.forEach((validator) => questionLeaf.addValidator(validator));
        expect(questionLeaf.getValidationResults()).to.deep.equal({
          isValid: true,
          message: '',
          error: '',
        });
      });
    });
  };
}
