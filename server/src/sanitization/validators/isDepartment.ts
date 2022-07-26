import { CustomValidator } from 'express-validator';
import { DepartmentJson } from 'models/departments';
import Departments from 'utils/departments';

export const isDepartment: CustomValidator = async (value: DepartmentJson) => {
    const valid: boolean = await Departments.Database.getDeptNameById(value.id) === value.name;
    return valid;
}