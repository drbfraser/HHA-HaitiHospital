import { CustomError } from '../../exceptions/custom_exception';
import { NextFunction, Response } from 'express';
import { departmentAuth } from '../../middleware/departmentAuth';
import { CallbackError } from 'mongoose';
import { checkUserIsDepartmentAuthed } from '../../utils/authUtils';
import { DEPARTMENT_ID_URL_SLUG, REPORT_ID_URL_SLUG } from '../../utils/constants';
import { RequestWithUser } from '../../utils/definitions/express';
import { ReportDescriptor } from '../../utils/definitions/report';
import Departments from '../../utils/departments';
import { jsonStringToReport } from '../../utils/parsers/parsers';
import { updateSubmissionDate, setSubmittor, generateReportForMonth } from '../../utils/report/report';
import { mongooseErrorToMyError } from '../../utils/utils';
import { BadRequest, HTTP_CREATED_CODE, HTTP_OK_CODE, InternalError, NotFound, Unauthorized } from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { roleAuth } from '../../middleware/roleAuth';
import { ReportCollection } from '../../models/report';
import { Role } from '../../models/user';

const router = require('express').Router();

//Fetch all reports
router.route('/').get(requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const docs = await ReportCollection.find({}).sort({ reportMonth: 'desc' });
    const jsons = await Promise.all(docs.map((doc) => doc.toJson()));
    res.status(HTTP_OK_CODE).json(jsons);
  } catch (e) {
    next(e);
  }
});

//Fetch reports of a department with department id
router.route(`/department/:${DEPARTMENT_ID_URL_SLUG}`).get(requireJwtAuth, departmentAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const deptId = req.params[DEPARTMENT_ID_URL_SLUG];
    const docs = await ReportCollection.find({ departmentId: deptId }).sort({ reportMonth: 'desc' });
    const jsons = await Promise.all(docs.map((doc) => doc.toJson()));

    res.status(HTTP_OK_CODE).json(jsons);
  } catch (e) {
    next(e);
  }
});

// Fetch report by id
router.route(`/report/:${REPORT_ID_URL_SLUG}`).get(requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const reportId = req.params[REPORT_ID_URL_SLUG];
    const doc = await ReportCollection.findOne({ id: reportId });
    if (!doc) {
      throw new NotFound(`No report with id ${req.params[REPORT_ID_URL_SLUG]}`);
    }

    const authorized = checkUserIsDepartmentAuthed(req.user, doc.departmentId);
    if (!authorized) {
      throw new Unauthorized(`User not authorized`);
    }

    const json = await doc.toJson();
    res.status(HTTP_OK_CODE).json(json);
  } catch (e) {
    next(e);
  }
});

// Update report by id
router.route(`/:${REPORT_ID_URL_SLUG}`).put(requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const doc = await ReportCollection.findOne({ id: req.params[REPORT_ID_URL_SLUG] }).lean();
    if (!doc) throw new NotFound(`No report with id ${req.params[REPORT_ID_URL_SLUG]} available`);

    const reportInString = JSON.stringify(req.body);
    const report = await jsonStringToReport(reportInString);

    if (report.id !== req.params[REPORT_ID_URL_SLUG]) throw new BadRequest(`Report id does not match expectation`);

    updateSubmissionDate(report);
    setSubmittor(report, req.user);
    const authorized = checkUserIsDepartmentAuthed(req.user, report.departmentId);
    if (!authorized) throw new Unauthorized(`User not authorized`);

    // manually add report month
    // since the data send from FE does not have report month
    // can rid of this check when allow report json to contain report month
    report.reportMonth = doc.reportMonth;
    // end

    await attemptToUpdateReport(report, (err: CustomError) => {
      if (!err) return res.sendStatus(HTTP_OK_CODE);
      err.message = `Update report failed: ${err.message}`;
      return next(err);
    });
  } catch (e) {
    next(e);
  }
});

