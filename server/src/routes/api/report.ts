import { Request, NextFunction, Response } from 'express';
import {
  checkUserCanViewReport,
  checkUserCanEditReport,
  filterViewableReports,
  checkUserCanCreateReport,
} from 'utils/authUtils';
import { DEPARTMENT_ID_URL_SLUG, REPORT_ID_URL_SLUG } from 'utils/constants';
import {
  HTTP_CREATED_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_OK_CODE,
  NotFound,
  Unauthorized,
  UnprocessableEntity,
} from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { ReportCollection } from '../../models/report';
import { departmentAuth } from 'middleware/departmentAuth';
import { Router } from 'express';
import { cloneDeep } from 'lodash';
import { roleAuth } from 'middleware/roleAuth';
import { Role } from '@hha/common';
import { nextTick } from 'process';

const router = Router();

// Submit or Save as Draft - report
router.post('/', requireJwtAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new NotFound('User not logged in');
    }
    const { departmentId, reportMonth, submittedUserId, submittedBy, serializedReport, isDraft } =
      req.body;

    const authorized = checkUserCanCreateReport(req.user, departmentId);

    if (!authorized) {
      throw new Unauthorized('User not authorized to create report');
    }

    // NOTE: May need to sanitize the reportObject before saving
    const newReport = new ReportCollection({
      departmentId,
      submittedUserId,
      submittedBy,
      reportMonth,
      reportObject: serializedReport,
      isDraft: isDraft,
    });

    const saved = await newReport.save();
    return res.status(HTTP_CREATED_CODE).json({ message: 'Report saved', report: saved });
  } catch (e) {
    next(e);
  }
});

// Fetch report by id
router.get(
  `/:${REPORT_ID_URL_SLUG}`,
  requireJwtAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new NotFound('User not logged in');
      }
      const reportId = req.params[REPORT_ID_URL_SLUG];
      const report = await ReportCollection.findById(reportId).lean();
      if (!report) {
        throw new NotFound(`No report with id ${req.params[REPORT_ID_URL_SLUG]}`);
      }

      const authorized = checkUserCanViewReport(req.user, report.departmentId);
      if (!authorized) {
        throw new Unauthorized('User not authorized to view report');
      }

      res.status(HTTP_OK_CODE).json({ report: report });
    } catch (e) {
      next(e);
    }
  },
);

// Fetch all reports
router.get('/', requireJwtAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new NotFound('User not logged in');
    }
    const reports = await ReportCollection.find();
    const filteredReports = filterViewableReports(req.user, reports);
    res.status(HTTP_OK_CODE).json(filteredReports);
  } catch (e) {
    next(e);
  }
});

// Fetch reports of a department with department id
router.get(
  `/department/:${DEPARTMENT_ID_URL_SLUG}`,
  requireJwtAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new NotFound('User not logged in');
      }
      const deptId = req.params[DEPARTMENT_ID_URL_SLUG];
      const reports = await ReportCollection.find({ departmentId: deptId }).sort({
        reportMonth: 'desc',
      });

      const authorized = checkUserCanViewReport(req.user, deptId);

      if (!authorized) {
        throw new Unauthorized('User not authorized to view reports');
      }

      res.status(HTTP_OK_CODE).json(reports);
    } catch (e) {
      next(e);
    }
  },
);

// Delete report by id
router.delete(
  `/:${REPORT_ID_URL_SLUG}`,
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new NotFound('User not logged in');
      }
      const reportId = req.params[REPORT_ID_URL_SLUG];
      const report = await ReportCollection.findById(reportId);

      if (!report) {
        throw new NotFound(`No report with id ${reportId}`);
      }

      const authorized = checkUserCanEditReport(req.user, report);

      if (!authorized) {
        throw new Unauthorized('User not authorized to delete report');
      }

      await report.remove();
      res.status(HTTP_NOCONTENT_CODE).send();
    } catch (e) {
      next(e);
    }
  },
);

// Update report by id
router.put(`/`, requireJwtAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new NotFound('User not logged in');
    }
    const { id, serializedReport, reportMonth, isDraft } = req.body;

    const report = await ReportCollection.findById(id);

    if (!report) {
      throw new NotFound(`No report with id ${id}`);
    }

    const authorized = checkUserCanEditReport(req.user, report);

    if (!authorized) {
      throw new Unauthorized('User not authorized to update report');
    }

    if (!reportMonth) {
      throw new UnprocessableEntity('Report month is required');
    }

    report.reportObject = cloneDeep(serializedReport);
    report.reportMonth = reportMonth;
    report.isDraft = isDraft;

    await report.save();

    res.status(HTTP_OK_CODE).json({ message: 'Report updated' });
  } catch (e) {
    next(e);
  }
});
export default router;
