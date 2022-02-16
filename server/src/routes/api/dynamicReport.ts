import { NextFunction, Request, Response } from 'express';
import httpErrorMiddleware from '../../middleware/httpErrorHandler';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { roleAuth } from '../../middleware/roleAuth';
import { ReportModel } from '../../models/dynamicReport';
import { Role } from '../../models/user';

const router = require('express').Router();

//Fetch all reports
router.route('/').get(requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), 
    async (req: Request, res: Response, next: NextFunction) => {
    
    const allReports = await ReportModel.find({}).exec();
    res.status(200)
        .json(allReports);
  
}, httpErrorMiddleware);

export default router;