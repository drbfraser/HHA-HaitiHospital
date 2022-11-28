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

export type Mapper<Question extends QuestionNode<ID, ErrorType>, ID, ErrorType, T> = (question: Question) => T;

interface MapEntry<Question extends QuestionNode<ID, ErrorType>, ID, ErrorType, T> {
  readonly className: string;
  readonly mapper: Mapper<Question, ID, ErrorType, T>;
}

interface MapperQuestions<ID, ErrorType, T> {
  readonly textQuestion: MapEntry<TextQuestion<ID, ErrorType>, ID, ErrorType, T>;
  readonly numericQuestion: MapEntry<NumericQuestion<ID, ErrorType>, ID, ErrorType, T>;
  readonly singleSelectionQuestion: MapEntry<SingleSelectionQuestion<ID, ErrorType>, ID, ErrorType, T>;
  readonly multipleSelectionQuestion: MapEntry<MultipleSelectionQuestion<ID, ErrorType>, ID, ErrorType, T>;
  readonly questionGroup: MapEntry<QuestionGroup<ID, ErrorType>, ID, ErrorType, T>;
  readonly compositionQuestion: MapEntry<CompositionQuestion<ID, ErrorType>, ID, ErrorType, T>;
  readonly expandableQuestion: MapEntry<ExpandableQuestion<ID, ErrorType>, ID, ErrorType, T>;
}

// TODO: Update
export interface MapperArgs<ID, ErrorType, T> {
  readonly textQuestion: (textQuestion: TextQuestion<ID, ErrorType>) => T;
  readonly numericQuestion: (numericQuestion: NumericQuestion<ID, ErrorType>) => T;
  readonly singleSelectionQuestion: (
    singleSelectionQuestion: SingleSelectionQuestion<ID, ErrorType>,
  ) => T;
  readonly multipleSelectionQuestion: (
    multipleSelectionQuestion: MultipleSelectionQuestion<ID, ErrorType>,
  ) => T;
  readonly questionGroup: (questionGroup: QuestionGroup<ID, ErrorType>) => T;
  readonly compositionQuestion: (compositionQuestion: CompositionQuestion<ID, ErrorType>) => T;
  readonly expandableQuestion: (expandableQuestion: ExpandableQuestion<ID, ErrorType>) => T;
}

export class QuestionMapper<ID, ErrorType, T> {
  private readonly questionMapper: MapperQuestions<ID, ErrorType, T>;

  private constructor(questionMapper: MapperArgs<ID, ErrorType, T>) {
    this.questionMapper = {
      textQuestion: { className: TextQuestion.name, mapper: questionMapper.textQuestion },
      numericQuestion: { className: NumericQuestion.name, mapper: questionMapper.numericQuestion },
      singleSelectionQuestion: {
        className: SingleSelectionQuestion.name,
        mapper: questionMapper.singleSelectionQuestion,
      },
      multipleSelectionQuestion: {
        className: MultipleSelectionQuestion.name,
        mapper: questionMapper.multipleSelectionQuestion,
      },
      questionGroup: { className: QuestionGroup.name, mapper: questionMapper.questionGroup },
      compositionQuestion: {
        className: CompositionQuestion.name,
        mapper: questionMapper.compositionQuestion,
      },
      expandableQuestion: {
        className: ExpandableQuestion.name,
        mapper: questionMapper.expandableQuestion,
      },
    };
  }

  // Used to construct type-specific handlers
  public static buildMapper<ID, ErrorType, T>(handlers: MapperArgs<ID, ErrorType, T>): QuestionMapper<ID, ErrorType, T> {
    return new QuestionMapper<ID, ErrorType, T>(handlers);
  }

  // Used when the handler is the same for all question types.
  public static buildGenericMapper<ID, ErrorType, T>(handler: (question: QuestionNode<ID, ErrorType>) => T): QuestionMapper<ID, ErrorType, T> {
    return new QuestionMapper<ID, ErrorType, T>({
      textQuestion: handler,
      numericQuestion: handler,
      singleSelectionQuestion: handler,
      multipleSelectionQuestion: handler,
      questionGroup: handler,
      compositionQuestion: handler,
      expandableQuestion: handler
    });
  }

  public getMapper(
    question: QuestionNode<ID, ErrorType>,
  ): Mapper<QuestionNode<ID, ErrorType>, ID, ErrorType, T> {
    return Object.values(this.questionMapper).find(
      (classNameMap) => classNameMap.className === question.constructor.name,
    ).mapper;
  };

  public map(
    question: QuestionNode<ID, ErrorType>): T {
    return this.getMapper(question)(question);
  };
  
  public mapAll(
    questions: QuestionNode<ID, ErrorType>[]): T[] {
      return questions.map((question) => this.map(question));
    }
}
