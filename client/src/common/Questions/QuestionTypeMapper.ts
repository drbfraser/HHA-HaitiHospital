import { CompositionQuestion } from "./CompositionQuestion";
import { ExpandableQuestion } from "./ExpandableQuestion";
import { MultipleSelectionQuestion, SingleSelectionQuestion } from "./MultipleChoice";
import { QuestionGroup } from "./QuestionGroup";
import { QuestionItem } from "./QuestionItem";
import { NumericQuestion, TextQuestion } from "./SimpleQuestionTypes";

export type Handler<ID> = (question: QuestionItem<ID>) => void;

interface HandlerEntry<ID> {
    readonly className: string,
    readonly handler: Handler<ID> 
}

interface HandlerMap<ID> {
    readonly textQuestion: HandlerEntry<ID>,
    readonly numericQuestion: HandlerEntry<ID>,
    readonly singleSelectionQuestion: HandlerEntry<ID>,
    readonly multipleSelectionQuestion: HandlerEntry<ID>,
    readonly questionGroup: HandlerEntry<ID>,
    readonly compositionQuestion: HandlerEntry<ID>,
    readonly expandableQuestion: HandlerEntry<ID>
}

// TODO: Update
export interface HandlerArgs<ID> {
    readonly textQuestion: (textQuestion: TextQuestion<ID>) => void;
    readonly numericQuestion: (numericQuestion: NumericQuestion<ID>) => void;
    readonly singleSelectionQuestion: (singleSelectionQuestion: SingleSelectionQuestion<ID>) => void;
    readonly multipleSelectionQuestion: (multipleSelectionQuestion: MultipleSelectionQuestion<ID>) => void;
    readonly questionGroup: (questionGroup: QuestionGroup<ID>) => void;
    readonly compositionQuestion: (compositionQuestion: CompositionQuestion<ID>) => void;
    readonly expandableQuestion: (expandableQuestion: ExpandableQuestion<ID>) => void;
}

export class QuestionTypeMap<ID> {
    private readonly questionMapper: HandlerMap<ID>;

    constructor(questionMapper: HandlerArgs<ID>) {
        this.questionMapper = {
            textQuestion: { className: TextQuestion.name, handler: questionMapper.textQuestion },
            numericQuestion: { className: NumericQuestion.name, handler: questionMapper.numericQuestion },
            singleSelectionQuestion: { className: SingleSelectionQuestion.name, handler: questionMapper.singleSelectionQuestion },
            multipleSelectionQuestion: { className: MultipleSelectionQuestion.name, handler: questionMapper.multipleSelectionQuestion },
            questionGroup: { className: QuestionGroup.name, handler: questionMapper.questionGroup },
            compositionQuestion: { className: CompositionQuestion.name, handler: questionMapper.compositionQuestion },
            expandableQuestion: { className: ExpandableQuestion.name, handler: questionMapper.expandableQuestion }
        };
    }

    public readonly getHandler = (question: QuestionItem<unknown>): Handler<ID> => {
        return Object.values(this.questionMapper)
            .find(classNameMap => classNameMap.className === question.constructor.name);
    }
}


