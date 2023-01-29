// Should represent a single question and have no nested questions.
import { QuestionNode } from './QuestionNode';

export interface ValidationResult<ErrorType> {
  readonly isValid: boolean;
  readonly error?: ErrorType;
  readonly message?: string;
}

export abstract class QuestionLeaf<ID, T, ErrorType> extends QuestionNode<ID, ErrorType> {
  private answer: T | undefined;

  private readonly validator: string | undefined;

  constructor(id: ID, prompt: string, defaultAnswer?: T) {
    super(id, prompt);
    this.answer = defaultAnswer;
  }

  public getAnswer(): T | undefined {
    return this.answer;
  }

  public setAnswer(answer: T): void {
    this.answer = answer;
  }

  public getValidator(): string | undefined {
    return this.validator;
  }

}
