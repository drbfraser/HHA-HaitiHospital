import { NotFound } from 'exceptions/httpException';
import { IllegalState } from 'exceptions/systemException';
import DepartmentCollection, { Department } from 'models/departments';

export enum DefaultDepartments {
  General = 'General',
  Rehab = 'Rehab',
  NICU = 'NICU/Paeds',
  Maternity = 'Maternity',
  Community = 'Community & Health',
  BioMechanic = 'Bio Support',
}

// ***************************************************** Utility functions for hashtable approach *****************************************************

const initIdToNameMap = (departments: Department[]): Map<string, string> => {
  let _departmentIdMapper = new Map<string, string>();
  departments.forEach((dept: Department) => {
    _departmentIdMapper.set(dept._id!, dept.name);
  });
  return _departmentIdMapper;
};

const getDeptNameFromId = (deptId: string, map: Map<string, string>): string => {
  if (!map.has(deptId)) {
    throw new NotFound(`Department Id ${deptId} is not supported`);
  }
  const name: string | undefined = map.get(deptId);
  if (!name) {
    throw new IllegalState(`Department Id ${deptId} does not have a name`);
  }
  return name;
};

const initNameToId = (departments: Department[]): Map<string, string> => {
  let _departmentNameMapper = new Map<string, string>();
  departments.forEach((dept: Department) => {
    _departmentNameMapper.set(dept.name, dept._id!);
  });
  return _departmentNameMapper;
};

const getDeptIdFromName = (deptName: string, map: Map<string, string>): string => {
  if (!map.has(deptName)) {
    throw new NotFound(`Department name ${deptName} is not supported`);
  }
  const id: string | undefined = map.get(deptName)?.toString();
  if (!id) {
    throw new IllegalState(`Department name ${deptName} does not have an id`);
  }
  return id;
};

const verifyDeptId = (deptId: string, map: Map<string, string>): boolean => {
  return map.has(deptId);
};

// ***************************************************** Utility functions for database approach ******************************************************

const getDeptNameById = async (deptId: string): Promise<string> => {
  const department: Department | null = await DepartmentCollection.findById(deptId);
  if (!department) {
    throw new NotFound(`No department with id provided`);
  }
  return department.name;
};

const getDeptIdByName = async (deptName: string): Promise<string> => {
  const department: Department | null = await DepartmentCollection.findOne({ name: deptName });
  if (!department) {
    throw new NotFound(`No department with id provided`);
  }
  return department._id!;
};

const validateDeptId = async (deptId: string): Promise<boolean> => {
  const department: Department | null = await DepartmentCollection.findById(deptId);
  return department !== null;
};

// ****************************************************************************************************************************************************

// Util functions using a hashtable data structure
const Hashtable = {
  initIdToNameMap,
  initNameToId,
  getDeptNameFromId,
  getDeptIdFromName,
  verifyDeptId,
};

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
