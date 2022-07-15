import { check } from 'express-validator';
import { msgString, msgDate } from '../utils/sanitizationMessages';
import { checkDepartment } from './checkDepartment';

const bioMechCreate = [
  check('user.*.id').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('user.*.username').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('user.*.name').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('user.*.role').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('department').custom(checkDepartment),
  check('user.*.createdAt')
    .notEmpty()
    .custom((val) => /^(19|20)\d\d-(0[1-9]|1[012])-([012]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val))
    .trim()
    .escape()
    .withMessage(msgDate),
  check('user.*.updatedAt')
    .notEmpty()
    .custom((val) => /^(19|20)\d\d-(0[1-9]|1[012])-([012]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val))
    .trim()
    .escape()
    .withMessage(msgDate),
  check('document.*.equipmentName').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('document.*.equipmentFault').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('document.*.equipmentPriority').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('document.*.imgPath').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('document.*.createdAt')
    .notEmpty()
    .custom((val) => /^(19|20)\d\d-(0[1-9]|1[012])-([012]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val))
    .trim()
    .escape()
    .withMessage(msgDate),
  check('document.*.updatedAt')
    .notEmpty()
    .custom((val) => /^(19|20)\d\d-(0[1-9]|1[012])-([012]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val))
    .trim()
    .escape()
    .withMessage(msgDate)
];

export { bioMechCreate as registerBioMechCreate };
