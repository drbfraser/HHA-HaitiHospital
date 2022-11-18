/*  An expandable question represents a question whose answer determines how
    many groups of questions should be "expanded". One example of an expandable
    question is "How many people were hospitalized?". If the answer to this
    question is "3", then 3 groups of questions relating to the hospitalized
    patients are expanded (questions such as "Cause of hospitalization", or 
    "Age"), where each expanded group of questions might relate to each
    hospitalized person.
*/
import { QuestionParent } from './QuestionParent';
import { QuestionGroup } from './QuestionGroup';
import { QuestionNode } from './QuestionNode';
import { serializable } from '../Serializer/ObjectSerializer';

@serializable(undefined, '', (arg) => undefined)
export class ExpandableQuestion<ID, ErrorType> extends QuestionParent<ID, ErrorType> {
  private questionGroups: Array<QuestionGroup<ID, ErrorType>>;
  private readonly questionsTemplate: QuestionGroup<ID, ErrorType>;
  private readonly idGenerator: (questionGroupIndex: number) => ID;
  private answer?: number;

  constructor(
    id: ID,
    prompt: string,
    idGenerator: (questionGroupIndex: number) => ID,
    ...questions: Array<QuestionNode<ID, ErrorType>>
  ) {
    super(id, prompt);
    this.idGenerator = idGenerator;
    // TODO: Allow multiple "templates to be added"
    this.questionsTemplate = new QuestionGroup<ID, ErrorType>(undefined, `${prompt}-template`).addAll(...questions);
  }

  public addToTemplate(
    questionItem: QuestionNode<ID, ErrorType>,
  ): ExpandableQuestion<ID, ErrorType> {
    this.questionsTemplate.add(questionItem);
    return this;
  };

  public addAllToTemplate(
    ...questions: Array<QuestionNode<ID, ErrorType>>
  ): ExpandableQuestion<ID, ErrorType> {
    this.questionsTemplate.addAll(...questions);
    return this;
  };

  public searchById(id: ID): QuestionNode<ID, ErrorType> | undefined {
    return this.questionGroups
      .map((questionGroup) => questionGroup.searchById(id))
      .find((question) => question !== undefined);
  };

  private expand(): void {
    let questionItemAdder = (
      questionGroup: QuestionGroup<ID, ErrorType>,
    ): ((questionItem: QuestionNode<ID, ErrorType>) => void) => {
      return (questionItem: QuestionNode<ID, ErrorType>) => {
        questionGroup.add(questionItem);
      };
    };

    this.questionGroups = new Array(this.answer ?? 0)
      .fill(undefined)
      .map((x, index) => new QuestionGroup(this.idGenerator(index), `${prompt}-${index}`))
      .map((questionGroup) => {
        let handler = () => questionItemAdder(questionGroup);
        this.questionsTemplate
          .genericForEach(handler);
        return questionGroup;
      });
  };

  public setAnswer(answer: number): void {
    this.answer = answer;
    this.expand();
  };

  public getAnswer(): number {
   return this.answer;
  }
  
  public getTemplate(): QuestionGroup<ID, ErrorType> {
    return this.questionsTemplate;
  }

   public forEach(groupHandler: (groupInstance: QuestionGroup<ID, ErrorType>) => void): void {
    this.questionGroups
      .forEach(groupHandler);
  };
  
  public map<T>(mapper: (groupInstance: QuestionGroup<ID, ErrorType>) => T): T[] {
    return this.questionGroups
      .map(mapper);
  };
}
