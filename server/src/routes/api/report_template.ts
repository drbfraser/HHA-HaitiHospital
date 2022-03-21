import { DepartmentId} from 'common/definitions/departments';
import { Conflict, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { NextFunction, Request, Response, Router } from 'express';
import httpErrorMiddleware from 'middleware/httpErrorHandler';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { TemplateCollection, TemplateDocument } from 'models/template';
import UserModel, { Role } from 'models/user';
import { ReportDescriptor } from 'utils/definitions/report';
import { TemplateReport } from 'utils/definitions/template';
import { jsonStringToReport } from 'utils/json_report_parser/parsers';
import { getTemplate } from 'utils/report/report';
import { formatDateString, generateUuid } from 'utils/utils';

const router = Router();
const USER_ID_FIELD = "username";
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
            else {
                const hide = await Promise.all(result.map((user) => hideUserId(user)));
                res.status(HTTP_OK_CODE).json(hide);
            }
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
            else {
                const temp = hideUserId(result);
                res.status(HTTP_OK_CODE).json(temp);
            }
        } catch (e) {
            next(e);
        }
    },
    httpErrorMiddleware
);
router.route('/:departmentId').delete(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deptId = req.params['departmentId'];
            let query = TemplateCollection.findOneAndDelete({ departmentId: deptId });
            let result = await query.exec();
            if (!result) {
                res.status(HTTP_NOCONTENT_CODE).send();
            } else {
                res.status(HTTP_OK_CODE).send({
                    message: `Template for department with id ${deptId} is removed`
                });
            }
        }
        catch (e) {
            console.log(e);
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

            const newTemplate: TemplateReport = generateNewTemplate(report, req);
            const result = await attemptToSaveTemplate(newTemplate);

            if (result) {
                res.status(HTTP_CREATED_CODE).send({
                    message: "new template created",
                });
            }
            else {
                throw new InternalError("Save to DB failed");
            }
           
        } catch (e) {
            next(e);
        }
    },
    httpErrorMiddleware
)

// >>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
async function hideUserId(report: TemplateDocument) {
    // const user = await UserModel.find({"username":report.submittedByUserId}).exec();
    const userId = report.submittedByUserId;
    const query = UserModel.findOne({ username : userId });
    const user = await query.exec();
    const hide = report;
    hide.submittedByUserId = user.name;

    return hide;
}   

function generateNewTemplate(report: ReportDescriptor, req) {
    // Add some server generated values, since this creates a new template

    report.meta.id = generateUuid();
    report.meta.submittedDate = new Date();
    report.meta.submittedUserId = req.user![`${USER_ID_FIELD}`];
    const newTemplate: TemplateReport = getTemplate(report);
    return newTemplate;
}

async function attemptToSaveTemplate(newTemplate: TemplateReport) {
    const isIdExist = await TemplateCollection.exists({ id: newTemplate.meta.id });
    if (isIdExist) {
        throw new InternalError("Generated template uuid exists");
    }

    const isDepartmentExist = await TemplateCollection.exists({ departmentId: DepartmentId[newTemplate.meta.departmentId].toString() });
    if (isDepartmentExist) {
        throw new Conflict(`Template for department id ${newTemplate.meta.departmentId} exists`);
    }

    const dbDocument: TemplateDocument = {
        id: newTemplate.meta.id,
        departmentId: DepartmentId[newTemplate.meta.departmentId].toString(),
        submittedDate: formatDateString(newTemplate.meta.submittedDate),
        submittedByUserId: newTemplate.meta.submittedUserId,
        items: newTemplate.items
    };
    const document = new TemplateCollection(dbDocument);
    const result = await document.save();
    return result;
}


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<