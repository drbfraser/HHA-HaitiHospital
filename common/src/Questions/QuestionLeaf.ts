// Should represent a single question and have no nested questions.
import { QuestionNode } from './QuestionNode';

export interface ValidationResult<ErrorType> {
  readonly isValid: boolean;
  readonly error?: ErrorType;
  readonly message?: string;
}

export abstract class QuestionLeaf<ID, T, ErrorType> extends QuestionNode<ID, ErrorType> {
  private answer: T | undefined;

  private readonly validators: string[] | undefined;

  constructor(id: ID, prompt: string, defaultAnswer?: T) {
    super(id, prompt);
    this.answer = defaultAnswer;
    this.validators = [];
  }

  public getAnswer(): T | undefined {
    return this.answer;
  }

  public setAnswer(answer: T): void {
    this.answer = answer;
  }

  public getValidators(): string[] | undefined {
    return this.validators;
  }

  public addValidator(validator: string): void {
    this.validators?.push(validator);
  }
}
