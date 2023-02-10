import { NextFunction, Response } from 'express';
import { checkUserIsDepartmentAuthed } from 'utils/authUtils';
import { DEPARTMENT_ID_URL_SLUG, REPORT_ID_URL_SLUG } from 'utils/constants';
import { RequestWithUser } from 'utils/definitions/express';
import {
  HTTP_CREATED_CODE,
  HTTP_OK_CODE,
  NotFound,
  Unauthorized,
} from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { ReportCollection } from '../../models/report';
import { departmentAuth } from 'middleware/departmentAuth';
import { Router } from 'express';

const router = Router();

//Save report
router.post(
  '/',
  requireJwtAuth,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { departmentId, reportMonth, submittedUserId, serializedReport } = req.body;
      // NOTE: May need to sanitize the reportObject before saving
      const newReport = new ReportCollection({
        departmentId,
        submittedUserId,
        reportMonth,
        reportObject: serializedReport,
      });
      const saved = await newReport.save();
      return res.status(HTTP_CREATED_CODE).json({ message: 'Report saved', report: saved });
    } catch (e) {
      next(e);
    }
  },
);

// Fetch report by id
router.get(
  `/:${REPORT_ID_URL_SLUG}`,
  requireJwtAuth,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const reportId = req.params[REPORT_ID_URL_SLUG];
      const report = await ReportCollection.findById(reportId).lean();
      if (!report) {
        throw new NotFound(`No report with id ${req.params[REPORT_ID_URL_SLUG]}`);
      }

      const authorized = checkUserIsDepartmentAuthed(req.user, report.departmentId);
      if (!authorized) {
        throw new Unauthorized(`User not authorized`);
      }

      res.status(HTTP_OK_CODE).json({ report: report });
    } catch (e) {
      next(e);
    }
  },
);

// Fetch all reports
router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const reports = await ReportCollection.find();
    res.status(HTTP_OK_CODE).json(reports);
  } catch (e) {
    next(e);
  }
});

//Fetch reports of a department with department id
router.get(
  `/department/:${DEPARTMENT_ID_URL_SLUG}`,
  requireJwtAuth,
  departmentAuth,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const deptId = req.params[DEPARTMENT_ID_URL_SLUG];
      const reports = await ReportCollection.find({ departmentId: deptId }).sort({
        reportMonth: 'desc',
      });

      res.status(HTTP_OK_CODE).json(reports);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  `/:${REPORT_ID_URL_SLUG}`,
  requireJwtAuth,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const reportId = req.params[REPORT_ID_URL_SLUG];
      const report = await ReportCollection.findById(reportId).lean();
      if (!report) {
        throw new NotFound(`No report with id ${req.params[REPORT_ID_URL_SLUG]}`);
      }

      const authorized = checkUserIsDepartmentAuthed(req.user, report.departmentId);
      if (!authorized) {
        throw new Unauthorized(`User not authorized`);
      }

      res.status(HTTP_OK_CODE).json({ report: report });
    } catch (e) {
      next(e);
    }
  },
);

export default router;
