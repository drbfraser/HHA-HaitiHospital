import { CompositionQuestion } from './CompositionQuestion';
import { ExpandableQuestion } from './ExpandableQuestion';
import { MultipleSelectionQuestion, SingleSelectionQuestion } from './MultipleChoice';
import { QuestionGroup } from './QuestionGroup';
import { QuestionItem } from './QuestionItem';
import { NumericQuestion, TextQuestion } from './SimpleQuestionTypes';

export type Handler<ID, ErrorType> = (question: QuestionItem<ID, ErrorType>) => void;

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

export class QuestionTypeMap<ID, ErrorType> {
  private readonly questionMapper: HandlerMap<ID, ErrorType>;

  constructor(questionMapper: HandlerArgs<ID, ErrorType>) {
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

  public readonly getHandler = (
    question: QuestionItem<unknown, ErrorType>,
  ): Handler<ID, ErrorType> => {
    return Object.values(this.questionMapper).find(
      (classNameMap) => classNameMap.className === question.constructor.name,
    );
  };
}
