// Leaf questions in the question tree for questions with simple data types as
// answers.
import { serializable } from '../Serializer/ObjectSerializer';
import { ERROR_NOT_A_INTEGER, isNumber, ValidationResult } from '../Form_Validators';
import { QuestionLeaf } from './QuestionLeaf';

type Translation = Record<string, string>;

@serializable(undefined, '')
export class TextQuestion<ID, ErrorType> extends QuestionLeaf<ID, string, ErrorType> {}

@serializable(undefined, '')
export class NumericQuestion<ID, ErrorType> extends QuestionLeaf<ID, number, ErrorType> {
  constructor(id: ID, prompt: Translation, defaultAnswer?: number) {
    super(id, prompt, defaultAnswer);
    this.addValidator('isPositive');
  }

  public override getValidationResults(): ValidationResult<string> {
    const results = super.getValidationResults();

    if (results !== true) {
      return results;
    } else if (!isNumber(this.getAnswer())) {
      return ERROR_NOT_A_INTEGER;
    }
    return true;
  }
}
