import { DepartmentName, DepartmentId } from "../definitions/departments";

export function getDepartmentName(deptId: number): DepartmentName {
    switch (deptId) {
        case DepartmentId.Rehab:
            return DepartmentName.Rehab;
        case DepartmentId.NicuPaeds:
            return DepartmentName.NicuPaeds;
        case DepartmentId.CommunityHealth:
            return DepartmentName.CommunityHealth;
        case DepartmentId.Maternity:
            return DepartmentName.Maternity;
        default:
            throw new Error('Invalid department id');
    }
}

export function getDepartmentId(deptName: string): DepartmentId {
    switch (deptName) {
        case DepartmentName.NicuPaeds:
            return DepartmentId.NicuPaeds;
        case DepartmentName.Maternity:
            return DepartmentId.Maternity;
        case DepartmentName.Rehab:
            return DepartmentId.Rehab;
        case DepartmentName.CommunityHealth:
            return DepartmentId.CommunityHealth;
        default:
            throw new Error("Invalid department name");
    }
}
