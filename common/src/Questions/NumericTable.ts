import { serializable } from '../Serializer/ObjectSerializer';
import { QuestionTable } from './QuestionTable';
import { NumericQuestion } from './SimpleQuestionTypes';

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
