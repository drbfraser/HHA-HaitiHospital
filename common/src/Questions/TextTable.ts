import { serializable } from '../Serializer/ObjectSerializer';
import { QuestionTable } from './QuestionTable';
import { TextQuestion } from './SimpleQuestionTypes';

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
