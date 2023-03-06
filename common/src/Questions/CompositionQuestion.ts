/*  A composition question represents a question whose answer must be equal
    to the sum of its numeric children questions.
*/
import { serializable } from '../Serializer/ObjectSerializer';
import { SpecializedGroup, ValidationResult } from '.';
import { QuestionAnswerNode, QuestionAnswerParent } from './QuestionAnswer';
import { ERROR_DOES_NOT_SUM_UP, ERROR_NOT_A_INTEGER, isNumber } from '../Form_Validators';

type ChildType<ID, ErrorType> = SpecializedGroup<
  ID,
  ErrorType,
  QuestionAnswerNode<ID, number, ErrorType>
>;

@serializable(undefined)
export class CompositionQuestion<ID, ErrorType> extends QuestionAnswerParent<
  ID,
  number,
  ErrorType
> {
  private answer: number | undefined = 0;
  private readonly compositionGroups: Array<ChildType<ID, ErrorType>>;

  constructor(id: ID, prompt: string, ...questions: Array<ChildType<ID, ErrorType>>) {
    super(id, prompt);
    this.compositionGroups = questions;
  }

  public searchById(id: ID): ChildType<ID, ErrorType> | undefined {
    return this.compositionGroups.find((question) => question.getId() === id);
  }

  public getAnswer(): number | undefined {
    return this.answer;
  }

  // Changes answer if given a non-negative number
  public setAnswer(answer: number): void {
    this.answer = answer >= 0 ? answer : this.answer;
  }

  private compositionGroupSumsUp(compositionGroup: ChildType<ID, ErrorType>): boolean {
    return (
      compositionGroup
        .map((question) => question.getAnswer() ?? 0)
        .reduce((answer1, answer2) => answer1 + answer2) === this.getAnswer()
    );
  }

  public getCompositionQuestionsBySumsUp(sumsUp: boolean): Array<ChildType<ID, ErrorType>> {
    return this.compositionGroups.filter(
      (compositionGroup) => this.compositionGroupSumsUp(compositionGroup) === sumsUp,
    );
  }

  public allSumUp(): boolean {
    if (this.compositionGroups.length === 0) return true;
    return this.compositionGroups
      .map((compositionGroup) => this.compositionGroupSumsUp(compositionGroup))
      .reduce((bool1, bool2) => bool1 && bool2);
  }

  public getValidationResults(): ValidationResult<string> {
    if (!isNumber(this.answer)) {
      return ERROR_NOT_A_INTEGER;
    }
    else if (!this.allSumUp()) {
      return ERROR_DOES_NOT_SUM_UP;
    }
    return true;
  }

  public forEach(numberGroupHandler: (numberGroup: ChildType<ID, ErrorType>) => void): void {
    this.compositionGroups.forEach(numberGroupHandler);
  }

  public map<T>(mapper: (numberGroup: ChildType<ID, ErrorType>) => T): T[] {
    return this.compositionGroups.map(mapper);
  }
}
