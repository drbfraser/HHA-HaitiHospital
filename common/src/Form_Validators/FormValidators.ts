export type Translation = Record<string, string>;

export interface ValidationError<ErrorType> {
  readonly error?: ErrorType;
  readonly message?: Translation | undefined;
}

export type ValidationResult<ErrorType> = ValidationError<ErrorType> | true;

export interface Validator<T> {
  (x: T): ValidationResult<string>;
}

const translations: Record<string, Translation> = {
  notInteger: {
    en: 'Please input an integer',
    fr: 'Veuillez saisir un nombre entier',
  },
  sumDoesNotMatch: {
    en: 'The values below do not sum up to the total',
    fr: 'Les valeurs ci-dessous ne totalisent pas le total',
  },
  atLeastOneChoice: {
    en: 'Please select at least one choice',
    fr: 'Veuillez sélectionner au moins un choix',
  },
  evenNumber: {
    en: 'Please input an even number',
    fr: 'Veuillez saisir un nombre pair',
  },
  oddNumber: {
    en: 'Please input an odd number',
    fr: 'Veuillez saisir un nombre impair',
  },
  nonNegativeNumber: {
    en: 'Please input a non-negative number',
    fr: 'Veuillez saisir un nombre non négatif',
  },
};

export const runNumericValidators: { [key: string]: Validator<number> } = {
  isEven: (x) =>
    x % 2 === 0
      ? true
      : {
          error: 'ODD_NUMBER',
          message: translations.evenNumber,
        },
  isOdd: (x) =>
    x % 2 !== 0
      ? true
      : {
          error: 'EVEN_NUMBER',
          message: translations.oddNumber,
        },
  isPositive: (x) =>
    x >= 0
      ? true
      : {
          error: 'NEGATIVE_NUMBER',
          message: translations.nonNegativeNumber,
        },
};

//Error messages for different types of questions
export const ERROR_NOT_A_INTEGER: ValidationResult<string> = {
  message: translations.notInteger,
  error: 'NOT_A_INTEGER',
};

export const ERROR_DOES_NOT_SUM_UP: ValidationResult<string> = {
  message: translations.sumDoesNotMatch,
  error: 'DOES_NOT_SUM_UP',
};

export const ERROR_AT_LEAST_ONE_CHOICE: ValidationResult<string> = {
  message: translations.atLeastOneChoice,
  error: 'AT_LEAST_ONE_CHOICE',
};

//Validators for different types of questions
export const isNumber = (x: any): boolean => {
  return !isNaN(parseInt(x));
};
