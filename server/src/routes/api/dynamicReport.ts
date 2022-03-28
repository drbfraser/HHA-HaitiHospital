import { NextFunction, Request, Response } from 'express';
import { BadRequest, HttpError } from '../../exceptions/httpException';
import { departmentAuth } from '../../middleware/departmentAuth';
import httpErrorMiddleware from '../../middleware/httpErrorHandler';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { roleAuth } from '../../middleware/roleAuth';
import { ReportModel } from '../../models/dynamicReport';
import { Role } from '../../models/user';

const router = require('express').Router();
const EARLIEST_DATE = new Date(1970, 1, 1);

//Fetch all reports
//Support searching by date with query parameters/string: from, to
router.route('/').get(
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  async (req: Request, res: Response, next: NextFunction) => {
    const extractFromQuery = getFromDateQuery;
    const from = extractFromQuery(req);
    const extractToQuery = getToDateQuery;
    const to = extractToQuery(req);

    const allReports = await ReportModel.find({
    'metadata.dateCreated': {
        $gte: from,
        $lte: to
    }
    })
    .sort({ 'metadata.dateCreated': 'desc' })
    .exec();
    res.status(200).send({
    reports: allReports
    });
  },
  httpErrorMiddleware
);

//Fetch reports of a department with department id
//Support searching by date with query parameters/string: from, to
router.route('/:departmentId').get(
  requireJwtAuth,
  departmentAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const extractFromQuery = getFromDateQuery;
    const from = extractFromQuery(req);
    const extractToQuery = getToDateQuery;
    const to = extractToQuery(req);
    let query = ReportModel.find({
    'metadata.dateCreated': {
        $gte: from,
        $lte: to
    }
    });

    const deptId = parseInt(req.params.departmentId);
    query = query.find({
    'metadata.departmentId': deptId
    });

    const reports = await query.sort({ 'metadata.dateCreated': 'desc' }).exec();
    res.status(200).send({
    reports: reports
    });
  },
  httpErrorMiddleware
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
