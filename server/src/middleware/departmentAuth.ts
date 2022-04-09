import { RequestWithUser } from 'utils/definitions/express';
import { Response, NextFunction } from 'express';
import { verifyDeptId } from 'utils/departments';
import { InvalidInput } from 'exceptions/systemException';
import { Unauthorized } from 'exceptions/httpException';
import { DEPARTMENT_ID_URL_SLUG } from 'utils/constants';
import { checkUserIsDepartmentAuthed } from 'utils/authUtils';

type Middleware = (req: RequestWithUser, res: Response, next: NextFunction) => void | Promise<void>;

// This middleware requires department id slug in url
export const departmentAuth: Middleware = (req: RequestWithUser, res: Response, next: NextFunction) => {

        const deptId = req.params[DEPARTMENT_ID_URL_SLUG];
        const valid = verifyDeptId(deptId);
        if (!valid) {
            return next(new InvalidInput(`Department Id ${deptId} is not valid`));
        }

        const authorized = checkUserIsDepartmentAuthed(req.user, deptId);
        if (authorized) {
            return next();
        }
        next(new Unauthorized(`User does not have access to this department`));
}