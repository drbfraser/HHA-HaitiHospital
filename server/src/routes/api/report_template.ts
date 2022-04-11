import { getDeptNameFromId, verifyDeptId} from 'utils/departments';
import { BadRequest, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, NotFound } from 'exceptions/httpException';
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
        attemptToSaveTemplate(newTemplate, (err) => {
            if (!err) {
                return res.sendStatus(HTTP_CREATED_CODE);
            }
            err.message = `Failed to save template: ${err.message}`
            return next(err);
        });

    } catch(e) { next(e); }
    }
);

// Replace template by id
router.route(`/:${TEMPLATE_ID_URL_SLUG}`).put(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const jsonReport: JsonReportDescriptor = req.body;
        const bodyStr: string = JSON.stringify(jsonReport);
        const report: ReportDescriptor = jsonStringToReport(bodyStr);
        report.id = req.params[TEMPLATE_ID_URL_SLUG]
        updateSubmissionDate(report);
        setSubmittor(report, req.user);

        const template: Template = fromReportToTemplate(report);
        await attemptToUpdateTemplate(template, (err) => {
            if (!err) {
                return res.sendStatus(HTTP_OK_CODE);
            }
            err.message = `Failed to update template: ${err.message}`
            return next(err);
        });

    } catch (e) { next(e); }
    }
);

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

async function attemptToUpdateTemplate(template: Template, callback: (err?: CustomError) => void) {
    // Delete and save new to trigger validators
    const oldDoc = await TemplateCollection.findOneAndRemove({id: template.id}, {lean: true});
    if (!oldDoc) {
        throw new NotFound(`No template with id ${template.id}`);
    }

    attemptToSaveTemplate(template, (newTemplateError?: CustomError) => {
        if (!newTemplateError)
            return callback();
        
        // Recover old template
        attemptToSaveTemplate(oldDoc, (oldTemplateError?: CustomError) => {
            if (!oldTemplateError) {
                return callback(newTemplateError);
            }
            callback(oldTemplateError);
        });
    });
}

function attemptToSaveTemplate(newTemplate: Template, callback: (err?: CustomError) => void) {
    const doc = new TemplateCollection(newTemplate);
    doc.save((err: CallbackError) => {
        if (!err) {
            return callback();
        }

        const myError: CustomError = mongooseErrorToMyError(err);
        callback(myError);
    });
}
