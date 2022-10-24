// Should represent a single question and have no nested questions.
import { QuestionNode } from './QuestionNode';

export interface ValidationResult<ErrorType> {
  readonly isValid: boolean;
  readonly error?: ErrorType;
  readonly message?: string;
}

export abstract class QuestionLeaf<ID, T, ErrorType> extends QuestionNode<ID, ErrorType> {
  private answer?: T;

  private readonly validators: Array<(answer?: T) => ValidationResult<ErrorType>>;

  constructor(id: ID, prompt: string, defaultAnswer?: T) {
    super(id, prompt);
    this.answer = defaultAnswer;
    this.validators = new Array<(answer: T) => ValidationResult<ErrorType>>();
  }

  public getAnswer(): T | undefined {
    return this.answer;
  }

  public setAnswer(answer: T): void {
    this.answer = answer;
  };

  public addValidator(validator: (answer?: T) => ValidationResult<ErrorType>): void {
    this.validators.push(validator);
  };

  public isValid(): boolean {
    return this.validators
      .map((validator) => validator(this.answer).isValid)
      .reduce((isValid1, isValid2) => isValid1 && isValid2, true);
  };

  public getValidationResults(): Array<ValidationResult<ErrorType>> {
    return this.validators.map((validator: (answer?: T) => ValidationResult<ErrorType>) =>
      validator(this.answer),
    );
  };
}
