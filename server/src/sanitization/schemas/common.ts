import { ValidationChain } from 'express-validator';

// Field must be non-falsy (not empty, not undefined, not null) for the chain to persit.
export const nonFalsy = (chain: ValidationChain): ValidationChain => {
  return chain
    .exists({
      checkFalsy: true,
      checkNull: true
    })
    .withMessage(`Expecting a value`)
    .if((value) => value);
};

// Field must be a string. If so, trim whitespace on 2 ends and escape string.
export const isString = (chain: ValidationChain): ValidationChain => {
  return chain.isString().withMessage(`Expecting text`).trim().escape();
};
