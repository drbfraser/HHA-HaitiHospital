import { expect } from 'chai';
import { QuestionNode } from "../../src";
import { TEST_CLASS_MSG } from "../Constants";
import { TestTemplate } from "../TestTemplate";

export interface QuestionNodeTestArgs<ID, ErrorType> {
  idEqual: (id1: ID, id2: ID) => boolean,
  defaultId: ID
}

export abstract class QuestionNodeTest<ID, ErrorType> extends TestTemplate {

  private readonly questionNodeConstructor: (id: ID) => QuestionNode<ID, ErrorType>;
  private readonly idEqual: (id1: ID, id2: ID) => boolean;
  private readonly defaultId: ID;

  constructor(
    questionNodeConstructor: (id: ID) => QuestionNode<ID, ErrorType>,
    args: QuestionNodeTestArgs<ID, ErrorType>
  ) {

    super();
    this.questionNodeConstructor = questionNodeConstructor;
    this.idEqual = args.idEqual;
    this.defaultId = args.defaultId;

    this.addTest(this.testGetId);
  }

  public readonly testGetId = (): void => {
    describe(TEST_CLASS_MSG, () => {
      it('Should get the same ID that has been passed during object instantiation', () => {
        let questionNode = this.questionNodeConstructor(this.defaultId);
        expect(this.idEqual(questionNode.getId(), this.defaultId)).to.be.true;
      });
    });
  }
}

