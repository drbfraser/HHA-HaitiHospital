import { HTTP_CREATED_CODE, HTTP_OK_CODE, NotFound } from '../../exceptions/httpException';
import { IRouter, NextFunction, Response } from 'express';

import { DEPARTMENT_ID_URL_SLUG } from './../../utils/constants';
import Departments from 'utils/departments';
import { RequestWithUser } from 'utils/definitions/express';
import { Role } from 'models/user';
import { TemplateCollection } from 'models/template';
import { logger } from 'logger';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';

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

        console.log('server routes/api/template get template', serializedTemplate);
        console.log('server routes/api/template get template', serializedTemplate.reportObject);
        // print where id: '14' of questionItems in reportObject
        // Find the element with id: '14' in questionItems
        const questionIdToFind = '14';
        const questionItem = serializedTemplate.reportObject.questionItems.find(
          (item) => item.id === questionIdToFind,
        );

        console.log('numeric table question', questionItem.questionTable);

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
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { departmentId, serializedReport } = req.body;
      logger.log('server routes/api/template save report', departmentId, serializedReport);
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
