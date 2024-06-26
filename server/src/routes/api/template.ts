import {
  HTTP_CREATED_CODE,
  HTTP_OK_CODE,
  NotFound,
  Unauthorized,
} from '../../exceptions/httpException';
import { Request, IRouter, NextFunction, Response } from 'express';

import { DEPARTMENT_ID_URL_SLUG } from '../../utils/constants';
import Departments from 'utils/departments';
import { Role } from '@hha/common';
import { TemplateCollection } from 'models/template';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';

const router: IRouter = require('express').Router();

//get template by department id
router
  .route(`/:${DEPARTMENT_ID_URL_SLUG}`)
  .get(
    requireJwtAuth,
    roleAuth(Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          throw new NotFound('User not logged in');
        }
        const deptId = req.params[DEPARTMENT_ID_URL_SLUG];
        if (!(await Departments.Database.validateDeptId(deptId))) {
          throw new NotFound(`Invalid department id ${deptId}`);
        }

        if (req.user.role === Role.HeadOfDepartment && deptId !== req.user.departmentId) {
          throw new Unauthorized('User not authorized to view template');
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

//Save report template
router.put(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new NotFound('User not logged in');
      }
      const { departmentId, serializedReport } = req.body;
      // NOTE: May need to sanitize the reportTemplate before saving
      let template = new TemplateCollection({
        departmentId: departmentId,
        reportObject: serializedReport,
      });

      let serializedTemplate = await TemplateCollection.findOne({
        departmentId: departmentId,
      }).lean();

      if (serializedTemplate) {
        template = new TemplateCollection({
          _id: serializedTemplate._id,
          departmentId: departmentId,
          reportObject: serializedReport,
        });
        const saved = await TemplateCollection.updateOne({ departmentId: departmentId }, template);
        return res
          .status(HTTP_CREATED_CODE)
          .json({ message: 'Report Template saved', report: saved });
      } else {
        const saved = await template.save();
        return res
          .status(HTTP_CREATED_CODE)
          .json({ message: 'Report Template saved', report: saved });
      }
    } catch (e) {
      next(e);
    }
  },
);

export default router;
