import { body } from 'express-validator';
import { isDepartment } from 'sanitization/validators/isDepartment';
import { isRole } from 'sanitization/validators/isRole';
import { msgStringMulti } from '../messages';

const UNAME_SIZE_MIN: number = 2;
const UNAME_SIZE_MAX: number = 20;
const PW_SIZE_MIN: number = 6;
const PW_SIZE_MAX: number = 60;

const userCreate = [
  body('username', msgStringMulti(UNAME_SIZE_MIN, UNAME_SIZE_MAX))
    .exists({
      checkNull: true,
    })
    .isString()
    .trim()
    .escape()
    .isLength({ min: UNAME_SIZE_MIN, max: UNAME_SIZE_MAX }),
  body('password', msgStringMulti(PW_SIZE_MIN, PW_SIZE_MAX))
    .exists({
      checkNull: true,
    })
    .isString()
    .trim()
    .escape()
    .isLength({ min: PW_SIZE_MIN, max: PW_SIZE_MAX }),
  body('department')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .isObject()
    .custom(isDepartment),
  body('name')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .trim()
    .escape(),
  body('role')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .isString()
    .trim()
    .escape()
    .custom(isRole),
];

const userEdit = [
  body('username')
    .exists({
      checkNull: true,
    })
    .isString()
    .trim()
    .if((value: string) => value.length !== 0)
    .escape()
    .isLength({ min: UNAME_SIZE_MIN, max: UNAME_SIZE_MAX })
    .withMessage(msgStringMulti(UNAME_SIZE_MIN, UNAME_SIZE_MAX)),

  body('password')
    .exists({
      checkNull: true,
    })
    .isString()
    .trim()
    .if((value: string) => value.length !== 0)
    .escape()
    .isLength({ min: PW_SIZE_MIN, max: PW_SIZE_MAX })
    .withMessage(msgStringMulti(PW_SIZE_MIN, PW_SIZE_MAX)),

  body('department')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .isObject()
    .custom(isDepartment),
  body('name')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .trim()
    .escape(),
  body('role')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .isString()
    .trim()
    .escape()
    .custom(isRole),
];

export const user = {
  post: userCreate,
  put: userEdit,
};
