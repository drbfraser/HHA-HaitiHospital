import { QuestionItem } from "./QuestionItem";
import { NumericQuestion, TextQuestion } from "./SimpleQuestionTypes";

export class QuestionCollection<ID> extends QuestionItem<ID> {
    private readonly questionItems: Array<QuestionItem<ID>>;

    constructor(id: ID) {
        super(id);
        this.questionItems = new Array<QuestionItem<ID>>();
    }

    public static readonly of = <ID>(id: ID, ...args: Array<QuestionItem<ID>>): QuestionCollection<ID> => {
        return new QuestionCollection<ID>(id)
            .addAll(...args);
    }

    public readonly add = (questionItem: QuestionItem<ID>): QuestionCollection<ID> => {
        this.questionItems.push(questionItem);
        return this;
    }

    public readonly addAll = (...questions: Array<QuestionItem<ID>>): QuestionCollection<ID> => {
        questions.forEach((question) => this.add(question));
        return this;
    }

}
