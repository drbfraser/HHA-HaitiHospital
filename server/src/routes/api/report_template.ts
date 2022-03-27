import { DepartmentId, getDepartmentName} from 'common/definitions/departments';
import { Conflict, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError } from 'exceptions/httpException';
import { NextFunction, Request, Response, Router } from 'express';
import httpErrorMiddleware from 'middleware/httpErrorHandler';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { TemplateCollection, TemplateDocument } from 'models/template';
import UserModel, { Role } from 'models/user';
import { ReportDescriptor } from 'utils/definitions/report';
import { jsonStringToReport } from 'utils/json_report_parser/parsers';
import { formatDateString, generateUuid } from 'utils/utils';
import { generateReportFromDocument, getTemplateDocumentFromReport } from 'utils/report/template';
import { InvalidInput } from 'exceptions/systemException';

const router = Router();
const USER_ID_FIELD = "username";
export default router;

router.route('/').get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let query = TemplateCollection.find();
            const documents = await query.lean();
            if (!documents.length) {
                res.status(HTTP_NOCONTENT_CODE).json(documents);
            }
            else {
                const reports: ReportDescriptor[] = documents.map((doc) => {
                    const report = generateReportFromDocument(doc);
                    return report;
                });
                const hide = await Promise.all(reports.map((report) => hideUserId(report)));
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
                const temp = await hideUserId(generateReportFromDocument(result));
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

            let newTemplate: TemplateDocument = getTemplateDocumentFromReport(report);
            const result = await attemptToSaveNewTemplate(newTemplate, req);

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

router.route('/').put(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bodyStr: string = JSON.stringify(req.body);
            const report: ReportDescriptor = jsonStringToReport(bodyStr);
            const template: TemplateDocument = getTemplateDocumentFromReport(report);

            const existingDoc = await TemplateCollection.findOne({ id: template.id }).exec();
            let result;
            if (existingDoc) {
                // Update an existing template
                result = await attemptToUpdateTemplate(template, existingDoc, req);
                if (result) {
                    res.status(HTTP_NOCONTENT_CODE).send();
                } else {
                    throw new InternalError("Failed to update a template ");
                }
            } else {
                // Create a new template
                result = await attemptToSaveNewTemplate(template, req);
                if (result) {
                    res.status(HTTP_CREATED_CODE).send({
                        message: `New template for department ${getDepartmentName(template.departmentId)} is created`
                    })
                } else {
                    throw new InternalError("Failed to create a template");
                }
            }
            if (!result) {
                throw new InternalError("Update a template failed");
            }
        
        } catch (e) {
            next(e);
        }
    },
    httpErrorMiddleware
)



// >>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
async function hideUserId(report: ReportDescriptor) {
    // const user = await UserModel.find({"username":report.submittedByUserId}).exec();
    const userId = report.meta.submittedUserId;
    const query = UserModel.findOne({ username : userId });
    const user = await query.exec();
    const hide = report;
    hide.meta.submittedUserId = user.name;

    return hide;
}   

async function attemptToUpdateTemplate(template: TemplateDocument, existingDoc: TemplateDocument & import("mongoose").Document<any, any, TemplateDocument>, req:Request) {
    const submittedDeptId: string = template.departmentId;
    const changeDepartment = existingDoc.departmentId !== submittedDeptId;
    if (changeDepartment) {
        const departmentHasTemplate = await TemplateCollection.exists({ departmentId: submittedDeptId });
        if (departmentHasTemplate) {
            throw new InvalidInput(`Failed to update. Deparment ${getDepartmentName(submittedDeptId)} already has a template`);
        }
    }
    template.submittedDate = formatDateString(new Date());
    template.submittedByUserId = req.user![`${USER_ID_FIELD}`];
    const result = await existingDoc.updateOne(template);
    return result;
}

async function attemptToSaveNewTemplate(newTemplate: TemplateDocument, req: Request) {
    const isIdExist = await TemplateCollection.exists({ id: newTemplate.id });
    if (isIdExist) {
        throw new InternalError("Generated template uuid exists");
    }

    const isDepartmentExist = await TemplateCollection.exists({ departmentId: newTemplate.departmentId });
    if (isDepartmentExist) {
        throw new InvalidInput(`Failed to save. Template for department id ${newTemplate.departmentId} exists`);
    }

    // Add some server generated values, since this creates a new template
    newTemplate.id = generateUuid();
    newTemplate.submittedDate = formatDateString(new Date());
    newTemplate.submittedByUserId = req.user![`${USER_ID_FIELD}`];
    const result = await new TemplateCollection(newTemplate).save();
    return result;
}


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<