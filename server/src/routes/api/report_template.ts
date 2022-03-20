import { NextFunction, Request, Response, Router } from 'express';
import httpErrorMiddleware from 'middleware/httpErrorHandler';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { Role } from 'models/user';

const router = Router();
export default router;

router.route('/{department-id}').get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            
        } catch (e) {
            next(e);
        }
    },
    httpErrorMiddleware
);