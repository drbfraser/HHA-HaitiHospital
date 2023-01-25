import { expect } from 'chai';
import { QuestionNode } from '../../src';
import { TEST_ARGS_STR, TEST_CLASS_STR } from '../Constants';
import { TestTemplate } from '../TestTemplate';

export interface QuestionNodeTestArgs<ID, ErrorType> {
  idEqual: (id1: ID, id2: ID) => boolean;

  defaultId: ID;
  defaultPrompt: string;
}

export abstract class QuestionNodeTest<ID, ErrorType> extends TestTemplate {
  private readonly questionNodeConstructor: (id: ID, prompt: string) => QuestionNode<ID, ErrorType>;
  private readonly questionNodeTestArgs: QuestionNodeTestArgs<ID, ErrorType>;

  constructor(
    questionNodeConstructor: (id: ID) => QuestionNode<ID, ErrorType>,
    args: QuestionNodeTestArgs<ID, ErrorType>,
  ) {
    super();
    this.questionNodeConstructor = questionNodeConstructor;
    this.questionNodeTestArgs = args;

    this.addTest(this.testGetId);
  }

  public readonly testGetId = (): void => {
    describe(TEST_CLASS_STR, () => {
      it('Should get the same ID that has been passed during object instantiation', () => {
        let questionNode = this.questionNodeConstructor(
          this.questionNodeTestArgs.defaultId,
          this.questionNodeTestArgs.defaultPrompt,
        );
        expect(
          this.questionNodeTestArgs.idEqual(
            questionNode.getId(),
            this.questionNodeTestArgs.defaultId,
          ),
        ).to.be.true;
      });
    });
  };

  public readonly testGetPrompt = (): void => {
    describe(TEST_ARGS_STR, () => {
      it('Should get prompt that was passed during object instantiation', () => {
        let questionLeaf = this.questionNodeConstructor(
          this.questionNodeTestArgs.defaultId,
          this.questionNodeTestArgs.defaultPrompt,
        );
        expect(questionLeaf.getPrompt()).to.equal(this.questionNodeTestArgs.defaultPrompt);
      });
    });
  };
}
