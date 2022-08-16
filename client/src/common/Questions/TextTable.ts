import { serializable } from 'common/Serializer/ObjectSerializer';
import { QuestionTable } from './QuestionTable';
import { TextQuestion } from './SimpleQuestionTypes';

@serializable(undefined, [], [], () => undefined)
export class TextTable<ID, ErrorType> extends QuestionTable<
  ID,
  string,
  ErrorType,
  TextQuestion<ID, ErrorType>
> {}
