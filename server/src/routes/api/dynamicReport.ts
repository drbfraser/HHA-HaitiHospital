import { NextFunction, Request, Response } from 'express';
import { departmentAuth } from 'middleware/departmentAuth';
import { checkUserIsDepartmentAuthed } from 'utils/authUtils';
import { DEPARTMENT_ID_URL_SLUG, REPORT_ID_URL_SLUG } from 'utils/constants';
import { RequestWithUser } from 'utils/definitions/express';
import { verifyDeptId } from 'utils/departments';
import { jsonStringToReport } from 'utils/parsers/parsers';
import { updateSubmissionDate, setSubmittor, generateReportForMonth } from 'utils/report/report';
import { BadRequest, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound, Unauthorized } from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { roleAuth } from '../../middleware/roleAuth';
import { ReportModel } from '../../models/dynamicReport';
import { Role } from '../../models/user';

const router = require('express').Router();
const EARLIEST_DATE = new Date(1970, 1, 1);

//Fetch all reports
router.route('/').get(
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const docs = await ReportModel.find({}).sort({createdDate: 'desc'});
    const jsons = docs.map((doc) => doc.toJson());
    
    if (jsons.length === 0)
        return res.sendStatus(HTTP_NOCONTENT_CODE);

    res.status(HTTP_OK_CODE).json(jsons);
  }
  catch (e) {
      next(e);
  }
}
);

//Fetch reports of a department with department id
router.route(`/department/:${DEPARTMENT_ID_URL_SLUG}`).get(
    requireJwtAuth,
    departmentAuth,
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const deptId = req.params[DEPARTMENT_ID_URL_SLUG];
        const docs = await ReportModel.find({ "meta.departmentId": deptId}).sort({ "meta.createdDate": "desc"});
        const jsons = docs.map(doc => doc.toJson());

        if (jsons.length)
            return res.status(HTTP_OK_CODE).json(jsons);
        return res.sendStatus(HTTP_NOCONTENT_CODE);
    } catch (e) {
        next(e);
    }
}
);

// Fetch report by id
router.route(`/report/:${REPORT_ID_URL_SLUG}`).get(
    requireJwtAuth,
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const reportId = req.params[REPORT_ID_URL_SLUG];
        const doc = await ReportModel.findOne({ "meta.id": reportId }).lean();
        if (!doc) {
            throw new NotFound(`No report with id ${req.params[REPORT_ID_URL_SLUG]}`);
        }

        const authorized = checkUserIsDepartmentAuthed(req.user, doc.meta.departmentId);
        if (!authorized) {
            throw new Unauthorized(`User not authorized`);
        }

        const json = doc.toJson();
        res.status(HTTP_OK_CODE).json(json);
    } catch (e) {
        next(e);
    }
    }
);

// Update report by id
router.route(`/:${REPORT_ID_URL_SLUG}`).put(
    requireJwtAuth,
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const doc = await ReportModel.findOne({ "meta.id": req.params[REPORT_ID_URL_SLUG]});
        if (!doc) 
            throw new NotFound(`No report with id ${req.params[REPORT_ID_URL_SLUG]} available`);
        
        const reportInString = JSON.stringify(req.body);
        const report = jsonStringToReport(reportInString);
        updateSubmissionDate(report);
        setSubmittor(report, req.user);
        if (report.meta.id !== req.params[REPORT_ID_URL_SLUG])
            throw new BadRequest(`Expected id and provided id don't match`);
        
        const authorized = checkUserIsDepartmentAuthed(req.user, report.meta.departmentId);
        if (!authorized)
            throw new Unauthorized(`User not authorized`);

        await doc.updateOne(report);
        res.sendStatus(HTTP_NOCONTENT_CODE);
    } catch (e) {
        next (e);
    }
    }
);

// Delete a report, and auto generate a substitute report for department,
// that month, using department template (if any)
router.route(`/:${REPORT_ID_URL_SLUG}`).delete(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const doc = await ReportModel.findOne({ "meta.id": req.params[REPORT_ID_URL_SLUG]}).lean();
        if (!doc) {
            throw new NotFound(`No report with id ${req.params[REPORT_ID_URL_SLUG]} available`);
        }
        
        const deptAuth = checkUserIsDepartmentAuthed(req.user, doc.meta.departmentId);
        if (!deptAuth) {
            throw new Unauthorized(`User is not authorized`);
        }

        const result = await ReportModel.deleteOne({ "meta.id": doc.meta.id });
        if (result.deletedCount === 0) {
            throw new InternalError(`Delete report failed`);
        }

        const substituteReport = await generateReportForMonth(doc.meta.departmentId, doc.meta.createdDate!, req.user);
        const newDoc = new ReportModel(substituteReport);
        newDoc.save();

        res.status(HTTP_CREATED_CODE).send(`Replace deleted report with an empty report`);

    } catch (e) {
        next(e);
    }
    }
);

// Create a new report for month-year for department id.
// Want to create a scheduler to auto generate report for every month.
// When scheduler is implemented, may want to remove this endpoint.
// Expect body {month: MM, year: YYYY}
router.route(`/generate/:${DEPARTMENT_ID_URL_SLUG}`).post(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.HeadOfDepartment, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const valid = verifyDeptId(req.params[DEPARTMENT_ID_URL_SLUG]);
        if (!valid) {
            throw new BadRequest(`Department id is invalid`);
        }
        const deptAuth = checkUserIsDepartmentAuthed(req.user, req.params[DEPARTMENT_ID_URL_SLUG]);
        if (!deptAuth) {
            throw new Unauthorized(`User is not authorized`);
        }

        const month = parseInt(req.body.month);
        const year = parseInt(req.body.year);
        const date = new Date(year, month);
        const newReport = await generateReportForMonth(req.params[DEPARTMENT_ID_URL_SLUG], date, req.user);
        
        const newDoc = new ReportModel(newReport);
        newDoc.save();
        res.sendStatus(HTTP_CREATED_CODE);
        
    } catch (e) {
        next(e);
    }

    }
);







// >>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>

// If no date query presented, returns today date
function getToDateQuery(req: Request): Date {
  try {
    const strTo = req.query.from as string;
    if (strTo === undefined) {
      const today = new Date();
      return today;
    }

    const strDateParser = strToDate;
    const to = strDateParser(strTo);
    return to;
  } catch (err) {
    throw new BadRequest(`Bad query - to date: ${err.message}`);
  }
}

// If no date query presented, returns the earliest date
// supported: 1970-01-01
function getFromDateQuery(req: Request): Date {
  try {
    const strFrom = req.query.from as string;
    if (strFrom === undefined) {
      return EARLIEST_DATE;
    }

    const strDateParser = strToDate;
    const from = strDateParser(strFrom);
    return from;
  } catch (err) {
    throw new BadRequest(`Bad query - from date: ${err.message}`);
  }
}

// string in format YYYY-MM-DD
function strToDate(strDate: string): Date {
  const re = new RegExp('^d{4}-d{2}-d{2}$');
  const isMatched = re.test(strDate);
  if (!isMatched) {
    throw new BadRequest('Date in bad format, expecting YYYY-MM-DD');
  }

  const substrs = strDate.split('-');
  // month is 0 based
  const year = parseInt(substrs[0]);
  const month = parseInt(substrs[1]);
  const day = parseInt(substrs[2]);
  const date = new Date(year, month - 1, day);

  if (!date) {
    throw new BadRequest('Date has bad value');
  }

  return date;
}
// <<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<

export default router;
