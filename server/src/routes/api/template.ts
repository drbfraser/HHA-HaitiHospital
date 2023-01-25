import { DEPARTMENT_ID_URL_SLUG } from './../../utils/constants';
import { IRouter, NextFunction, Response } from 'express';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';
import { HTTP_OK_CODE, NotFound } from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Departments from 'utils/departments';
import { TemplateCollection } from 'models/template';
import { Role } from 'models/user';
import { serializeTemplateReportObject } from 'utils/serializer';
import { buildMaternityMockReport, ObjectSerializer } from '@hha/common';

const router: IRouter = require('express').Router();

//get template by department id
router
  .route(`/:${DEPARTMENT_ID_URL_SLUG}`)
  .get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector),
    async (req: RequestWithUser, res: Response, next: NextFunction) => {
      try {
        const deptId = req.params[DEPARTMENT_ID_URL_SLUG];
        if (!(await Departments.Database.validateDeptId(deptId))) {
          throw new NotFound(`Invalid department id ${deptId}`);
        }
        let serializedTemplate = await TemplateCollection.findOne({ departmentId: deptId }).lean();
        if (!serializedTemplate) {
          throw new NotFound(`No template for department found`);
        }
        res.status(HTTP_OK_CODE).json({ template: serializedTemplate });
      } catch (e) {
        next(e);
      }
    },
  );

export default router;
