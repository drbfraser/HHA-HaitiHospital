import { check } from 'express-validator';
import { msgString, msgStringMulti } from '../utils/sanitizationMessages';
import { checkDepartment } from './checkDepartment';

const userCreate = [
  check('username').exists().trim().escape().isLength({ min: 2, max: 20 }).withMessage(msgStringMulti(2, 20)),
  check('password').exists().trim().escape().isLength({ min: 6, max: 20 }).withMessage(msgStringMulti(6, 20)),
  check('department').custom(checkDepartment),
  check('name').exists().trim().escape().isLength({ min: 2, max: 30 }).withMessage(msgStringMulti(2, 30)),
  check('role').exists().trim().escape().isLength({ min: 1 }).withMessage(msgString)
];

const userEdit = [
  check('username').exists().trim().escape().isLength({ min: 2, max: 20 }).withMessage(msgStringMulti(2, 20)),
  check('name').exists().trim().escape().isLength({ min: 2, max: 30 }).withMessage(msgStringMulti(2, 30)),
  check('role').exists().trim().escape().withMessage('User role is expected'),
  check('department').custom(checkDepartment),
  check('password').if(check('password').exists().notEmpty()).escape().isLength({ min: 6, max: 20 }).withMessage(msgStringMulti(6, 20))
];

export { userCreate as registerUserCreate, userEdit as registerUserEdit };
