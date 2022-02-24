import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../exceptions/httpException';
import { Role } from '../models/user';

type UserPrivilegeInfo = {
    role: Role,
};

export const roleAuth =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    
    if (!req.user) {
      const error = new UnauthorizedError("User are not logged in");
      next(error);
    }

    const userInfo = req.user as UserPrivilegeInfo;
    const reqUserRole = userInfo.role;
    const hasPermission = roles.includes(reqUserRole);
    if (!hasPermission) {
    //   console.log('User with role ' + reqUserRole + 'does not have sufficient permissions');
      const error = new UnauthorizedError(`User with role ${reqUserRole} is unauthorized`);
      next(error);
    }

    next();
};
