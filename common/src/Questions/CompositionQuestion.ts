/*  A composition question represents a question whose answer must be equal
    to the sum of its numeric children questions.
*/
import { serializable } from '../Serializer/ObjectSerializer';
import { QuestionParent } from './QuestionParent';
import { NumericQuestion } from './SimpleQuestionTypes';
import { SpecializedGroup } from './SpecializedGroup';

@serializable(undefined)
export class CompositionQuestion<ID, ErrorType> extends QuestionParent<ID, ErrorType> {
  private answer?: number;
  private readonly compositionGroups: Array<SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>>;

  constructor(id: ID, prompt: string, ...questions: Array<SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>>) {
    super(id, prompt);
    this.compositionGroups = questions;
  }

  public searchById(id: ID): SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>> | undefined {
    return this.compositionGroups.find((question) => question.getId() === id);
  };

  public getAnswer(): number | undefined {
    return this.answer;
  }

  // Changes answer if given a non-negative number
  public setAnswer(answer: number): void {
    this.answer = answer >= 0 ? answer : this.answer;
  };
  
  private compositionGroupSumsUp(compositionGroup: SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>): boolean {
    return compositionGroup.getQuestions()
      .map((question) => question.getAnswer())
      .reduce((answer1, answer2) => answer1 + answer2) === this.getAnswer();
  }
  
  public getCompositionQuestionsBySumsUp(sumsUp: boolean): 
    Array<SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>> {
    return this.compositionGroups
      .filter((compositionGroup) => this.compositionGroupSumsUp(compositionGroup) === sumsUp);    
  }
  
  public allSumUp(): boolean {
    return this.compositionGroups
      .map((compositionGroup) => this.compositionGroupSumsUp(compositionGroup))
      .reduce((bool1, bool2) => bool1 && bool2);
  }

 }
