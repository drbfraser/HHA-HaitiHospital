import { Request, Response, NextFunction } from 'express';
import { Unauthorized } from '../exceptions/httpException';
import { Role } from '../models/user';

type UserPrivilegeInfo = {
  role: Role;
};
// what is ... in javascript?
//
export const roleAuth =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new Unauthorized('User are not logged in'));
    }

    const userInfo = req.user as UserPrivilegeInfo;
    const reqUserRole = userInfo.role;
    const hasPermission = roles.includes(reqUserRole);
    if (!hasPermission) {
      return next(new Unauthorized(`User with role ${reqUserRole} is not privileged`));
    }

    next();
  };
