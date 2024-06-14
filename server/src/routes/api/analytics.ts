import { AnalyticsQuery, AnalyticsResponse, IReport, Role } from '@hha/common';
import { HTTP_OK_CODE, NotFound } from 'exceptions/httpException';
import { NextFunction, Request, Response, Router } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { ReportCollection } from 'models/report';
import { ITemplate, TemplateCollection } from 'models/template';
import {
  MONTH_AGGREGATE_BY,
  MONTH_DATE_FORMAT,
  YEAR_AGGREGATE_BY,
  YEAR_DATE_FORMAT,
} from 'utils/constants';
import {
  createAnalyticsPipeline,
  processAnalytics,
  parseQuestions,
  removeMonthsByTimeStep,
} from 'utils/analytics';
import Departments from 'utils/departments';

const router = Router();

type AnalyticsQuestionQuery = {
  departmentId: string;
};

export type AnalyticsQuestionsResponse = {
  id: string;
  en: string;
  fr: string;
};
router.get(
  '/questions',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  async (
    req: Request<{}, AnalyticsQuestionsResponse[], {}, AnalyticsQuestionQuery>,
    res: Response<AnalyticsQuestionsResponse[]>,
    next: NextFunction,
  ) => {
    try {
      const { departmentId } = req.query;

      const isDepartmentValid = await Departments.Database.validateDeptId(departmentId);

      if (!isDepartmentValid) {
        throw new NotFound(`No department with id provided`);
      }

      const template: ITemplate = await TemplateCollection.findOne({
        departmentId,
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

export type AnalyticsForMonths = {
  _id: string;
  reports: IReport[];
};

router.get(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  async (
    req: Request<{}, AnalyticsResponse, {}, AnalyticsQuery>,
    res: Response<AnalyticsResponse[]>,
    next: NextFunction,
  ) => {
    try {
      const { departmentIds, questionId, startDate, endDate, timeStep, aggregateBy } = req.query;

      let dateFormat = '';

      if (aggregateBy.toLowerCase() === MONTH_AGGREGATE_BY) {
        dateFormat = MONTH_DATE_FORMAT;
      } else if (aggregateBy.toLowerCase() === YEAR_AGGREGATE_BY) {
        dateFormat = YEAR_DATE_FORMAT;
      } else {
        throw new NotFound('Aggregate by field is incorrect');
      }

      const departmentIdArray = departmentIds.split(',');

      const areDepartmentsValid =
        await Departments.Database.validateDepartmentIds(departmentIdArray);

      if (!areDepartmentsValid) {
        throw new NotFound(`No department with id provided`);
      }

      let analytics: AnalyticsForMonths[] = await ReportCollection.aggregate(
        createAnalyticsPipeline({ departmentIdArray, startDate, endDate, dateFormat }),
      );

      // the HHA admins will like to compare data for months only when time step = year and aggregate by = month
      //eg, data in Jan 2023 is compared to data in Jan 2024
      // so, all other months are ignored

      if (timeStep === YEAR_AGGREGATE_BY && aggregateBy === MONTH_AGGREGATE_BY) {
        analytics = removeMonthsByTimeStep(analytics, startDate, endDate);
      }

      const analyticResponses = processAnalytics(analytics, questionId);

      res.status(HTTP_OK_CODE).json(analyticResponses);
    } catch (e) {
      next(e);
    }
  },
);

export default router;
