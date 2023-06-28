import { QuestionNode } from './QuestionNode';
import { QuestionParent } from './QuestionParent';
import { ValidationResult } from '../Form_Validators';

type Translation = Record<string, string>;

export interface QuestionAnswer<T> {
  getAnswer(): T | undefined;
}

export interface QuestionValidator {
  addValidator(validator: string): void;
  getValidationResults(): ValidationResult<string>;
  getValidators(): string[];
}

export abstract class QuestionAnswerNode<ID, T, ErrorType>
  extends QuestionNode<ID, ErrorType>
  implements QuestionAnswer<T>, QuestionValidator
{
  promptTranslations: Translation = {};
  abstract addValidator(validator: string): void;
  abstract getAnswer(): T | undefined;
  abstract getValidationResults(): ValidationResult<string>;
  abstract getValidators(): string[];
}

export abstract class QuestionAnswerParent<ID, T, ErrorType>
  extends QuestionParent<ID, ErrorType>
  implements QuestionAnswer<T>, QuestionValidator
{
  promptTranslations: Translation = {};
  abstract addValidator(validator: string): void;
  abstract getAnswer(): T | undefined;
  abstract getValidationResults(): ValidationResult<string>;
  abstract getValidators(): string[];
}
