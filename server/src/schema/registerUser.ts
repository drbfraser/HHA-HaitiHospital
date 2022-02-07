import { check } from 'express-validator';
import { msgString, msgStringMulti } from '../utils/sanitizationMessages';

const userCreate = [
  check('username').trim().escape().isLength({ min: 2, max: 20 }).withMessage(msgStringMulti(2, 20)),
  check('password').trim().escape().isLength({ min: 6, max: 20 }).withMessage(msgStringMulti(6, 20)),
  check('name').trim().escape().isLength({ min: 2, max: 30 }).withMessage(msgStringMulti(2, 30)),
  check('role').trim().escape().isLength({ min: 1 }).withMessage(msgString)
];

const userEdit = [
    check('username').exists().trim().escape().isLength({ min: 2, max: 20 }).withMessage(msgStringMulti(2, 20)),
    check('name').exists().trim().escape().isLength({ min: 2, max: 30 }).withMessage(msgStringMulti(2, 30)),
    check('role').exists().trim().escape().withMessage("User role is expected"),
    check('department').exists().trim().withMessage("User department is expectd"),
    check('password').if(check('password').exists().notEmpty()).escape().isLength({min: 6, max: 20}).withMessage(msgStringMulti(6, 20))
]

export { userCreate as registerUserCreate, userEdit as registerUserEdit };
