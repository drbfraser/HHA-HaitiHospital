import { QuestionCollection } from "./QuestionCollection";
import { QuestionGroup } from "./QuestionGroup";
import { QuestionItem } from "./QuestionItem";

export class ExpandableQuestion<ID> extends QuestionCollection<ID> {

    private questionGroups: Array<QuestionGroup<ID>>;
    private readonly questionsTemplate: QuestionGroup<ID>;
    private readonly idGenerator: (questionGroupIndex: number) => ID;
    private answer?: number;

    constructor(id: ID,
        idGenerator: (questionGroupIndex: number) => ID,
        defaultAnswer?: number,
        ...questions: Array<QuestionItem<ID>>
    ) {
        super(id);
        this.idGenerator = idGenerator;
        this.questionsTemplate = new QuestionGroup<ID>(undefined)
            .addAll(...questions);
        this.setAnswer(defaultAnswer);
    }

    public readonly addToTemplate = (questionItem: QuestionItem<ID>): ExpandableQuestion<ID> => {
        this.questionsTemplate.add(questionItem);
        return this;
    }

    public readonly addAllToTemplate = (...questions: Array<QuestionItem<ID>>): ExpandableQuestion<ID> => {
        this.questionsTemplate.addAll(...questions);
        return this;
    }

    public readonly searchById = (id: ID): QuestionItem<ID> | undefined => {
        return this.questionGroups
            .map(questionGroup => questionGroup.searchById(id))
            .find(question => question !== undefined);
    }

    private readonly expand = (): void => {
        let questionItemAdder = (questionGroup: QuestionGroup<ID>):
            (questionItem: QuestionItem<ID>) => void => {
            return (questionItem: QuestionItem<ID>) => {
                questionGroup.add(questionItem);
            };
        }

        this.questionGroups = new Array(this.answer ?? 0)
            .fill(undefined)
            .map((x, index) => new QuestionGroup(this.idGenerator(index)))
            .map(questionGroup => {
                this.questionsTemplate.buildHandler({
                    textQuestion: questionItemAdder(questionGroup),
                    numericQuestion: questionItemAdder(questionGroup)
                }).apply();
                return questionGroup;
            });
    }

    public readonly setAnswer = (answer: number): void => {
        this.answer = answer;
        this.expand();
    }

    public readonly getAnswer = (): number => this.answer;
}

let a: ExpandableQuestion<number> = new ExpandableQuestion<number>(5, n => 5);
a.setAnswer(undefined);