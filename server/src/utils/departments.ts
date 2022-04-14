import { Department } from 'models/departments';

export enum DefaultDepartments {
  General = 'General',
  Rehab = 'Rehab',
  NICU = 'NICU/Paeds',
  Maternity = 'Maternity',
  Community = 'Community & Health'
}

const General: string = DefaultDepartments.General;

const initIdToNameMap = (departments: Department[]): Map<string, string> => {
  let _departmentIdMapper = new Map<string, string>();
  departments.forEach((dept: Department) => {
    _departmentIdMapper.set(dept._id, dept.name as string);
  });
  return _departmentIdMapper;
};

const getDeptNameFromId = (deptId: string, map: Map<string, string>): string => {
  if (!map.has(deptId)) {
    throw new Error(`Department Id ${deptId} is not supported`);
  }
  const name: string | undefined = map.get(deptId);
  if (!name) {
    throw new Error(`Department Id ${deptId} does not have a name`);
  }
  return name;
};

const initNameToId = (departments: Department[]): Map<string, string> => {
  let _departmentNameMapper = new Map<string, string>();
  departments.forEach((dept: Department) => {
    _departmentNameMapper.set(dept.name as string, dept._id);
  });
  return _departmentNameMapper;
};

const getDeptIdFromName = (deptName: string, map: Map<string, string>): string => {
  if (!map.has(deptName)) {
    throw new Error(`Department name ${deptName} is not supported`);
  }
  const id: string | undefined = map.get(deptName)?.toString();
  if (!id) {
    throw new Error(`Department name ${deptName} does not have an id`);
  }
  return id;
};

const verifyDeptId = (deptId: string, map: Map<string, string>): boolean => {
  return map.has(deptId);
};

const Departments = { General, initIdToNameMap, initNameToId, getDeptNameFromId, getDeptIdFromName, verifyDeptId };

export default Departments;
