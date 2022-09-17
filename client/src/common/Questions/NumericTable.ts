//  A question table where all answers are numbers.
import { serializable } from 'common/Serializer/ObjectSerializer';
import { QuestionTable } from './QuestionTable';
import { NumericQuestion } from './SimpleQuestionTypes';

@serializable(undefined, [], [], () => undefined)
export class NumericTable<ID, ErrorType> extends QuestionTable<
  ID,
  number,
  ErrorType,
  NumericQuestion<ID, ErrorType>
> {}
