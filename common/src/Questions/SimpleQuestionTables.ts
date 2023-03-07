// Module containing question tables that have simple data as their question
// answers.
import { serializable } from '../Serializer/ObjectSerializer';
import { QuestionTable } from './QuestionTable';
import { NumericQuestion, TextQuestion } from './SimpleQuestionTypes';

@serializable('TextTable', undefined, [], [], () => undefined)
export class TextTable<ID, ErrorType> extends QuestionTable<
  ID,
  string,
  ErrorType,
  TextQuestion<ID, ErrorType>
> {
  public override getClassName(): string {
    return 'TextTable';
  }
}

@serializable('NumericTable', undefined, [], [], () => undefined)
export class NumericTable<ID, ErrorType> extends QuestionTable<
  ID,
  number,
  ErrorType,
  NumericQuestion<ID, ErrorType>
> {
  public override getClassName(): string {
    return 'NumericTable';
  }
}
