import { serializable } from "common/Serializer/ObjectSerializer";
import { QuestionCollection } from "./QuestionCollection";
import { NumericQuestion } from "./SimpleQuestionTypes";

@serializable(undefined)
export class CompositionQuestion<ID> extends QuestionCollection<ID> {

    private answer?: number;
    private readonly questions: Array<NumericQuestion<ID>>;

    constructor(id: ID, defaultAnswer?: number, ...questions: Array<NumericQuestion<ID>>) {
        super(id);
        this.answer = defaultAnswer;
        questions ? this.addAll(...questions) : undefined;
    }

    public readonly searchById = (id: ID): NumericQuestion<ID> | undefined => {
        return this.questions
            .find(question => question.getId() === id);
    }

    public readonly add = (numericQuestion: NumericQuestion<ID>): CompositionQuestion<ID> => {
        this.questions.push(numericQuestion);
        return this;
    }

    public readonly addAll = (...questions: Array<NumericQuestion<ID>>): QuestionCollection<ID> => {
        questions.forEach((question) => this.add(question));
        return this;
    }

    public readonly handleNumericQuestions = (handler: (numericQuestion: NumericQuestion<ID>) => void): void => {
        this.questions
            .forEach(question => handler(question));
    }

    public readonly getAnswer = (): number | undefined => this.answer;

    public readonly setAnswer = (answer: number): void => {
        this.answer = answer;
    }

    public readonly sumsUp = (): boolean => {
        return this.answer ? this.questions
            .map(question => question.getAnswer())
            .reduce((answer1, answer2) => answer1 + answer2) === this.answer :
            false;
    }
}