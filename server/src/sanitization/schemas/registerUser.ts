import { check } from 'express-validator';
import { msgString, msgStringMulti } from '../messages';
import { checkDepartment } from './checkDepartment';
const mongoose = require('mongoose');

const userCreate = [
  check('username').exists().trim().escape().isLength({ min: 2, max: 20 }).withMessage(msgStringMulti(2, 20)),
  check('password').exists().trim().escape().isLength({ min: 6, max: 20 }).withMessage(msgStringMulti(6, 20)),
  check('department.id')
    .not()
    .isEmpty()
    .withMessage('Department Id must be non Empty')
    .custom((id) => mongoose.isValidObjectId(id))
    .withMessage('Department Id must be a valid mongoose Id'),
  check('department.name').not().isEmpty().trim().withMessage('Department name must be non empty'),
  check('name').exists().trim().escape().isLength({ min: 2, max: 30 }).withMessage(msgStringMulti(2, 30)),
  check('role').exists().isAlpha().trim().escape().isLength({ min: 1 }).withMessage(msgString)
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
