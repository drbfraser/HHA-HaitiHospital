import { ValidationResult } from '../Questions';

export interface Validator<T> {
  (x: T): ValidationResult<string>;
}

export const runNumericValidators: { [key: string]: Validator<number> } = {
  isEven: (
    x, 
  ) =>
    x % 2 === 0
      ? { isValid: true, message: '', error: '' }
      : { isValid: false, error: 'ODD_NUMBER', message: 'Please input an even number' },
  isOdd: (x) =>
    x % 2 !== 0
      ? { isValid: true, message: '', error: '' }
      : { isValid: false, error: 'EVEN_NUMBER', message: 'Please input an odd number' },
  isPositive: (x) =>
    x >= 0
      ? { isValid: true, message: '', error: '' }
      : { isValid: false, error: 'NEGATIVE_NUMBER', message: 'Please input a non-negative number' },
};
