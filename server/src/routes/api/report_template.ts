import Departments from 'utils/departments';
import { BadRequest, Conflict, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { NextFunction, Response, Router } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { TemplateCollection, TemplateBase } from 'models/template';
import { Role, User } from 'models/user';
import { ReportDescriptor } from 'utils/definitions/report';
import { jsonStringToReport } from 'utils/parsers/parsers';
import { generateUuid } from 'utils/utils';
import { getTemplateDocumentFromReport } from 'utils/parsers/template';
import { RequestWithUser } from 'utils/definitions/express';
import { JsonReportDescriptor } from 'common/json_report';

const router = Router();
export default router;

router.route('/').get(requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const documents = await TemplateCollection.find();
    const jsonReports = documents.map((doc) => doc.toJsonReport());
    res.status(HTTP_OK_CODE).json(jsonReports);
  } catch (e) {
    next(e);
  }
});

const DEPARTMENT_ID_URL_PARAM = 'departmentId';
router.route(`/:${DEPARTMENT_ID_URL_PARAM}`).get(requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const deptId = req.params[DEPARTMENT_ID_URL_PARAM];
    if (!Departments.Database.validateDeptId(deptId)) {
      throw new BadRequest(`Invalid department id ${deptId}`);
    }
    const template = await TemplateCollection.findOne({ departmentId: deptId });
    if (!template) {
      throw new NotFound(`No template for department found`);
    }
    const jsonReport: JsonReportDescriptor = template.toJsonReport();
    res.status(HTTP_OK_CODE).json(jsonReport);
  } catch (e) {
    next(e);
  }
});

router.route(`/:${DEPARTMENT_ID_URL_PARAM}`).delete(requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const deptId = req.params[DEPARTMENT_ID_URL_PARAM];
    if (!Departments.Database.validateDeptId(deptId)) {
      throw new BadRequest(`Invalid department id ${deptId}`);
    }

    const template = await TemplateCollection.findOneAndDelete({ departmentId: deptId });
    if (!template) {
      throw new NotFound(`No template for department found`);
    }
    res.sendStatus(HTTP_NOCONTENT_CODE);
  } catch (e) {
    next(e);
  }
});

router.route('/').post(requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const bodyStr: string = JSON.stringify(req.body);
    const report: ReportDescriptor = await jsonStringToReport(bodyStr);

    let newTemplate: TemplateBase = getTemplateDocumentFromReport(report);
    const submittedUser = req.user;
    await attemptToSaveNewTemplate(newTemplate, submittedUser);
    res.status(HTTP_CREATED_CODE).send(`New template for department ${(await Departments.Database.getDeptNameById(newTemplate.departmentId)) as string}`);
  } catch (e) {
    next(e);
  }
});

router.route('/').put(requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const bodyStr: string = JSON.stringify(req.body);
    const report: ReportDescriptor = await jsonStringToReport(bodyStr);
    const template: TemplateBase = getTemplateDocumentFromReport(report);

    const existingDoc = await TemplateCollection.findOne({ id: template.id });
    const submittedUser = req.user;
    if (existingDoc) {
      // Update an existing template
      await attemptToUpdateTemplate(template, existingDoc, submittedUser);
      res.status(HTTP_NOCONTENT_CODE).send();
    } else {
      // Create a new template
      await attemptToSaveNewTemplate(template, submittedUser);
      res.status(HTTP_CREATED_CODE).send(`New template for department ${(await Departments.Database.getDeptNameById(template.departmentId)) as string} is created`);
    }
  } catch (e) {
    next(e);
  }
});

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

async function attemptToUpdateTemplate(template: TemplateBase, existingDoc: TemplateBase & import('mongoose').Document<any, any, TemplateBase>, submittedUser: User) {
  const submittedDeptId: string = template.departmentId;
  const changeDepartment = existingDoc.departmentId !== submittedDeptId;
  if (changeDepartment) {
    const departmentHasTemplate = await TemplateCollection.exists({ departmentId: submittedDeptId });
    if (departmentHasTemplate) {
      throw new Conflict(`Failed to update. Department ${await Departments.Database.getDeptNameById(submittedDeptId)} already has a template`);
    }
  }
  template.submittedDate = new Date();
  template.submittedByUserId = submittedUser._id!;

  const result = await existingDoc.updateOne(template);
  if (!result) {
    throw new InternalError(`Failed to update template with id ${template.id}`);
  }
}

async function attemptToSaveNewTemplate(newTemplate: TemplateBase, submittedUser: User) {
  // Add some server generated values, since this creates a new template
  newTemplate.id = generateUuid();
  newTemplate.submittedDate = new Date();
  newTemplate.submittedByUserId = submittedUser._id!;

  const isIdExist = await TemplateCollection.exists({ id: newTemplate.id });
  if (isIdExist) {
    throw new InternalError('Generated template uuid exists');
  }

  const isDepartmentExist = await TemplateCollection.exists({ departmentId: newTemplate.departmentId });
  if (isDepartmentExist) {
    throw new Conflict(`Failed to save. Template for department id ${newTemplate.departmentId} exists`);
  }

  const result = await new TemplateCollection(newTemplate).save();
  if (!result) {
    throw new InternalError(`Failed to save template with id ${newTemplate.id}`);
  }
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
