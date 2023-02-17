/*  A composition question represents a question whose answer must be equal
    to the sum of its numeric children questions.
*/
import { serializable } from '../Serializer/ObjectSerializer';
import { SpecializedGroup } from '.';
import { QuestionAnswerNode, QuestionAnswerParent } from './QuestionAnswer';

@serializable(undefined)
export class CompositionQuestion<ID, ErrorType> extends QuestionAnswerParent<ID, number, ErrorType> {
  private answer: number | undefined = 0;
  private readonly compositionGroups: Array<SpecializedGroup<ID, ErrorType, QuestionAnswerNode<ID, number, ErrorType>>>;

  constructor(
    id: ID,
    prompt: string,
    ...questions: Array<SpecializedGroup<ID, ErrorType, QuestionAnswerNode<ID, number, ErrorType>>>
  ) {
    super(id, prompt);
    this.compositionGroups = questions;
  }

  public searchById(
    id: ID,
  ): SpecializedGroup<ID, ErrorType, QuestionAnswerNode<ID, number, ErrorType>> | undefined {
    return this.compositionGroups.find((question) => question.getId() === id);
  }

  public getAnswer(): number | undefined {
    return this.answer;
  }

  // Changes answer if given a non-negative number
  public setAnswer(answer: number): void {
    this.answer = answer >= 0 ? answer : this.answer;
  }

  private compositionGroupSumsUp(
    compositionGroup: SpecializedGroup<ID, ErrorType, QuestionAnswerNode<ID, number, ErrorType>>,
  ): boolean {
    return (
      compositionGroup
        .map((question) => question.getAnswer() ?? 0)
        .reduce((answer1, answer2) => answer1 + answer2) === this.getAnswer()
    );
  }

  public getCompositionQuestionsBySumsUp(
    sumsUp: boolean,
  ): Array<SpecializedGroup<ID, ErrorType, QuestionAnswerNode<ID, number, ErrorType>>> {
    return this.compositionGroups.filter(
      (compositionGroup) => this.compositionGroupSumsUp(compositionGroup) === sumsUp,
    );
  }

  public allSumUp(): boolean {
    return this.compositionGroups
      .map((compositionGroup) => this.compositionGroupSumsUp(compositionGroup))
      .reduce((bool1, bool2) => bool1 && bool2);
  }

  public forEach(
    numberGroupHandler: (
      numberGroup: SpecializedGroup<ID, ErrorType, QuestionAnswerNode<ID, number, ErrorType>>,
    ) => void,
  ): void {
    this.compositionGroups.forEach(numberGroupHandler);
  }

  public map<T>(
    mapper: (numberGroup: SpecializedGroup<ID, ErrorType, QuestionAnswerNode<ID, number, ErrorType>>) => T,
  ): T[] {
    return this.compositionGroups.map(mapper);
  }
}
