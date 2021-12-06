import { Request, Response, NextFunction } from "express";
import User from '../models/User';
import { getDepartmentName, DepartmentName } from '../models/Departments';
import { Role } from "../models/User";

export const checkIsInRole = (...roles) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res;
    }
    // @ts-ignore
    const reqUserRole = req.user.role;
    const hasRole = roles.find(role => reqUserRole === role)
    if (!hasRole) {
        console.log("User with role " + reqUserRole + "does not have sufficient permissions")
        return res.status(401).json('User is unauthorized with role: ' + reqUserRole);
    }

    return next()
}

export const checkUserIsDepartmentAuthed = async (userId: number, reportDepartmentId: number, userRole: string) => {
    // All roles other than a regular user role are authorized to do any departmental work
    if (userRole != Role.User) {
        return true;
    }

    const user = await User.findById(userId);
    const userDepartment = user.department;
    if (userDepartment === getDepartmentName(reportDepartmentId)) {
        return true;
    }
    
    return false;
}