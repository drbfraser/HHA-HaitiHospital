import { AnalyticsQuery, AnalyticsResponse, IReport, QuestionPrompt, Role } from '@hha/common';
import { BadRequest, HTTP_OK_CODE, NotFound } from 'exceptions/httpException';
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
import { generateWrongDepartmentIdError } from 'utils/errorUtils';

const router = Router();

type AnalyticsQuestionQuery = {
  departmentId: string;
};

router.get(
  '/questions',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  async (
    req: Request<{}, QuestionPrompt[], {}, AnalyticsQuestionQuery>,
    res: Response<QuestionPrompt[]>,
    next: NextFunction,
  ) => {
    try {
      const { departmentId } = req.query;

      const isDepartmentValid = await Departments.Database.validateDeptId(departmentId);

      if (!isDepartmentValid) {
        throw new NotFound(generateWrongDepartmentIdError(departmentId));
      }

      const template: ITemplate = await TemplateCollection.findOne({
        departmentId,
      }).lean();

      if (!template) {
        throw new NotFound(`department with id: ${departmentId} does not have a template`);
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
      const { departmentId, questionId, startDate, endDate, timeStep, aggregateBy } = req.query;

      let dateFormat = '';

      if (aggregateBy.toLowerCase() === MONTH_AGGREGATE_BY) {
        dateFormat = MONTH_DATE_FORMAT;
      } else if (aggregateBy.toLowerCase() === YEAR_AGGREGATE_BY) {
        dateFormat = YEAR_DATE_FORMAT;
      } else {
        throw new BadRequest('Aggregateby field has to be of type month or year');
      }

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      const isDepartmentValid = await Departments.Database.validateDeptId(departmentId);

      if (!isDepartmentValid) {
        throw new NotFound(generateWrongDepartmentIdError(departmentId));
      }

      let analytics: AnalyticsForMonths[] = await ReportCollection.aggregate(
        createAnalyticsPipeline({
          departmentId,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          dateFormat,
        }),
      );

      // the HHA admins will like to compare data for months only when time step = year and aggregate by = month
      //eg, data in Jan 2023 is compared to data in Jan 2024
      // so, all other months are ignored

      if (timeStep === YEAR_AGGREGATE_BY && aggregateBy === MONTH_AGGREGATE_BY) {
        analytics = removeMonthsByTimeStep(analytics, parsedStartDate);
      }

      const analyticResponses = processAnalytics(analytics, questionId);

      res.status(HTTP_OK_CODE).json(analyticResponses);
    } catch (e) {
      next(e);
    }
  },
);

export default router;
