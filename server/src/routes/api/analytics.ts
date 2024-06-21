import {
  AnalyticsQuestionRequestBody,
  AnalyticsQuestionResponse,
  AnalyticsRequestBody,
  AnalyticsResponse,
  IReport,
  Role,
} from '@hha/common';
import { BadRequest, HTTP_OK_CODE, NotFound } from 'exceptions/httpException';
import { NextFunction, Request, Response, Router } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { ReportCollection } from 'models/report';
import {
  MONTH_AGGREGATE_BY,
  MONTH_DATE_FORMAT,
  YEAR_AGGREGATE_BY,
  YEAR_DATE_FORMAT,
} from 'utils/constants';
import {
  createAnalyticsPipeline,
  getAllAnswersFromReports,
  parseQuestions,
  removeMonthsByTimeStep,
} from 'utils/analytics';
import Departments from 'utils/departments';
import { getDepartmentsByTemplate } from 'utils/template';

const router = Router();

router.post(
  '/questions',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  async (
    req: Request<{}, AnalyticsQuestionResponse[], AnalyticsQuestionRequestBody, {}>,
    res: Response<AnalyticsQuestionResponse[]>,
    next: NextFunction,
  ) => {
    try {
      const { departmentIds } = req.body;

      const areDepartmentsValid = await Departments.Database.validateDepartmentIds(departmentIds);

      if (!areDepartmentsValid) {
        throw new NotFound(`There exist a department id that was not found`);
      }

      const templates = await getDepartmentsByTemplate(departmentIds);

      const questions = parseQuestions(templates);

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

router.post(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  async (
    req: Request<{}, AnalyticsResponse, AnalyticsRequestBody, {}>,
    res: Response<AnalyticsResponse[]>,
    next: NextFunction,
  ) => {
    try {
      const { departmentQuestions, startDate, endDate, timeStep, aggregateBy } = req.body;

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

      const departmentIds = departmentQuestions.map(
        (departmentQuestion) => departmentQuestion.departmentId,
      );

      const areDepartmentsValid = await Departments.Database.validateDepartmentIds(departmentIds);

      if (!areDepartmentsValid) {
        throw new NotFound(`There exist a department id that was not found`);
      }

      let analyticsForMonths: AnalyticsForMonths[] = await ReportCollection.aggregate(
        createAnalyticsPipeline({
          departmentIds,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          dateFormat,
        }),
      );

      // the HHA admins will like to compare data for months only when time step = year and aggregate by = month
      //eg, data in Jan 2023 is compared to data in Jan 2024
      // so, all other months are ignored

      if (timeStep === YEAR_AGGREGATE_BY && aggregateBy === MONTH_AGGREGATE_BY) {
        analyticsForMonths = removeMonthsByTimeStep(analyticsForMonths, parsedStartDate);
      }

      const analyticResponses = getAllAnswersFromReports(analyticsForMonths, departmentQuestions);

      res.status(HTTP_OK_CODE).json(analyticResponses);
    } catch (e) {
      next(e);
    }
  },
);

export default router;
