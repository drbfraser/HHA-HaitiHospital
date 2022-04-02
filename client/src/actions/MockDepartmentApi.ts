import { Department, DepartmentJson } from 'constants/interfaces';

const departmentData: DepartmentJson = require('../utils/json/departments.json');

const dataToMap = (): Map<string, Department> => {
  try {
    let _departmentMap = new Map<string, Department>();
    Object.values(departmentData.departments).forEach((dept: Department) => {
      _departmentMap.set(dept.id.toString(), dept);
    });
    return _departmentMap;
  } catch (error: any) {
    console.error('ERROR WITH LOADING DEPARTMENT DATA');
    return new Map<string, Department>();
  }
};

const departmentMap: Map<string, Department> = dataToMap();

const getDepartments = (): Department[] => {
  return departmentData.departments;
};

const getDepartmentById = (deptId: string): Department | object => {
  return departmentMap.has(deptId) ? departmentMap.get(deptId) : {};
};

const MockDepartmentApi = { getDepartments, getDepartmentById };

export default MockDepartmentApi;
