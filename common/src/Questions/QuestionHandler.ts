/*  A handler that enforces exhaustively handling all types of questions.

    The purpose of this module is to help the developer by enforcing proper
    handling (routine definition) of all question types at compile-time. The 
    current design leverages types to define the question semantics and
    capabilities, and because there are currently multiple question types, and
    question types might be changed or added in the future, there is a high risk
    that code that acts upon (handles) these questions might not be updated to
    properly handle the new changes. In such case, the errors are probably going
    to be caught at runtime and significant time might be spent identifying the
    problem.

    The QuestionHandler class below will enforce handling of all question types
    by not transpiling if all question types are not exhaustively handled. This
    is accomplished by having QuestionHandler's constructor which takes in a
    handler for every question type, thus leveraging the question type full
    capabilities and also not transpiling if the proper handler is not provided.

    **Any modifications to the question types must be reflected in the
    constructs defined in this module for the exhaustive handling enforcement to
    take effect**
*/
import { CompositionQuestion } from './CompositionQuestion';
import { ExpandableQuestion } from './ExpandableQuestion';
import { MultipleSelectionQuestion, SingleSelectionQuestion } from './MultipleChoice';
import { QuestionGroup } from './QuestionGroup';
import { QuestionNode } from './QuestionNode';
import { NumericQuestion, TextQuestion } from './SimpleQuestionTypes';

export type Handler<ID, ErrorType> = (question: QuestionNode<ID, ErrorType>) => void;

interface HandlerEntry<ID, ErrorType> {
  readonly className: string;
  readonly handler: Handler<ID, ErrorType>;
}

interface HandlerMap<ID, ErrorType> {
  readonly textQuestion: HandlerEntry<ID, ErrorType>;
  readonly numericQuestion: HandlerEntry<ID, ErrorType>;
  readonly singleSelectionQuestion: HandlerEntry<ID, ErrorType>;
  readonly multipleSelectionQuestion: HandlerEntry<ID, ErrorType>;
  readonly questionGroup: HandlerEntry<ID, ErrorType>;
  readonly compositionQuestion: HandlerEntry<ID, ErrorType>;
  readonly expandableQuestion: HandlerEntry<ID, ErrorType>;
}

// TODO: Update
export interface HandlerArgs<ID, ErrorType> {
  readonly textQuestion: (textQuestion: TextQuestion<ID, ErrorType>) => void;
  readonly numericQuestion: (numericQuestion: NumericQuestion<ID, ErrorType>) => void;
  readonly singleSelectionQuestion: (
    singleSelectionQuestion: SingleSelectionQuestion<ID, ErrorType>,
  ) => void;
  readonly multipleSelectionQuestion: (
    multipleSelectionQuestion: MultipleSelectionQuestion<ID, ErrorType>,
  ) => void;
  readonly questionGroup: (questionGroup: QuestionGroup<ID, ErrorType>) => void;
  readonly compositionQuestion: (compositionQuestion: CompositionQuestion<ID, ErrorType>) => void;
  readonly expandableQuestion: (expandableQuestion: ExpandableQuestion<ID, ErrorType>) => void;
}

export class QuestionHandler<ID, ErrorType> {
  private readonly questionMapper: HandlerMap<ID, ErrorType>;

  private constructor(questionMapper: HandlerArgs<ID, ErrorType>) {
    this.questionMapper = {
      textQuestion: { className: TextQuestion.name, handler: questionMapper.textQuestion },
      numericQuestion: { className: NumericQuestion.name, handler: questionMapper.numericQuestion },
      singleSelectionQuestion: {
        className: SingleSelectionQuestion.name,
        handler: questionMapper.singleSelectionQuestion,
      },
      multipleSelectionQuestion: {
        className: MultipleSelectionQuestion.name,
        handler: questionMapper.multipleSelectionQuestion,
      },
      questionGroup: { className: QuestionGroup.name, handler: questionMapper.questionGroup },
      compositionQuestion: {
        className: CompositionQuestion.name,
        handler: questionMapper.compositionQuestion,
      },
      expandableQuestion: {
        className: ExpandableQuestion.name,
        handler: questionMapper.expandableQuestion,
      },
    };
  }

  // Used to construct type-specific handlers
  public static buildHandler<ID, ErrorType>(handlers: HandlerArgs<ID, ErrorType>): QuestionHandler<ID, ErrorType> {
    return new QuestionHandler<ID, ErrorType>(handlers);
  }

  // Used when the handler is the same for all question types.
  public static buildGenericHandler<ID, ErrorType>(handler: (question: QuestionNode<ID, ErrorType>) => void): QuestionHandler<ID, ErrorType> {
    return new QuestionHandler<ID, ErrorType>({
      textQuestion: handler,
      numericQuestion: handler,
      singleSelectionQuestion: handler,
      multipleSelectionQuestion: handler,
      questionGroup: handler,
      compositionQuestion: handler,
      expandableQuestion: handler
    });
  }

  public getHandler(
    question: QuestionNode<ID, ErrorType>,
  ): Handler<ID, ErrorType> {
    return Object.values(this.questionMapper).find(
      (classNameMap) => classNameMap.className === question.constructor.name,
    );
  };

  public apply(
    question: QuestionNode<ID, ErrorType>): void {
    this.getHandler(question)(question);
  };
  
  public applyForEach(
    questions: QuestionNode<ID, ErrorType>[]): void {
    questions.forEach((question) => this.apply(question));
    }
}
