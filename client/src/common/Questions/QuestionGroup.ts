import { serializable } from 'common/Serializer/ObjectSerializer';
import { QuestionParent } from './QuestionParent';
import { QuestionNode } from './QuestionNode';
import { HandlerArgs, QuestionTypeMap } from './QuestionTypeMapper';

type Handler = <ID, ErrorType>(question: QuestionNode<ID, ErrorType>) => void;

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

  public readonly buildHandler = (
    handlers: HandlerArgs<ID, ErrorType>,
  ): QuestionHandler<ID, ErrorType> => {
    return new QuestionHandler<ID, ErrorType>(this.questionItems, handlers);
  };

  public readonly searchById = (id: ID): QuestionNode<ID, ErrorType> | undefined => {
    return this.questionItems.filter((questionItem) => questionItem.getId() == id)[0];
  };
}

export class QuestionHandler<ID, ErrorType> extends QuestionTypeMap<ID, ErrorType> {
  private readonly questions: Array<QuestionNode<ID, ErrorType>>;

  constructor(questions: Array<QuestionNode<ID, ErrorType>>, handlers: HandlerArgs<ID, ErrorType>) {
    super(handlers);
    this.questions = questions;
  }

  public readonly apply = (): void => {
    this.questions.forEach((question) => this.getHandler(question)(question));
  };
}
