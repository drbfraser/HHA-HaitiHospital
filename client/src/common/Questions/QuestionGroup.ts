import { serializable } from 'common/Serializer/ObjectSerializer';
import { QuestionParent } from './QuestionParent';
import { QuestionNode } from './QuestionNode';
import { HandlerArgs, QuestionHandler } from './QuestionHandler';

@serializable(undefined)
export class QuestionGroup<ID, ErrorType> extends QuestionParent<ID, ErrorType> {
  private readonly questionItems: Array<QuestionNode<ID, ErrorType>>;

  constructor(id: ID, ...questions: Array<QuestionNode<ID, ErrorType>>) {
    super(id);
    questions ? this.addAll(...questions) : undefined;
  }

  public readonly add = (
    questionItem: QuestionNode<ID, ErrorType>,
  ): QuestionGroup<ID, ErrorType> => {
    this.questionItems.push(questionItem);
    return this;
  };

  public readonly addAll = (
    ...questions: Array<QuestionNode<ID, ErrorType>>
  ): QuestionGroup<ID, ErrorType> => {
    questions.forEach((question) => this.add(question));
    return this;
  };

  public readonly genericForEach = (handler: (question: QuestionNode<ID, ErrorType>) => void): void => {
    QuestionHandler.buildGenericHandler(handler).applyForEach(this.questionItems);
  }

  public readonly forEach = (
    handlers: HandlerArgs<ID, ErrorType>,
  ): void => {
    QuestionHandler.buildHandler(handlers).applyForEach(this.questionItems);
  };

  public readonly searchById = (id: ID): QuestionNode<ID, ErrorType> | undefined => {
    return this.questionItems.filter((questionItem) => questionItem.getId() == id)[0];
  };
}
