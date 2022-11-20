import { ObjectSerializer } from '@hha/common';
import { IRouter, NextFunction, Response } from 'express';
import { checkUserIsDepartmentAuthed } from 'utils/authUtils';
import { REPORT_ID_URL_SLUG } from 'utils/constants';
import { RequestWithUser } from 'utils/definitions/express';
import { serializeReportObject } from 'utils/serializer';
import { HTTP_CREATED_CODE, HTTP_OK_CODE, NotFound, Unauthorized } from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { ReportCollection } from '../../models/report';

const router: IRouter = require('express').Router();

//Save report
router.route('/').post(requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { departmentId, reportMonth, submittedUserId, serializedReport } = req.body;
    const objectSerializer = new ObjectSerializer();
    const reportObject = objectSerializer.deserialize(serializedReport);
    // NOTE: May need to sanitize the reportObject before saving
    const newReport = new ReportCollection({
      departmentId,
      submittedUserId,
      reportMonth,
      reportObject
    });
    const saved = await newReport.save();
    return res.status(HTTP_CREATED_CODE).json({ message: 'Report saved', report: saved });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// Fetch report by id
router.route(`/:${REPORT_ID_URL_SLUG}`).get(requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
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

    res.status(HTTP_OK_CODE).json({ report: serializeReportObject(report) });
  } catch (e) {
    next(e);
  }
});

export default router;
