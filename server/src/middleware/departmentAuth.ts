import { RequestWithUser } from 'utils/definitions/express';
import { Response, NextFunction } from 'express';
import { InvalidInput } from 'exceptions/systemException';
import { Unauthorized } from 'exceptions/httpException';
import { DEPARTMENT_ID_URL_SLUG } from 'utils/constants';
import { checkUserCanViewReport } from 'utils/authUtils';
import Departments from 'utils/departments';
import type { Middleware } from 'utils/definitions/middleware';

// This middleware requires department id slug in url
export const departmentAuth: Middleware = async (
  req: RequestWithUser,
  _: Response,
  next: NextFunction,
) => {
  const deptId = req.params[DEPARTMENT_ID_URL_SLUG];
  const valid = await Departments.Database.validateDeptId(deptId);
  if (!valid) {
    return next(new InvalidInput(`Department Id ${deptId} is not valid`));
  }

  const authorized = checkUserCanViewReport(req.user, deptId);
  if (authorized) {
    return next();
  }
  next(new Unauthorized(`User does not have access to this department`));
};
