import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { ReportModel } from '../../models/report';
import { Role } from '../../models/user';
import { checkIsInRole, checkUserIsDepartmentAuthed } from '../../utils/authUtils';

const router = require('express').Router();

//Fetch all reports
router.route('/').get(requireJwtAuth, checkIsInRole(Role.Admin, Role.MedicalDirector), async (req: Request, res: Response) => {
    try {
        const allReports = await ReportModel.find({}).exec();
    }
    catch (error: HttpException) {
        res.
    }
});