// Delete a report, and auto generate a substitute report for department,
// that month, using department template (if any)
router.route(`/:${REPORT_ID_URL_SLUG}`).delete(requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment), async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const doc = await ReportCollection.findOne({ id: req.params[REPORT_ID_URL_SLUG] }).lean();
    if (!doc) {
      throw new NotFound(`No report with id ${req.params[REPORT_ID_URL_SLUG]} available`);
    }

    const deptAuth = checkUserIsDepartmentAuthed(req.user, doc.departmentId);
    if (!deptAuth) {
      throw new Unauthorized(`User is not authorized`);
    }

    const result = await ReportCollection.deleteOne({ id: doc.id });
    if (result.deletedCount === 0) {
      throw new InternalError(`Delete report failed`);
    }

    const substituteReport = await generateReportForMonth(doc.departmentId, doc.reportMonth!, req.user);
    attemptToSaveReport(substituteReport, (err: CustomError) => {
      if (!err) return res.status(HTTP_CREATED_CODE).send(`Replace deleted report with an empty report`);
      err.message = `Generate report failed: ${err.message}`;
      return next(err);
    });
  } catch (e) {
    next(e);
  }
});

// Create a new report for month-year for department id.
// Want to create a scheduler to auto generate report for every month.
// When scheduler is implemented, may want to remove this endpoint.
// Expect body {month: MM, year: YYYY}
router
  .route(`/generate/:${DEPARTMENT_ID_URL_SLUG}`)
  .post(requireJwtAuth, roleAuth(Role.Admin, Role.HeadOfDepartment, Role.MedicalDirector), async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const valid = await Departments.Database.validateDeptId(req.params[DEPARTMENT_ID_URL_SLUG]);
      if (!valid) {
        throw new BadRequest(`Department id is invalid`);
      }
      const deptAuth = checkUserIsDepartmentAuthed(req.user, req.params[DEPARTMENT_ID_URL_SLUG]);
      if (!deptAuth) {
        throw new Unauthorized(`User is not authorized`);
      }

      // month is 0 index
      const month = parseInt(req.body.month) - 1;
      const year = parseInt(req.body.year);
      const date = new Date(year, month);
      const newReport = await generateReportForMonth(req.params[DEPARTMENT_ID_URL_SLUG], date, req.user);

      attemptToSaveReport(newReport, (err?: CustomError) => {
        if (!err) return res.sendStatus(HTTP_CREATED_CODE);
        err.message = `Generate report failed: ${err.message}`;
        return next(err);
      });
    } catch (e) {
      next(e);
    }
  });

// A temporary endpoint to get a report month since current json report don't have
// report month. May want to get rid of this once json supports this.
router.route(`/date/:${REPORT_ID_URL_SLUG}`).get(requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const report = await ReportCollection.findOne({ id: req.params[REPORT_ID_URL_SLUG] }).lean();
    if (!report) {
      throw new NotFound(`No report with id ${req.params[REPORT_ID_URL_SLUG]}`);
    }

    res.status(HTTP_OK_CODE).json({
      // month is 0 base
      month: report.reportMonth!.getMonth() + 1,
      year: report.reportMonth!.getFullYear()
    });
  } catch (e) {
    next(e);
  }
});

// >>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>

function attemptToSaveReport(report: ReportDescriptor, callback: (err?: CustomError) => void) {
  const doc = new ReportCollection(report);
  doc.save((err: CallbackError) => {
    if (!err) {
      return callback();
    }

    const myError: CustomError = mongooseErrorToMyError(err);
    callback(myError);
  });
}

async function attemptToUpdateReport(report: ReportDescriptor, callback: (err?: CustomError) => void) {
  const oldDoc = await ReportCollection.findOneAndDelete({ id: report.id }, { lean: true });
  if (!oldDoc) {
    throw new NotFound(`No report with provided id found`);
  }

  attemptToSaveReport(report, (newReportErr: CustomError) => {
    if (!newReportErr) {
      return callback();
    }

    // Recover old report
    attemptToSaveReport(oldDoc, (oldReportErr: CustomError) => {
      if (!oldReportErr) {
        return callback(newReportErr);
      }
    });
  });
}
// <<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<

export default router;
