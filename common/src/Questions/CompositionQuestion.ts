/*  A composition question represents a question whose answer must be equal
    to the sum of its numeric children questions.
*/
import { serializable } from '../Serializer/ObjectSerializer';
import { QuestionParent } from './QuestionParent';
import { NumericQuestion } from './SimpleQuestionTypes';

@serializable(undefined)
export class CompositionQuestion<ID, ErrorType> extends QuestionParent<ID, ErrorType> {
  private answer?: number;
  private readonly questions: Array<NumericQuestion<ID, ErrorType>> = [];

  constructor(id: ID, defaultAnswer?: number, ...questions: Array<NumericQuestion<ID, ErrorType>>) {
    super(id);
    this.setAnswer(defaultAnswer);
    questions ? this.addAll(...questions) : undefined;
  }

  public readonly searchById = (id: ID): NumericQuestion<ID, ErrorType> | undefined => {
    return this.questions.find((question) => question.getId() === id);
  };

  public readonly add = (numericQuestion: NumericQuestion<ID, ErrorType>): CompositionQuestion<ID, ErrorType> => {
    this.questions.push(numericQuestion);
    return this;
  };

  public readonly addAll = (...questions: Array<NumericQuestion<ID, ErrorType>>): QuestionParent<ID, ErrorType> => {
    questions.forEach((question) => this.add(question));
    return this;
  };

  public readonly handleNumericQuestions = (handler: (numericQuestion: NumericQuestion<ID, ErrorType>) => void): void => {
    this.questions.forEach((question) => handler(question));
  };

  public readonly getAnswer = (): number | undefined => this.answer;

  // Changes answer if given a non-negative number
  public readonly setAnswer = (answer: number): void => {
    this.answer = answer >= 0 ? answer : this.answer;
  };

  public readonly sumsUp = (): boolean => {
    return this.answer ? this.questions.map((question) => question.getAnswer()).reduce((answer1, answer2) => answer1 + answer2) === this.answer : false;
  };
}
