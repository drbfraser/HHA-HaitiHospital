import { getDeptNameFromId, verifyDeptId} from 'common/definitions/departments';
import { BadRequest, Conflict, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { NextFunction, Response, Router } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { TemplateCollection, TemplateDocument } from 'models/template';
import { Role, User, UserJson } from 'models/user';
import { ReportDescriptor } from 'utils/definitions/report';
import { jsonStringToReport } from 'utils/json_report_parser/parsers';
import { formatDateString, generateUuid } from 'utils/utils';
import { generateReportFromDocument, getTemplateDocumentFromReport } from 'utils/report/template';
import { RequestWithUser } from 'utils/definitions/express';

const router = Router();
export default router;

router.route('/').get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        let query = TemplateCollection.find();
        const documents = await query.lean();
        const reports: ReportDescriptor[] = documents.map((doc) => {
            const report = generateReportFromDocument(doc);
            return report;
        });
        res.status(HTTP_OK_CODE).json(reports);
    }
);

const DEPARTMENT_ID_URL_PARAM = 'departmentId';
router.route(`/:${DEPARTMENT_ID_URL_PARAM}`).get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const deptId = req.params[DEPARTMENT_ID_URL_PARAM];
        if (!verifyDeptId(deptId)) {
            throw new BadRequest(`Invalid department id ${deptId}`);
        }

        const template = await TemplateCollection.findOne({ departmentId: deptId });
        if (!template) {
            throw new NotFound(`No template for department ${getDeptNameFromId(deptId)} found`);
        }

        res.status(HTTP_OK_CODE).json(template);
    }
);

router.route(`/:${DEPARTMENT_ID_URL_PARAM}`).delete(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const deptId = req.params[DEPARTMENT_ID_URL_PARAM];
        if (!verifyDeptId) {
            throw new BadRequest(`Invalid department id ${deptId}`);
        }

        const template = await TemplateCollection.findOneAndDelete({ departmentId: deptId });
        if (!template) {
            throw new NotFound(`No template for department ${getDeptNameFromId(deptId)} found`);
        }

        res.status(HTTP_NOCONTENT_CODE);
    }
);

router.route('/').post(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const bodyStr: string = JSON.stringify(req.body);
        const report: ReportDescriptor = jsonStringToReport(bodyStr);

        let newTemplate: TemplateDocument = getTemplateDocumentFromReport(report);
        const submittedUser = req.user;
        await attemptToSaveNewTemplate(newTemplate, submittedUser);
        res.status(HTTP_CREATED_CODE).send(`New template for department ${getDeptNameFromId(newTemplate.departmentId)}`);
    }
)

router.route('/').put(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const bodyStr: string = JSON.stringify(req.body);
        const report: ReportDescriptor = jsonStringToReport(bodyStr);
        const template: TemplateDocument = getTemplateDocumentFromReport(report);

        const existingDoc = await TemplateCollection.findOne({ id: template.id }).exec();
        const submittedUser = req.user;
        if (existingDoc) {
            // Update an existing template
            await attemptToUpdateTemplate(template, existingDoc, submittedUser);
            res.status(HTTP_NOCONTENT_CODE).send();
        } else {
            // Create a new template
            await attemptToSaveNewTemplate(template, submittedUser);
            res.status(HTTP_CREATED_CODE).send(`New template for department ${getDeptNameFromId(template.departmentId)} is created`);
        }   
    }
)

// >>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// To replace user id with username (may be desired in the future)
// async function hideUserId(report: ReportDescriptor) {
//     // const user = await UserModel.find({"username":report.submittedByUserId}).exec();
//     const userId = report.meta.submittedUserId;
//     const query = UserModel.findOne({ username : userId });
//     const user = await query.exec();
//     const hide = report;
//     hide.meta.submittedUserId = user.name;

//     return hide;
// }   

async function attemptToUpdateTemplate(template: TemplateDocument, existingDoc: TemplateDocument & import("mongoose").Document<any, any, TemplateDocument>, submittedUser: UserJson) {
    const submittedDeptId: string = template.departmentId;
    const changeDepartment = existingDoc.departmentId !== submittedDeptId;
    if (changeDepartment) {
        const departmentHasTemplate = await TemplateCollection.exists({ departmentId: submittedDeptId });
        if (departmentHasTemplate) {
            throw new Conflict(`Failed to update. Deparment ${getDeptNameFromId(submittedDeptId)} already has a template`);
        }
    }
    template.submittedDate = formatDateString(new Date());
    template.submittedByUserId = submittedUser.id;

    const result = await existingDoc.updateOne(template);
    if (!result) {
        throw new InternalError(`Failed to update template with id ${template.id}`);
    }
}

async function attemptToSaveNewTemplate(newTemplate: TemplateDocument, submittedUser: UserJson) {
    // Add some server generated values, since this creates a new template
    newTemplate.id = generateUuid();
    newTemplate.submittedDate = formatDateString(new Date());
    newTemplate.submittedByUserId = submittedUser.id;

    const isIdExist = await TemplateCollection.exists({ id: newTemplate.id });
    if (isIdExist) {
        throw new InternalError("Generated template uuid exists");
    }

    const isDepartmentExist = await TemplateCollection.exists({ departmentId: newTemplate.departmentId });
    if (isDepartmentExist) {
        throw new Conflict(`Failed to save. Template for department id ${newTemplate.departmentId} exists`);
    }

    const result = await new TemplateCollection(newTemplate).save();
    if (!result) {
        throw new InternalError(`Failed to save template with id ${newTemplate.id}`)
    }
}


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<