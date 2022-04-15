import Department, { Department as DepartmentModel } from 'models/departments';

export enum DefaultDepartments {
  General = 'General',
  Rehab = 'Rehab',
  NICU = 'NICU/Paeds',
  Maternity = 'Maternity',
  Community = 'Community & Health'
}

// ***************************************************** Utility functions for hashtable approach *****************************************************

const initIdToNameMap = (departments: DepartmentModel[]): Map<string, string> => {
  let _departmentIdMapper = new Map<string, string>();
  departments.forEach((dept: DepartmentModel) => {
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

const initNameToId = (departments: DepartmentModel[]): Map<string, string> => {
  let _departmentNameMapper = new Map<string, string>();
  departments.forEach((dept: DepartmentModel) => {
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

// ***************************************************** Utility functions for database approach ******************************************************

const getDeptNameById = async (deptId: string): Promise<string> => {
  try {
    const department: DepartmentModel = (await Department.findById(deptId)) as DepartmentModel;
    if (Object.keys(department).length === 0) throw new Error(`Department Id ${deptId} does not have a name`);
    return department.name;
  } catch (error: any) {
    return 'Error: Unable to retrieve department name';
  }
};

const getDeptIdByName = async (deptName: string): Promise<string> => {
  try {
    const department: DepartmentModel = (await Department.findOne({ name: deptName })) as DepartmentModel;
    if (Object.keys(department).length === 0) throw new Error(`Department name ${deptName} does not have an id`);
    return department._id;
  } catch (error: any) {
    return 'Error: Unable to retrieve department id';
  }
};

const validateDeptId = async (deptId: string): Promise<boolean> => {
  const department: DepartmentModel = (await Department.findById(deptId)) as DepartmentModel;
  return !(Object.keys(department).length === 0);
};

// ****************************************************************************************************************************************************

// Util functions using a hashtable data structure
const Hashtable = { initIdToNameMap, initNameToId, getDeptNameFromId, getDeptIdFromName, verifyDeptId };

// Util functions from database calls
const Database = { getDeptNameById, getDeptIdByName, validateDeptId };

/**
 * @param Hashtable
 * - Util functions using a hashtable data structure
 * @param Database
 * - Util functions from database calls
 */
const Departments = { Hashtable, Database };

export default Departments;
