// Should represent a single question and have no nested questions.
import { QuestionAnswerNode } from './QuestionAnswer';
import { runNumericValidators, ValidationResult } from '../Form_Validators';

export abstract class QuestionLeaf<ID, T, ErrorType> extends QuestionAnswerNode<ID, T, ErrorType> {
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

  // The following function is used to check if the answer is valid for all the validators.
  // It returns true if the answer is valid for all the validators.
  // Otherwise, it returns the error message for the first validator that the answer is invalid for.
  public getValidationResults(): ValidationResult<string> {
    const defaultValidationResult = true;

    if (this.validators === undefined) return defaultValidationResult;

    for (let i = 0; i < this.validators.length; i++) {
      const validatorName = this.validators[i];
      if (validatorName === undefined || typeof validatorName !== 'string') continue;
      if (runNumericValidators[validatorName] === undefined) return defaultValidationResult;
      const res = this.validateResult(this.answer, validatorName);

      if (res !== true) return res;
    }
    return defaultValidationResult;
  }

  private validateResult(answer: any, validatorName: string): ValidationResult<string> {
    const answerType = typeof answer;
    switch (answerType) {
      case 'number':
        return runNumericValidators[validatorName]!(answer);
      default:
        return true;
    }
  }
}
