import { serializable } from "common/Serializer/ObjectSerializer";
import { QuestionCollection } from "./QuestionCollection";
import { QuestionItem } from "./QuestionItem";
import { HandlerArgs, QuestionTypeMap } from "./QuestionTypeMapper";

type Handler = <ID>(question: QuestionItem<ID>) => void;

@serializable(undefined)
export class QuestionGroup<ID> extends QuestionCollection<ID> {

    private readonly questionItems: Array<QuestionItem<ID>>;

    constructor(id: ID, ...questions: Array<QuestionItem<ID>>) {
        super(id);
        questions ? this.addAll(...questions): undefined;
    }

    public readonly add = (questionItem: QuestionItem<ID>): QuestionGroup<ID> => {
        this.questionItems.push(questionItem);
        return this;
    }

    public readonly addAll = (...questions: Array<QuestionItem<ID>>): QuestionGroup<ID> => {
        questions.forEach((question) => this.add(question));
        return this;
    }

    public readonly buildHandler = (handlers: HandlerArgs<ID>): QuestionHandler<ID> => {
        return new QuestionHandler<ID>(this.questionItems, handlers);
    }

    public readonly searchById = (id: ID): QuestionItem<ID> | undefined => {
        return this.questionItems
            .filter((questionItem) => questionItem.getId() == id)[0];
    }
}

export class QuestionHandler<ID> extends QuestionTypeMap<ID> {

    private readonly questions: Array<QuestionItem<ID>>;

    constructor(questions: Array<QuestionItem<ID>>, handlers: HandlerArgs<ID>) {
        super(handlers);
        this.questions = questions;
    }

    public readonly apply = (): void =>  {
        this.questions.forEach(question => this.getHandler(question)(question));
    }
}