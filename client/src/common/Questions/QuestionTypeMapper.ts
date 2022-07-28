import { Id } from "react-toastify";
import { Question } from "./Question";
import { QuestionItem } from "./QuestionItem";
import { NumericQuestion, TextQuestion } from "./SimpleQuestionTypes";

export type Handler<ID> = (question: QuestionItem<ID>) => void;

interface HandlerEntry<ID> {
    readonly className: string,
    readonly handler: Handler<ID> 
}

interface HandlerMap<ID> {
    readonly textQuestion: HandlerEntry<ID>,
    readonly numericQuestion: HandlerEntry<ID>
}

export interface HandlerArgs<ID> {
    readonly textQuestion: (textQuestion: TextQuestion<ID>) => void;
    readonly numericQuestion: (numericQuestion: NumericQuestion<ID>) => void;
}

export class QuestionTypeMap<ID> {
    private readonly questionMapper: HandlerMap<ID>;

    constructor(questionMapper: HandlerArgs<ID>) {
        this.questionMapper = {
            textQuestion: { className: TextQuestion.name, handler: questionMapper.textQuestion },
            numericQuestion: { className: NumericQuestion.name, handler: questionMapper.numericQuestion }
        };
    }

    public readonly getHandler = (question: QuestionItem<unknown>): Handler<ID> => {
        return Object.values(this.questionMapper)
            .find(classNameMap => classNameMap.className === question.constructor.name);
    }
}


