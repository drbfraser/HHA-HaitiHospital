// Should represent a single question and have no nested questions.
import { QuestionNode } from './QuestionNode';
import { runNumericValidators } from '../Form_Validators';

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

  public getValidationResults(): ValidationResult<string> {
    const defaultValidationResult = { isValid: true, message: '', error: '' };

    if (this.validators === undefined) return defaultValidationResult;

    for (let i = 0; i < this.validators.length; i++) {
      const validatorName = this.validators[i];
      if (validatorName === undefined || typeof validatorName !== 'string') continue;
      if (
        runNumericValidators[validatorName] === undefined ||
        typeof runNumericValidators[validatorName] !== 'function'
      )
        return defaultValidationResult;
      const res = this.validateResult(this.answer, validatorName);

      if (!res.isValid) return res;
    }
    return defaultValidationResult;
  }

  private validateResult(answer: any, validatorName: string): ValidationResult<string> {
    const answerType = typeof answer;
    switch (answerType) {
      case 'number':
        return runNumericValidators[validatorName]!(answer);
      default:
        return { isValid: true, message: '', error: '' };
    }
  }
}
