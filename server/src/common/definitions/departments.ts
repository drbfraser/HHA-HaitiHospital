export enum DepartmentName {
  General = 'General',
  Rehab = 'Rehab',
  NicuPaeds = 'NICU/Paeds',
  CommunityHealth = 'Community & Health',
  Maternity = 'Maternity'
}

export enum DepartmentId {
  General = 0,
  Rehab = 1,
  NicuPaeds = 2,
  CommunityHealth = 3,
  Maternity = 4
}

export type DepartmentNameKeys = keyof typeof DepartmentName;
export type DepartmentIdKeys = keyof typeof DepartmentId;

const getLengthOfEnum = function <T extends { [index: string]: any }>(myEnum: T): number {
  let count = Object.keys(myEnum).filter((key) => isNaN(Number(key))).length;
  return count;
};

const getEnumKeyByStringValue = function <T extends { [index: string]: any }>(myEnum: T, enumValue: string): keyof T | null {
  let keys = Object.keys(myEnum).filter((x) => myEnum[x].toString() === enumValue);
  return keys.length > 0 ? keys[0] : null;
};

const deptIdtoName = new Map<DepartmentIdKeys, DepartmentName>();
const initIdNameMap = (map: Map<DepartmentIdKeys, DepartmentName>) => {
  map.clear();
  map.set('Rehab', DepartmentName.Rehab);
  map.set('NicuPaeds', DepartmentName.NicuPaeds);
  map.set('CommunityHealth', DepartmentName.CommunityHealth);
  map.set('Maternity', DepartmentName.Maternity);
  map.set('General', DepartmentName.General);

  const expectedSize = getLengthOfEnum(DepartmentId);
  if (map.size !== expectedSize) {
    throw new Error(`Map size is not as expectation: ${expectedSize}`);
  }
};
initIdNameMap(deptIdtoName);

export function getDepartmentName(deptId: number | String): DepartmentName {
  const idKey = getEnumKeyByStringValue(DepartmentId, deptId.toString());
  if (!idKey) {
    throw new Error(`Department Id ${deptId} is not supported`);
  }
  return deptIdtoName.get(idKey)!;
}

const deptNameToId = new Map<DepartmentNameKeys, DepartmentId>();
const initNameToId = (map: Map<DepartmentNameKeys, DepartmentId>) => {
  map.set('Rehab', DepartmentId.Rehab);
  map.set('NicuPaeds', DepartmentId.NicuPaeds);
  map.set('CommunityHealth', DepartmentId.CommunityHealth);
  map.set('Maternity', DepartmentId.Maternity);
  map.set('General', DepartmentId.General);

  const expectedSize = getLengthOfEnum(DepartmentName);
  if (map.size !== expectedSize) {
    throw new Error(`Map size is not as expectation: ${expectedSize}`);
  }
};
initNameToId(deptNameToId);

export function getDepartmentId(deptName: string): DepartmentId {
  const nameKey = getEnumKeyByStringValue(DepartmentName, deptName);
  if (!nameKey) {
    throw new Error(`Department Name ${deptName} is not supported`);
  }
  return deptNameToId.get(nameKey)!;
}

export const getDepartmentIdKeyFromValue = (idValue: string): DepartmentIdKeys | null => {
  const key = getEnumKeyByStringValue(DepartmentId, idValue);
  return key;
};
