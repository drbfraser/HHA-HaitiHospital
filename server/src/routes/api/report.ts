import { ObjectSerializer } from '@hha/common';
import { NextFunction, Response } from 'express';
import { RequestWithUser } from 'utils/definitions/express';
import { HTTP_CREATED_CODE } from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { ReportCollection } from '../../models/report';

const router = require('express').Router();

//Save report
router.route('/').post(requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { departmentId, reportMonth, submittedUserId, serializedReport } = req.body;
    const objectSerializer = ObjectSerializer.getObjectSerializer();
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

export default router;
