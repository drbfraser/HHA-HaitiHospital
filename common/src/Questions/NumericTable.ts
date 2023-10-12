import { serializable } from '../Serializer/ObjectSerializer';
import { QuestionTable } from './QuestionTable';
import { NumericQuestion } from './SimpleQuestionTypes';

@serializable(undefined, undefined, [], [], () => undefined)
export class NumericTable<ID, ErrorType> extends QuestionTable<
  ID,
  number,
  ErrorType,
  NumericQuestion<ID, ErrorType>
> { }