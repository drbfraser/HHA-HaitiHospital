import { getDeptNameFromId, verifyDeptId} from 'utils/departments';
import { BadRequest, Conflict, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { NextFunction, Response, Router } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { TemplateCollection, Template } from 'models/template';
import { Role } from 'models/user';
import { ReportDescriptor } from 'utils/definitions/report';
import { jsonStringToReport } from 'utils/parsers/parsers';
import { generateNewTemplate, fromReportToTemplate } from 'utils/parsers/template';
import { RequestWithUser } from 'utils/definitions/express';
import { JsonReportDescriptor } from 'common/json_report';
import { CallbackError } from 'mongoose';
import { CustomError } from 'exceptions/custom_exception';
import { SystemException } from 'exceptions/systemException';
import { mongooseErrorToMyError } from 'utils/utils';
import { DEPARTMENT_ID_URL_SLUG, TEMPLATE_ID_URL_SLUG } from 'utils/constants';
import { updateSubmissionDate, setSubmittor } from 'utils/report/report';

const router = Router();
export default router;

router.route('/').get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

        const documents = await TemplateCollection.find();
        const jsonReports = documents.map((doc) => doc.toJsonReport());
        res.status(HTTP_OK_CODE).json(jsonReports);

    } catch (e) { next(e); }
    }
);

router.route(`/:${DEPARTMENT_ID_URL_SLUG}`).get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

        const deptId = req.params[DEPARTMENT_ID_URL_SLUG];
        if (!verifyDeptId(deptId)) {
            throw new BadRequest(`Invalid department id ${deptId}`);
        }
        const template = await TemplateCollection.findOne({ departmentId: deptId });
        if (!template) {
            throw new NotFound(`No template for department ${getDeptNameFromId(deptId)} found`);
        }
        const jsonReport: JsonReportDescriptor = template.toJsonReport();
        res.status(HTTP_OK_CODE).json(jsonReport);

    } catch (e) { next(e); } 
    }
);

router.route(`/:${DEPARTMENT_ID_URL_SLUG}`).delete(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const deptId = req.params[DEPARTMENT_ID_URL_SLUG];
        if (!verifyDeptId(deptId)) {
            throw new BadRequest(`Invalid department id ${deptId}`);
        }

        const template = await TemplateCollection.findOneAndDelete({ departmentId: deptId });
        if (!template) {
            throw new NotFound(`No template for department ${getDeptNameFromId(deptId)} found`);
        }
        res.sendStatus(HTTP_NOCONTENT_CODE);

    } catch (e) { next(e); }
    }
);

router.route('/').post(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const jsonReport: JsonReportDescriptor = req.body;
        const bodyStr: string = JSON.stringify(jsonReport);
        const report: ReportDescriptor = jsonStringToReport(bodyStr);
        updateSubmissionDate(report);
        setSubmittor(report, req.user);
        
        let newTemplate: Template = generateNewTemplate(report);
        attemptToSaveNewTemplate(newTemplate, (err) => {
            if (!err) {
                return res.sendStatus(HTTP_CREATED_CODE);
            }
            return next(err);
        });

    } catch(e) { next(e); }
    }
);

router.route(`/:${TEMPLATE_ID_URL_SLUG}`).put(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const jsonReport: JsonReportDescriptor = req.body;
        const bodyStr: string = JSON.stringify(jsonReport);
        const report: ReportDescriptor = jsonStringToReport(bodyStr);
        updateSubmissionDate(report);
        setSubmittor(report, req.user);

        const template: Template = fromReportToTemplate(report);
        if (template.id !== req.params[TEMPLATE_ID_URL_SLUG]) {
            throw new BadRequest(`Expected id and provided id don't match`);
        }

        await attemptToUpdateTemplate(template);
        res.sendStatus(HTTP_NOCONTENT_CODE);

    } catch (e) { next(e); }
    }
);

// >>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// To replace user id with name (may be desired in the future)
// async function hideUserId(report: ReportDescriptor) {
//     // const user = await UserModel.find({"username":report.submittedByUserId}).exec();
//     const userId = report.meta.submittedUserId;
//     const query = UserModel.findOne({ username : userId });
//     const user = await query.exec();
//     const hide = report;
//     hide.meta.submittedUserId = user.name;
//     return hide;
// }   

async function attemptToUpdateTemplate(template: Template) {
    const templateId = template.id;
    const doc = await TemplateCollection.findOne({id: templateId});
    if (!doc) {
        throw new NotFound(`No template with id ${templateId}`);
    }

    if (doc.departmentId !== template.departmentId) {
        const existed = await TemplateCollection.exists({departmentId: template.departmentId});
        if (existed) {
            throw new Conflict(`Template for department id ${template.departmentId} is existed`);
        }
    }
    
    await doc.updateOne(template);
}

function attemptToSaveNewTemplate(newTemplate: Template, callback: (err?: CustomError) => void) {
    const doc = new TemplateCollection(newTemplate);
    doc.save((err: CallbackError) => {
        if (!err) {
            return callback();
        }

        const myError: CustomError = mongooseErrorToMyError(err);
        myError.message = `Attempt to save new template: ${myError.message}`;
        callback(myError);
    });
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<