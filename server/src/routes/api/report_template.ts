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
import { CallbackError, Error } from 'mongoose';
import { MONGOOSE_VALIDATOR_ERROR_NAME } from 'utils/constants';
import { CustomError } from 'exceptions/custom_exception';

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
                return res.status(HTTP_CREATED_CODE).send(`New template for department ${getDeptNameFromId(newTemplate.departmentId)}`);
            };
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

        const existingDoc = await TemplateCollection.findOne({ id: req.params[TEMPLATE_ID_SLUG] });
        if (existingDoc) {
            // Update an existing template
            await attemptToUpdateTemplate(template, existingDoc);
            res.status(HTTP_NOCONTENT_CODE).send();
        } else {
            // Create a new template
            attemptToSaveNewTemplate(template, (err) => {
                if (!err) {
                    return res.status(HTTP_CREATED_CODE).send(`New template for department ${getDeptNameFromId(template.departmentId)} is created`);
                };

                return next(err);
            });
        }   

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

async function attemptToUpdateTemplate(template: TemplateBase, existingDoc: TemplateBase & import("mongoose").Document<any, any, TemplateBase>) {
    const submittedDeptId: string = template.departmentId;
    const isDeptChanged = existingDoc.departmentId !== submittedDeptId;
    if (isDeptChanged) {
        const newDeptHasTemplate = await TemplateCollection.exists({ departmentId: submittedDeptId });
        if (newDeptHasTemplate) {
            throw new Conflict(`Failed to update. Deparment ${getDeptNameFromId(submittedDeptId)} already has a template`);
        }
    }
    
    delete template.id;
    const result = await existingDoc.updateOne(template);
    if (!result) {
        throw new InternalError(`Failed to update template with id ${template.id}`);
    }
}

function attemptToSaveNewTemplate(newTemplate: TemplateBase, callback: (err?: CustomError) => void) {
    const doc = new TemplateCollection(newTemplate);
    doc.save((err: CallbackError) => {
        if (!err) {
            return callback();
        }
        if (err.name === MONGOOSE_VALIDATOR_ERROR_NAME) {
            const castErr = (err as Error.ValidationError);
            let msg = "";
            for (let field in castErr.errors) {
                msg += castErr.errors[field].message + '\n';
            }
            return callback(new BadRequest(msg));
        } else {
            return callback(new InternalError(err.message));
        }
    });
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<