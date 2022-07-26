import { body, check } from 'express-validator';
import { isDepartment } from 'sanitization/validators/isDepartment';
import { isRole } from 'sanitization/validators/isRole';
import { EXPECTING_DEPARTMENT, EXPECTING_NAME, EXPECTING_ROLE, INVALID_DEPARTMENT, INVALID_ROLE, msgString, msgStringMulti } from '../messages';
const mongoose = require('mongoose');

const UNAME_SIZE_MIN: number = 2;
const UNAME_SIZE_MAX: number = 20;
const PW_SIZE_MIN: number = 6;
const PW_SIZE_MAX: number = 60;

const userCreate = [
  body('username').exists().trim().escape().isLength({ min: UNAME_SIZE_MIN, max: UNAME_SIZE_MAX }).withMessage(msgStringMulti(UNAME_SIZE_MIN, UNAME_SIZE_MAX)),
  body('password').exists().trim().escape().isLength({ min: PW_SIZE_MIN, max: PW_SIZE_MAX }).withMessage(msgStringMulti(PW_SIZE_MIN, PW_SIZE_MAX)),
  body('department')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage(EXPECTING_DEPARTMENT)
    .isObject()
    .custom(isDepartment)
    .withMessage(INVALID_DEPARTMENT),
  body('name')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage(EXPECTING_NAME)
    .trim()
    .escape(),
  body('role')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .withMessage(EXPECTING_ROLE)
    .trim()
    .escape()
    .custom(isRole)
    .withMessage(INVALID_ROLE)
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

export { userCreate as registerUserCreate, userEdit as registerUserEdit };
