type Validator = (x: number) => { isValid: boolean; error?: string; message?: string };

export const runValidators: { [key: string]: Validator } = {
  isEven: (x) =>
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
