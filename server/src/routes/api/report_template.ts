import { getDeptNameFromId, verifyDeptId} from 'utils/departments';
import { BadRequest, Conflict, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { NextFunction, Response, Router } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { TemplateCollection, TemplateBase } from 'models/template';
import { Role } from 'models/user';
import { ReportDescriptor } from 'utils/definitions/report';
import { jsonStringToReport } from 'utils/parsers/parsers';
import { getNewTemplateFromSubmittedReport } from 'utils/parsers/template';
import { RequestWithUser } from 'utils/definitions/express';
import { JsonReportDescriptor } from 'common/json_report';
import { CallbackError, Error, QueryOptions } from 'mongoose';
import { MONGOOSE_VALIDATOR_ERROR_NAME, MONGOOSE_NO_DOCUMENT_ERROR_NAME } from 'utils/constants';
import { CustomError } from 'exceptions/custom_exception';
import { SystemException } from 'exceptions/systemException';
import { mongooseErrorToMyError } from 'utils/utils';

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

const DEPARTMENT_ID_URL_PARAM = 'departmentId';
router.route(`/:${DEPARTMENT_ID_URL_PARAM}`).get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

        const deptId = req.params[DEPARTMENT_ID_URL_PARAM];
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

router.route(`/:${DEPARTMENT_ID_URL_PARAM}`).delete(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

        const deptId = req.params[DEPARTMENT_ID_URL_PARAM];
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
        if (!jsonReport.meta.submittedUserId) {
            report.meta.submittedUserId = req.user._id!;
        }
        
        let newTemplate: TemplateBase = getNewTemplateFromSubmittedReport(report);
        attemptToSaveNewTemplate(newTemplate, (err) => {
            if (!err) {
                return res.sendStatus(HTTP_CREATED_CODE);
            }
            return next(err);
        });

    } catch(e) { next(e); }
    }
);

const TEMPLATE_ID_SLUG: string = "templateId";
router.route(`/:${TEMPLATE_ID_SLUG}`).put(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const jsonReport: JsonReportDescriptor = req.body;
        const bodyStr: string = JSON.stringify(jsonReport);
        const report: ReportDescriptor = jsonStringToReport(bodyStr);
        if (!jsonReport.meta.submittedUserId) {
            report.meta.submittedUserId = req.user._id!;
        }
        const template: TemplateBase = getNewTemplateFromSubmittedReport(report);
        template.id = req.params[TEMPLATE_ID_SLUG];

        await attemptToUpdateTemplateWithId(template);
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

async function attemptToUpdateTemplateWithId(template: TemplateBase) {
    if (!template.id) {
        throw new SystemException(`Expecting an id for template but got undefined`);
    }   

    // remove info not to be updated so model validators can pass
    const templateId = template.id;
    delete template.id;
    const doc = await TemplateCollection.findOne({id: templateId});
    if (!doc) {
        throw new BadRequest(`No template with id ${templateId}`);
    }

    if (doc.departmentId !== template.departmentId) {
        const existed = await TemplateCollection.exists({departmentId: template.departmentId});
        if (existed) {
            throw new Conflict(`Template for department id ${template.departmentId} is existed`);
        }
    }
    
    const result = await doc.updateOne(template);
    if (!result) {
        throw new InternalError(`Failed to update template`);
    }
}

function attemptToSaveNewTemplate(newTemplate: TemplateBase, callback: (err?: CustomError) => void) {
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