import { HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, NotFound } from 'exceptions/httpException';
import { NextFunction, Request, Response, Router } from 'express';
import httpErrorMiddleware from 'middleware/httpErrorHandler';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { TemplateCollection, TemplateDocument } from 'models/template';
import { Role } from 'models/user';
import { ReportDescriptor } from 'utils/definitions/report';
import { TemplateReport } from 'utils/definitions/template';
import { jsonStringToReport } from 'utils/json_report_parser/parsers';
import { getTemplate } from 'utils/report/report';
import { formatDateString, generateUuid } from 'utils/utils';

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



router.route('/').post(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bodyStr: string = JSON.stringify(req.body);
            const report: ReportDescriptor = jsonStringToReport(bodyStr);
            report.meta.id = generateUuid();
            report.meta.submittedDate = new Date();
            report.meta.submittedUserId = req.user!["name"];
            const newTemplate: TemplateReport = getTemplate(report);
            const dbDocument: TemplateDocument = {
                id: newTemplate.meta.id,
                departmentId: newTemplate.meta.departmentId,
                submittedDate: formatDateString(newTemplate.meta.submittedDate),
                submittedByUserId: newTemplate.meta.submittedUserId,
                items: newTemplate.items
            }
            const document = new TemplateCollection(dbDocument);
            // await document.save();

            res.status(HTTP_CREATED_CODE).send({
                message: "new template created",
                result: dbDocument
            });
        } catch (e) {
            next(e);
        }
    },
    httpErrorMiddleware
)