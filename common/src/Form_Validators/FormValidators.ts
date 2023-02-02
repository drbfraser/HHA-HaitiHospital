import { ValidationResult } from '../Questions';

export interface Validator<T> {
  (x: T): ValidationResult<string>;
}

export const runNumericValidators: { [key: string]: Validator<number> } = {
  isEven: (x) =>
    x % 2 === 0 ? true : { error: 'ODD_NUMBER', message: 'Please input an even number' },
  isOdd: (x) =>
    x % 2 !== 0 ? true : { error: 'EVEN_NUMBER', message: 'Please input an odd number' },
  isPositive: (x) =>
    x >= 0 ? true : { error: 'NEGATIVE_NUMBER', message: 'Please input a non-negative number' },
};

//Error messages for different types of questions
export const ERROR_NOT_A_INTEGER: ValidationResult<string> = {
  message: 'Please input an integer',
  error: 'NOT_A_INTEGER',
};

//Validators for different types of questions
export const isNumber = (x: any): boolean => {
  return !isNaN(parseInt(x));
};
