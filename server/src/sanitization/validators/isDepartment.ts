import { CustomValidator } from 'express-validator';
import { DepartmentJson } from '../../models/departments';
import Departments from '../../utils/departments';

export const isDepartment: CustomValidator = async (value: DepartmentJson) => {
  try {
    const name = await Departments.Database.getDeptNameById(value.id);
    if (name !== value.name) return Promise.reject();
    return name !== value.name ? Promise.reject() : true;
  } catch (e) {
    return Promise.reject();
  }
};
