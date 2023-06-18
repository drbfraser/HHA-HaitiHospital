import { DEPARTMENT_ID_URL_SLUG } from './../../utils/constants';
import { IRouter, NextFunction, Response } from 'express';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';
import { HTTP_OK_CODE, HTTP_CREATED_CODE, NotFound } from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Departments from 'utils/departments';
import { TemplateCollection } from 'models/template';
import { Role } from 'models/user';

const router: IRouter = require('express').Router();

//get template by department id
router
  .route(`/:${DEPARTMENT_ID_URL_SLUG}`)
  .get(
    //requireJwtAuth,
    //roleAuth(Role.Admin, Role.MedicalDirector),
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

        // Check if the client requested the French version
        const languagePreference = req.headers['accept-language'];
        const isFrenchRequested = languagePreference && languagePreference.includes('fr');

        // Extract the desired language version of prompt for each question item
        if (serializedTemplate.reportObject.questionItems) {
          serializedTemplate.reportObject.questionItems.forEach((item) => {
            item.prompt = isFrenchRequested ? item.prompt.fr : item.prompt.en;
            if (item.prompt instanceof Object) {
              item.prompt = Object.values(item.prompt)[0];
              console.log('server routes/api/template item prompr', item.prompt);
            }
          });
        }

        res.status(HTTP_OK_CODE).json({ template: serializedTemplate });

        console.log('server routes/api/template', serializedTemplate);
      } catch (e) {
        next(e);
      }
    },
  );

function getTemplateWithPreferredLanguage(serializedTemplate, languagePreference) {
  const defaultLanguage = 'en'; // Default language is English
  const fallbackLanguage = 'en'; // Fallback language is also English
  let template = { ...serializedTemplate };

  if (languagePreference && languagePreference.includes('fr')) {
    // Check if French is preferred language
    if (template.prompt && template.prompt.fr) {
      // If French prompt exists, use it
      template.prompt = template.prompt.fr;
    } else {
      // If French prompt doesn't exist, fall back to default language (English)
      template.prompt = template.prompt && template.prompt[defaultLanguage]
        ? template.prompt[defaultLanguage]
        : '';
    }
  } else {
    // Use default language (English) prompt
    template.prompt = template.prompt && template.prompt[defaultLanguage]
      ? template.prompt[defaultLanguage]
      : '';
  }

  return template;
}

//Save report template
router.put(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { departmentId, serializedReport } = req.body;
      console.log('server routes/api/template save report', departmentId, serializedReport);
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
