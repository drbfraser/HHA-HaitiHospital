import { NextFunction, Request, Response } from "express"
import { InternalError, UnauthorizedError, UnprocessableEntityError } from "../exceptions/httpException";
import { DepartmentId, DepartmentName, getDepartmentId } from "../models/departments"
import { Role } from "../models/user"

type UserPrivilegeInfo = {
    role : Role,
    department: DepartmentName
};

// expects a departmentId params in the URL
export const departmentAuth = 
    (req: Request, res: Response, next: NextFunction) => {
    
    const deptIdParam = req.params.departmentId;
    if (deptIdParam == undefined) {
        const internalError = new InternalError("Endpoint does not require department privilege");
        next(internalError);
    }

    const departmentIds = [parseInt(deptIdParam)];

    const userPrivilege = req.user as UserPrivilegeInfo;
    const ROLES_BYPASS_DEPARTMENT = [Role.Admin, Role.MedicalDirector];
    const noDepartmentCheck = ROLES_BYPASS_DEPARTMENT.includes(userPrivilege.role);
    if (noDepartmentCheck) {
        next();
    }

    if (userPrivilege.department === undefined) {
        const missingInfoError = new UnprocessableEntityError("Missing user department info");
        next(missingInfoError);
    }

    const userDeptId = getDepartmentId(userPrivilege.department);
    const inDepartment = departmentIds.includes(userDeptId);

    if (inDepartment === false) {
        const noPermissionerror = new UnauthorizedError(`User does not have access to department information`);
        next(noPermissionerror);
    }

    next();
}