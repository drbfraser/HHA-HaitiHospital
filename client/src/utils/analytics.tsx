import { DepartmentJson } from '@hha/common';

export const findDepartmentIdByName = (departments: DepartmentJson[], departmentName: string) => {
  return departments.find((department) => department.name == departmentName)?.id;
};

export const getAllDepartmentNames = (departments: DepartmentJson[]) => {
  return departments.map((department) => department.name);
};
