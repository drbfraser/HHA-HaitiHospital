import { body, ValidationChain } from 'express-validator';

// Field in body must be non-falsy (not empty, not undefined, not null) for the chain to persit.
export const nonFalsyBodyField = (field: string): ValidationChain => {
  return body(field)
    .exists({
      checkFalsy: true,
      checkNull: true
    })
    .withMessage(`Expecting a value`)
    .if((value) => value);
};
