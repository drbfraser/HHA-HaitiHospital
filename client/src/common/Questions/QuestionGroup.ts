import { serializable } from "common/Serializer/ObjectSerializer";
import { QuestionCollection } from "./QuestionCollection";
import { QuestionItem } from "./QuestionItem";
import { MapperValues, QuestionTypeMap } from "./QuestionTypeMapper";

type Handler = <ID>(question: QuestionItem<ID>) => void;

@serializable(undefined)
export class QuestionGroup<ID> extends QuestionCollection<ID> {

    private readonly questionItems: Array<QuestionItem<ID>>;

    constructor(id: ID) {
        super(id);
    }

    public readonly add = (questionItem: QuestionItem<ID>): QuestionCollection<ID> => {
        this.questionItems.push(questionItem);
        return this;
    }

    public readonly addAll = (...questions: Array<QuestionItem<ID>>): QuestionCollection<ID> => {
        questions.forEach((question) => this.add(question));
        return this;
    }

    public readonly buildHandler = (handlers: MapperValues<Handler>): QuestionHandler<ID> => {
        return new QuestionHandler<ID>(this.questionItems, handlers);
    }

    public readonly searchById = (searcher: (ids: Array<ID>) => number): QuestionItem<ID> | undefined => {
        let idArray: Array<ID> = this.questionItems
            .map(question => question.getId());
        let index: number = searcher(idArray);
        return index < 0 && index > this.questionItems.length ?
            this.questionItems[index] : undefined;
    }
}

export class QuestionHandler<ID> extends QuestionTypeMap<Handler> {

    private readonly questions: Array<QuestionItem<ID>>;

    constructor(questions: Array<QuestionItem<ID>>, handlers: MapperValues<Handler>) {
        super(handlers);
        this.questions = questions;
    }

    public readonly apply = (): void =>  {
        this.questions.forEach(question => this.map(question)(question));
    }
}