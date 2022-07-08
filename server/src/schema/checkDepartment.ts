import { check } from 'express-validator';
const mongoose = require('mongoose');

export const checkDepartment = () => {
  return check('department').custom((department) => {
    if (department) {
      [
        check('department.id')
          .notEmpty()
          .custom((id) => mongoose.isValidObjectId(id))
          .withMessage('Department Id must be non empty and a valid mongoose Id'),
        check('department.name').notEmpty().trim().withMessage('Department name must be non empty')
      ];
    }
  });
};
