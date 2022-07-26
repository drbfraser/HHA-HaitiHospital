import { body, check } from 'express-validator';
import { isDepartment } from 'sanitization/validators/isDepartment';
import { isRole } from 'sanitization/validators/isRole';
import { msgStringMulti } from '../messages';
const mongoose = require('mongoose');

const UNAME_SIZE_MIN: number = 2;
const UNAME_SIZE_MAX: number = 20;
const PW_SIZE_MIN: number = 6;
const PW_SIZE_MAX: number = 60;

const userCreate = [
  body('username', msgStringMulti(UNAME_SIZE_MIN, UNAME_SIZE_MAX))
    .exists({
      checkNull: true
    })
    .isString()
    .trim()
    .escape()
    .isLength({ min: UNAME_SIZE_MIN, max: UNAME_SIZE_MAX }),
  body('password', msgStringMulti(PW_SIZE_MIN, PW_SIZE_MAX))
    .exists({
      checkNull: true
    })
    .isString()
    .trim()
    .escape()
    .isLength({ min: PW_SIZE_MIN, max: PW_SIZE_MAX }),
  body('department')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .isObject()
    .custom(isDepartment),
  body('name')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .trim()
    .escape(),
  body('role')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .isString()
    .trim()
    .escape()
    .custom(isRole)
];

const userEdit = [
  check('username').exists().trim().escape().isLength({ min: 2, max: 20 }).withMessage(msgStringMulti(2, 20)),
  check('name').exists().trim().escape().isLength({ min: 2, max: 30 }).withMessage(msgStringMulti(2, 30)),
  check('role').exists().isAlpha().trim().escape().withMessage('User role is expected'),
  check('department.id')
    .not()
    .isEmpty()
    .withMessage('Department Id must be non Empty')
    .custom((id) => mongoose.isValidObjectId(id))
    .withMessage('Department Id must be a valid mongoose Id'),
  check('department.name').not().isEmpty().trim().withMessage('Department name must be non empty'),
  check('password').if(check('password').exists().notEmpty()).escape().isLength({ min: 6, max: 20 }).withMessage(msgStringMulti(6, 20))
];

// const userEdit = [
//   body('username', msgStringMulti(UNAME_SIZE_MIN, UNAME_SIZE_MAX))
//     .exists({
//       checkNull: true
//     })
//     .isString()
//     .trim()
//     .escape()
//     .isLength({ min: UNAME_SIZE_MIN, max: UNAME_SIZE_MAX }),
//   body('password', msgStringMulti(PW_SIZE_MIN, PW_SIZE_MAX))
//     .exists({
//       checkNull: true
//     })
//     .isString()
//     .trim()
//     .escape()
//     .isLength({ min: PW_SIZE_MIN, max: PW_SIZE_MAX }),
//   body('department')
//     .exists({
//       checkNull: true,
//       checkFalsy: true
//     })
//     .isObject()
//     .custom(isDepartment),
//   body('name')
//     .exists({
//       checkNull: true,
//       checkFalsy: true
//     })
//     .trim()
//     .escape(),
//   body('role')
//     .exists({
//       checkNull: true,
//       checkFalsy: true
//     })
//     .isString()
//     .trim()
//     .escape()
//     .custom(isRole)
// ];

export { userCreate as registerUserCreate, userEdit as registerUserEdit };
