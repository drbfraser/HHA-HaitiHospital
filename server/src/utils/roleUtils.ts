import { Request, Response, NextFunction } from "express";

export const ROLES = {
    Admin: 'ADMIN',
    User: 'USER',
    MedicalDirector: 'MED_DIR',
    HeadOfDepartment: 'DEPT_HEAD',

}

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