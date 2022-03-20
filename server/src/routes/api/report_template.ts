import { HTTP_NOCONTENT_CODE, HTTP_OK_CODE, NotFound } from 'exceptions/httpException';
import { NextFunction, Request, Response, Router } from 'express';
import httpErrorMiddleware from 'middleware/httpErrorHandler';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { TemplateCollection } from 'models/report';
import { Role } from 'models/user';

const router = Router();
export default router;

router.route('/').get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let query = TemplateCollection.find();
            const result = await query.exec();
            if (!result.length) {
                res.status(HTTP_NOCONTENT_CODE).json(result);
            }

            res.status(HTTP_OK_CODE).json(result);
        } catch (e) {
            next(e);
        }
    },
    httpErrorMiddleware
);

router.route('/:departmentId').get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deptId = req.params['departmentId'];
            let query = TemplateCollection.findOne({ departmentId: deptId });

            const result = await query.exec();
            if (!result) {
                res.status(HTTP_NOCONTENT_CODE).json({});
            }
            res.status(HTTP_OK_CODE).json(result);
        } catch (e) {
            next(e);
        }
    },
    httpErrorMiddleware
);

// router.route('/').post(
//     requireJwtAuth,
//     roleAuth(Role.Admin, Role.MedicalDirector),
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const bodyStr: string = JSON.stringify(req.body);

//         } catch (e) {
//             next(e);
//         }
//     },
//     httpErrorMiddleware
// )