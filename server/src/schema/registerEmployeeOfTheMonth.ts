import { check } from 'express-validator';
import { msgString, msgDate } from '../utils/sanitizationMessages';

const employeeOfTheMonthEdit = [
  check('document.*.name').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('document.*.department').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('document.*.description').trim().escape().isLength({ min: 1 }).withMessage(msgString),
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

export { employeeOfTheMonthEdit as registerEmployeeOfTheMonthEdit };
