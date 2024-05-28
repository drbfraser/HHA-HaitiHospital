import { Role } from '@hha/common';
import { HTTP_OK_CODE, NotFound } from 'exceptions/httpException';
import { NextFunction, Request, Response, Router } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { ReportCollection } from 'models/report';
import { ITemplate, TemplateCollection } from 'models/template';
import { COMMUNITY_AND_HEALTH_QUERY } from 'utils/constants';
import Departments, { DefaultDepartments } from 'utils/departments';
import { parseQuestions } from 'utils/utils';

const router = Router();

router.get(
  '/questions',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  async (req: Request, res: Response, next: NextFunction) => {
    let department = req.query.department as string;

    // In database, Community and Health is stored as Community & Health, "&" causes decoding issues in URI search query
    // So, translate "Community and Health" to "Community & Health"
    if (department == COMMUNITY_AND_HEALTH_QUERY) {
      department = DefaultDepartments.Community;
    }

    try {
      const departmentId = await Departments.Database.getDeptIdByName(department);

      const template: ITemplate = await TemplateCollection.findOne({
        departmentId: departmentId,
      }).lean();

      if (!template) {
        throw new NotFound('No template for department found');
      }

      const questions = parseQuestions(template);

      res.status(HTTP_OK_CODE).json(questions);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  async (req: Request, res: Response, next: NextFunction) => {
    const department = req.query.department as string;
    const category = req.query.category as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const timeStep = req.query.timeStep as string;

    const dateFormat = timeStep == 'month' ? '%b %Y' : '%Y';

    console.log('dep name:', department);

    try {
      const departmentId = await Departments.Database.getDeptIdByName(department);

      const departmentAnalytics = await ReportCollection.aggregate([
        {
          $unwind: '$reportObject.questionItems',
        },
        {
          $match: {
            $and: [
              {
                'reportObject.questionItems.prompt.en': { $eq: category },
              },
              {
                departmentId: { $eq: departmentId },
              },
              {
                submittedDate: { $gte: startDate, $lte: endDate },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            answer: '$reportObject.questionItems.answer',
            data: '$reportObject.questionItems.prompt.en',
            date: { $dateToString: { format: dateFormat, date: '$submittedDate' } },
          },
        },
      ]);

      res.status(HTTP_OK_CODE).json(departmentAnalytics);
    } catch (e) {
      next(e);
    }
  },
);

export default router;
