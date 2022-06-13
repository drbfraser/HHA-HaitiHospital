import { Department } from 'constants/interfaces';

export const createDepartmentMap = (data: Department[]): Map<string, Department> => {
  try {
    let departmentMap = new Map<string, Department>();
    Object.values(data).forEach((dept: Department) => {
      departmentMap.set(dept.name, dept);
    });
    return departmentMap;
  } catch (error: any) {
    return new Map<string, Department>();
  }
};
