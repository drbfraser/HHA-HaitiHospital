import { Request, Response, NextFunction } from 'express';
import { Unauthorized } from '../exceptions/httpException';
import { Role } from '../models/user';

type UserPrivilegeInfo = {
  role: Role;
};

export const roleAuth =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new Unauthorized('User are not logged in');
    }

    const userInfo = req.user as UserPrivilegeInfo;
    const reqUserRole = userInfo.role;
    const hasPermission = roles.includes(reqUserRole);
    if (!hasPermission) {
      //   console.log('User with role ' + reqUserRole + 'does not have sufficient permissions');
      throw new Unauthorized(`User with role ${reqUserRole} is not privileged`);
    }

    next();
  };
