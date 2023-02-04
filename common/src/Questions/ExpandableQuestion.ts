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
import { ObjectSerializer, serializable } from '../Serializer/ObjectSerializer';

@serializable(undefined, '', (arg: any) => undefined)
export class ExpandableQuestion<ID, ErrorType> extends QuestionParent<ID, ErrorType> {
  private questionGroups: Array<QuestionGroup<ID, ErrorType>> = [];
  private readonly questionsTemplate: QuestionGroup<ID, ErrorType>;
  private readonly idGenerator: (questionGroupIndex: number) => ID;
  private answer: number = 0;

  constructor(
    id: ID,
    prompt: string,
    idGenerator: (questionGroupIndex: number) => ID,
    ...questions: Array<QuestionNode<ID, ErrorType>>
  ) {
    super(id, prompt);
    this.idGenerator = idGenerator;
    this.questionsTemplate = new QuestionGroup<ID, ErrorType>(
      idGenerator(0),
      `${prompt}-template`,
    ).addAll(...questions);
  }

  public addToTemplate(
    questionItem: QuestionNode<ID, ErrorType>,
  ): ExpandableQuestion<ID, ErrorType> {
    this.questionsTemplate.add(questionItem);
    return this;
  }

  public addAllToTemplate(
    ...questions: Array<QuestionNode<ID, ErrorType>>
  ): ExpandableQuestion<ID, ErrorType> {
    this.questionsTemplate.addAll(...questions);
    return this;
  }

  public searchById(id: ID): QuestionNode<ID, ErrorType> | undefined {
    return this.questionGroups
      .map((questionGroup) => questionGroup.searchById(id))
      .find((question) => question !== undefined);
  }

  private expand(): void {
    /*this.questionGroups = new Array<QuestionGroup<ID, ErrorType>>(this.answer ?? 0).fill(undefined).map(
      (x, index) =>
        new QuestionGroup(
          this.idGenerator(index + 1),
          `${this.getPrompt()}-${index}`,
          ...this.questionsTemplate.genericMap<QuestionNode<ID, ErrorType>>((q) => {
            let serializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
            return serializer.deserialize(serializer.serialize(q));
          }),
        ),
    );*/

    if (this.getAnswer() > this.questionGroups.length) {
      for (let i = this.questionGroups.length; i < this.getAnswer(); i++) {
        this.questionGroups.push(new QuestionGroup(
          this.idGenerator(i + 1),
          `${this.getPrompt()}-${i}`,
          ...this.questionsTemplate.genericMap<QuestionNode<ID, ErrorType>>((q) => {
            let serializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
            return serializer.deserialize(serializer.serialize(q));
          })
        ));
      }
    }
  }

  private shrink(): void {
    if (this.getAnswer() < this.questionGroups.length) {
      this.questionGroups = this.questionGroups.slice(0, this.getAnswer());
    }
  }

  public setAnswer(answer: number): void {
    this.answer = answer;

    if (answer < this.questionGroups.length) {
      this.shrink();
    }
    else if (answer > this.questionGroups.length) {
      this.expand();
    }
  }

  public getAnswer(): number {
    return this.answer;
  }

  public getTemplate(): QuestionGroup<ID, ErrorType> {
    return this.questionsTemplate;
  }

  public forEach(groupHandler: (groupInstance: QuestionGroup<ID, ErrorType>) => void): void {
    this.questionGroups.forEach(groupHandler);
  }

  public map<T>(mapper: (groupInstance: QuestionGroup<ID, ErrorType>, index: number) => T): T[] {
    return this.questionGroups.map(mapper);
  }
}
