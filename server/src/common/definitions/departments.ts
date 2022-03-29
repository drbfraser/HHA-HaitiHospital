import { number } from "joi";
import { getEnumKeyByStringValue, getLengthOfEnum } from "utils/utils";

enum DepartmentName {
  NicuPaeds = 'NICU/Paeds',
  Maternity = 'Maternity',
  Rehab = 'Rehab',
  CommunityHealth = 'Community & Health'
}

enum DepartmentId {
  Rehab = 0,
  NicuPaeds = 1,
  CommunityHealth = 2,
  Maternity = 3
}

const deptIdtoName = new Map<DepartmentId, DepartmentName>();
const initIdToNameMap = (map: Map<DepartmentId, DepartmentName>) => {
    map.clear();
    map.set(DepartmentId.Rehab, DepartmentName.Rehab);
    map.set(DepartmentId.NicuPaeds, DepartmentName.NicuPaeds);
    map.set(DepartmentId.CommunityHealth, DepartmentName.CommunityHealth);
    map.set(DepartmentId.Maternity, DepartmentName.Maternity);

    const expectedSize = getLengthOfEnum(DepartmentId);
    if (map.size !== expectedSize) {
        throw new Error (`Map size is not as expectation: ${expectedSize}`)
    }
}
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


const deptNameToId = new Map<DepartmentName, DepartmentId>();
const initNameToId = (map: Map<DepartmentName, DepartmentId>) => {
    map.set(DepartmentName.Rehab, DepartmentId.Rehab);
    map.set(DepartmentName.NicuPaeds, DepartmentId.NicuPaeds);
    map.set(DepartmentName.CommunityHealth, DepartmentId.CommunityHealth);
    map.set(DepartmentName.Maternity, DepartmentId.Maternity);

    const expectedSize = getLengthOfEnum(DepartmentName);
    if (map.size !== expectedSize) {
        throw new Error (`Map size is not as expectation: ${expectedSize}`)
    }
}
initNameToId(deptNameToId);
export function getDeptIdFromName(deptName: string): string {
    const nameKey = getEnumKeyByStringValue(DepartmentName, deptName);
    if (!nameKey) {
        throw new Error(`Department name ${deptName} is not supported`);
    }
    const id: string | undefined = deptNameToId.get(DepartmentName[nameKey])?.toString();
    if (!id) {
        throw new Error(`Department name ${deptName} does not have an id`);
    }
    return id;
};

export const verifyDeptId = (deptId: string): boolean => {
    const idKey = getEnumKeyByStringValue(DepartmentId, deptId);
    return (idKey !== null);
}

export const verifyDeptName = (deptName: string): boolean => {
    const nameKey = getEnumKeyByStringValue(DepartmentName, deptName);
    return (nameKey !== null);
}

export interface Departments {
    [id: string]: string
}
export const getAllDepartments = (): Departments => {
    let depts: Departments = {};
    for (let key in DepartmentId) {
        if (isNaN(Number(key))) {
            const deptId: string = DepartmentId[key];
            depts[deptId] = getDeptNameFromId(deptId);
        }
    }

    return depts;
}
// export const getDepartmentIdKeyFromValue = (idValue: string): DepartmentIdKeys | null=> {
//     const key = getEnumKeyByStringValue(DepartmentId, idValue);
//     return key;
// }

