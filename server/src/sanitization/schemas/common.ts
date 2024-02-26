import { body, ValidationChain } from 'express-validator';

// Field in body must be non-falsy (not empty, not undefined, not null) for the chain to persit.
export const nonFalsyBodyField = <IObj>(field: keyof IObj): ValidationChain => {
  return body(field as string)
    .exists({
      checkFalsy: true,
      checkNull: true,
    })
    .withMessage(`Expecting a value`)
    .if((value: IObj) => value);
};
