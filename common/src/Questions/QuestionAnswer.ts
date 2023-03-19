import { QuestionNode } from './QuestionNode';
import { QuestionParent } from './QuestionParent';

export interface QuestionAnswer<T> {
  getAnswer(): T | undefined;
}

export interface QuestionValidator {
  addValidator(validator: string): void;
  getValidators(): string[];
}

export abstract class QuestionAnswerNode<ID, T, ErrorType>
  extends QuestionNode<ID, ErrorType>
  implements QuestionAnswer<T>, QuestionValidator
{
  abstract addValidator(validator: string): void;
  abstract getAnswer(): T | undefined;
  abstract getValidators(): string[];
}

export abstract class QuestionAnswerParent<ID, T, ErrorType>
  extends QuestionParent<ID, ErrorType>
  implements QuestionAnswer<T>, QuestionValidator
{
  abstract addValidator(validator: string): void;
  abstract getAnswer(): T | undefined;
  abstract getValidators(): string[];
}
