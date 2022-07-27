import { QuestionItem } from "./QuestionItem";
import { NumericQuestion, TextQuestion } from "./SimpleQuestionTypes";

interface ClassMapEntry<R> {
    readonly className: string,
    readonly value: R
}

interface QuestionMapper<R> {
    readonly textQuestion: ClassMapEntry<R>,
    readonly numericQuestion: ClassMapEntry<R>
}

export interface MapperValues<R> {
    readonly textQuestion: R;
    readonly numericQuestion: R
}

export abstract class QuestionTypeMap<R> {
    private readonly questionMapper: QuestionMapper<R>;

    constructor(questionMapper: MapperValues<R>) {
        this.questionMapper = {
            textQuestion: { className: TextQuestion.name, value: questionMapper.textQuestion },
            numericQuestion: { className: NumericQuestion.name, value: questionMapper.numericQuestion }
        };
    }

    public readonly map = (question: QuestionItem<unknown>): R => {
        return Object.values(this.questionMapper)
            .find(classNameMap => classNameMap.className === question.constructor.name);
    }
}
