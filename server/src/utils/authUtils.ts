import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';
import { DepartmentName, getDeptNameFromId } from '../common/definitions/departments';
import { Role, User } from '../models/user';

export const checkIsInRole =
  (...roles) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res;
    }
    // @ts-ignore
    const reqUserRole = req.user.role;
    const hasRole = roles.find((role) => reqUserRole === role);
    if (!hasRole) {
      console.log('User with role ' + reqUserRole + 'does not have sufficient permissions');
      return res.status(401).json('User is unauthorized with role: ' + reqUserRole);
    }

    return next();
  };

export const checkUserIsDepartmentAuthed = async (userId: string, reportDepartmentId: number, userRole: string) => {
  // All roles other than a regular user role are authorized to do any departmental work
  if (userRole != Role.User) {
    return true;
  }
  console.log(userId);
  const user: User = await UserModel.findById(userId);
  console.log(user);

  const userDepartment = user.departmentId;
  console.log(userDepartment, getDeptNameFromId(reportDepartmentId));

  if (userDepartment === getDeptNameFromId(reportDepartmentId)) {
    return true;
  }

  return false;
};
