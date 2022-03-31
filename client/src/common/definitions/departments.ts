export enum DepartmentName {
  NicuPaeds = 'NICU/Paeds',
  Maternity = 'Maternity',
  Rehab = 'Rehab',
  CommunityHealth = 'Community & Health',
}

export enum DepartmentId {
  Rehab = 0,
  NicuPaeds = 1,
  CommunityHealth = 2,
  Maternity = 3,
}

export type DepartmentNameKeys = keyof typeof DepartmentName;
export type DepartmentIdKeys = keyof typeof DepartmentId;

const getLengthOfEnum = function <T extends { [index: string]: any }>(myEnum: T): number {
  let count = Object.keys(myEnum).filter((key) => isNaN(Number(key))).length;
  return count;
};

const getEnumKeyByStringValue = function <T extends { [index: string]: any }>(
  myEnum: T,
  enumValue: string,
): keyof T | null {
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

  const expectedSize = getLengthOfEnum(DepartmentId);
  if (map.size !== expectedSize) {
    throw new Error(`Map size is not as expectation: ${expectedSize}`);
  }
};
initIdNameMap(deptIdtoName);

export function getDepartmentName(deptId: number): DepartmentName {
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

  const expectedSize = getLengthOfEnum(DepartmentName);
  if (map.size !== expectedSize) {
    throw new Error(`Map size is not as expectation: ${expectedSize}`);
  }
};
initNameToId(deptNameToId);

export function getDepartmentId(deptName: string): DepartmentId {
  const nameKey = getEnumKeyByStringValue(DepartmentName, deptName);
  if (!nameKey) {
    throw new Error(`Deparmtnet Name ${deptName} is not supported`);
  }
  return deptNameToId.get(nameKey)!;
}

export const getDepartmentIdKeyFromValue = (idValue: string): DepartmentIdKeys | null => {
  const key = getEnumKeyByStringValue(DepartmentId, idValue);
  return key;
};

// import { getEnumKeyByStringValue, getLengthOfEnum } from 'utils/utils';

// enum DepartmentName {
//   NicuPaeds = 'NICU/Paeds',
//   Maternity = 'Maternity',
//   Rehab = 'Rehab',
//   CommunityHealth = 'Community & Health',
// }

// enum DepartmentId {
//   Rehab = 0,
//   NicuPaeds = 1,
//   CommunityHealth = 2,
//   Maternity = 3,
// }

// const deptIdtoName = new Map<DepartmentId, DepartmentName>();
// const initIdToNameMap = (map: Map<DepartmentId, DepartmentName>) => {
//   map.clear();
//   map.set(DepartmentId.Rehab, DepartmentName.Rehab);
//   map.set(DepartmentId.NicuPaeds, DepartmentName.NicuPaeds);
//   map.set(DepartmentId.CommunityHealth, DepartmentName.CommunityHealth);
//   map.set(DepartmentId.Maternity, DepartmentName.Maternity);

//   const expectedSize = getLengthOfEnum(DepartmentId);
//   if (map.size !== expectedSize) {
//     throw new Error(`Map size is not as expectation: ${expectedSize}`);
//   }
// };
// initIdToNameMap(deptIdtoName);

// export function getDeptNameFromId(deptId: string): string {
//   const idKey = getEnumKeyByStringValue(DepartmentId, deptId.toString());
//   if (!idKey) {
//     throw new Error(`Department Id ${deptId} is not supported`);
//   }
//   const name: string | undefined = deptIdtoName.get(DepartmentId[idKey])?.toString();
//   if (!name) {
//     throw new Error(`Department Id ${deptId} does not have a name`);
//   }
//   return name;
// }

// const deptNameToId = new Map<DepartmentName, DepartmentId>();
// const initNameToId = (map: Map<DepartmentName, DepartmentId>) => {
//   map.set(DepartmentName.Rehab, DepartmentId.Rehab);
//   map.set(DepartmentName.NicuPaeds, DepartmentId.NicuPaeds);
//   map.set(DepartmentName.CommunityHealth, DepartmentId.CommunityHealth);
//   map.set(DepartmentName.Maternity, DepartmentId.Maternity);

//   const expectedSize = getLengthOfEnum(DepartmentName);
//   if (map.size !== expectedSize) {
//     throw new Error(`Map size is not as expectation: ${expectedSize}`);
//   }
// };
// initNameToId(deptNameToId);

// export function getDeptIdFromName(deptName: string): string {
//   const nameKey = getEnumKeyByStringValue(DepartmentName, deptName);
//   if (!nameKey) {
//     throw new Error(`Department name ${deptName} is not supported`);
//   }
//   const id: string | undefined = deptNameToId.get(DepartmentName[nameKey])?.toString();
//   if (!id) {
//     throw new Error(`Department name ${deptName} does not have an id`);
//   }
//   return id;
// }

// // TO-DO Add function to get all department names and ids
// const getAllDeptId = (): DepartmentId[] => {
//   return Array.from(deptNameToId.values());
// };

// const getAllDeptNames = (): DepartmentName[] => {
//   return Array.from(deptIdtoName.values());
// };

// export function getDeptNamesAndId(): object {
//   const deptNames: DepartmentName[] = getAllDeptNames();
//   return getAllDeptId().map((id: any, index: number) => (id = { id: id, name: deptNames[index] }));
// }

// export const verifyDeptId = (deptId: string): boolean => {
//   const idKey = getEnumKeyByStringValue(DepartmentId, deptId);
//   return idKey !== null;
// };

// export const verifyDeptName = (deptName: string): boolean => {
//   const nameKey = getEnumKeyByStringValue(DepartmentName, deptName);
//   return nameKey !== null;
// };
// // export const getDepartmentIdKeyFromValue = (idValue: string): DepartmentIdKeys | null=> {
// //     const key = getEnumKeyByStringValue(DepartmentId, idValue);
// //     return key;
// // }
