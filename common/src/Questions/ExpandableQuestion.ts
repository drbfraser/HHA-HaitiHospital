import { QuestionCollection } from './QuestionCollection';
import { QuestionGroup } from './QuestionGroup';
import { QuestionItem } from './QuestionItem';

export class ExpandableQuestion<ID, ErrorType> extends QuestionCollection<ID, ErrorType> {
  private questionGroups: Array<QuestionGroup<ID, ErrorType>>;
  private readonly questionsTemplate: QuestionGroup<ID, ErrorType>;
  private readonly idGenerator: (questionGroupIndex: number) => ID;
  private answer?: number;

  constructor(
    id: ID,
    idGenerator: (questionGroupIndex: number) => ID,
    defaultAnswer?: number,
    ...questions: Array<QuestionItem<ID, ErrorType>>
  ) {
    super(id);
    this.idGenerator = idGenerator;
    this.questionsTemplate = new QuestionGroup<ID, ErrorType>(undefined).addAll(...questions);
    this.setAnswer(defaultAnswer);
  }

  public readonly addToTemplate = (
    questionItem: QuestionItem<ID, ErrorType>,
  ): ExpandableQuestion<ID, ErrorType> => {
    this.questionsTemplate.add(questionItem);
    return this;
  };

  public readonly addAllToTemplate = (
    ...questions: Array<QuestionItem<ID, ErrorType>>
  ): ExpandableQuestion<ID, ErrorType> => {
    this.questionsTemplate.addAll(...questions);
    return this;
  };

  public readonly searchById = (id: ID): QuestionItem<ID, ErrorType> | undefined => {
    return this.questionGroups
      .map((questionGroup) => questionGroup.searchById(id))
      .find((question) => question !== undefined);
  };

  private readonly expand = (): void => {
    let questionItemAdder = (
      questionGroup: QuestionGroup<ID, ErrorType>,
    ): ((questionItem: QuestionItem<ID, ErrorType>) => void) => {
      return (questionItem: QuestionItem<ID, ErrorType>) => {
        questionGroup.add(questionItem);
      };
    };

    this.questionGroups = new Array(this.answer ?? 0)
      .fill(undefined)
      .map((x, index) => new QuestionGroup(this.idGenerator(index)))
      .map((questionGroup) => {
        let handler = () => questionItemAdder(questionGroup);
        this.questionsTemplate
          .buildHandler({
            textQuestion: handler,
            numericQuestion: handler,
            singleSelectionQuestion: handler,
            multipleSelectionQuestion: handler,
            questionGroup: handler,
            compositionQuestion: handler,
            expandableQuestion: handler,
          })
          .apply();
        return questionGroup;
      });
  };

  public readonly setAnswer = (answer: number): void => {
    this.answer = answer;
    this.expand();
  };

  public readonly getAnswer = (): number => this.answer;
}
