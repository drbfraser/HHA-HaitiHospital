import { NextFunction, Response } from 'express';
import { RequestWithUser } from 'utils/definitions/express';
import { HTTP_CREATED_CODE } from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';

import { ReportCollection } from '../../models/report';

const router = require('express').Router();

//Save report
router.route('/save').put(requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { departmentId, reportMonth, submittedUserId, serializedReport } = req.body;
    // NOTE: JSON.parse keeps the __class__ property
    const reportObject = JSON.parse(serializedReport);
    const newReport = new ReportCollection({
      departmentId,
      reportMonth,
      submittedUserId,
      reportObject
    });
    await newReport.save();
    return res.status(HTTP_CREATED_CODE).json({ message: 'Report saved' });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

export default router;
