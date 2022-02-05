import { check } from 'express-validator';
import { msgString, msgStringMulti } from '../utils/sanitizationMessages';

const userCreate = [
  check('username').trim().escape().isLength({ min: 2, max: 20 }).withMessage(msgStringMulti(2, 20)),
  check('password').trim().escape().isLength({ min: 6, max: 20 }).withMessage(msgStringMulti(6, 20)),
  check('name').trim().escape().isLength({ min: 2, max: 30 }).withMessage(msgStringMulti(2, 30)),
  check('role').trim().escape().isLength({ min: 1 }).withMessage(msgString)
];

export { userCreate as registerUserCreate };
