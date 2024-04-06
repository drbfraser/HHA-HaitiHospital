import { DepartmentJson as Department } from '@hha/common';

export const createDepartmentNameMap = (data: Department[]): Map<string, Department> => {
  if (!data) return new Map<string, Department>();
  let departmentMap = new Map<string, Department>();
  Object.values(data).forEach((dept: Department) => {
    departmentMap.set(dept.name, dept);
  });
  return departmentMap;
};

export const createDepartmentIdMap = (data: Department[]): Map<string, string> => {
  if (!data) return new Map<string, string>();
  let departmentMap = new Map<string, string>();
  Object.values(data).forEach((dept: Department) => {
    departmentMap.set(dept.id, dept.name);
  });
  return departmentMap;
};
