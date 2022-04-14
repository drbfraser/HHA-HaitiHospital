import { getEnumKeyByStringValue, getLengthOfEnum } from 'utils/utils';

export enum DepartmentName {
  NicuPaeds = 'NICU/Paeds',
  Maternity = 'Maternity',
  Rehab = 'Rehab',
  CommunityHealth = 'Community & Health',
  General = 'General'
}

export enum DepartmentId {
  Rehab = '1',
  NicuPaeds = '2',
  CommunityHealth = '3',
  Maternity = '4',
  General = '0'
}

export const GENERAL_DEPARTMENT_ID = DepartmentId.General;

const deptIdtoName = new Map<DepartmentId, DepartmentName>();
const initIdToNameMap = (map: Map<DepartmentId, DepartmentName>) => {
  map.clear();
  map.set(DepartmentId.Rehab, DepartmentName.Rehab);
  map.set(DepartmentId.NicuPaeds, DepartmentName.NicuPaeds);
  map.set(DepartmentId.CommunityHealth, DepartmentName.CommunityHealth);
  map.set(DepartmentId.Maternity, DepartmentName.Maternity);
  map.set(DepartmentId.General, DepartmentName.General);

  const expectedSize = getLengthOfEnum(DepartmentId);
  if (map.size !== expectedSize) {
    throw new Error(`Map size is not as expectation: ${expectedSize}`);
  }
};

initIdToNameMap(deptIdtoName);

export function getDeptNameFromId(deptId: string): string {
  const idKey = getEnumKeyByStringValue(DepartmentId, deptId.toString());
  if (!idKey) {
    throw new Error(`Department Id ${deptId} is not supported`);
  }
  const name: string | undefined = deptIdtoName.get(DepartmentId[idKey])?.toString();
  if (!name) {
    throw new Error(`Department Id ${deptId} does not have a name`);
  }
  return name;
}

export const verifyDeptId = (deptId: string): boolean => {
  const idKey = getEnumKeyByStringValue(DepartmentId, deptId);
  return idKey !== null;
};
