import { IRouter, NextFunction, Response } from 'express';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';
import { HTTP_OK_CODE, HTTP_CREATED_CODE, NotFound } from '../../exceptions/httpException';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { PermissionCollection } from 'models/permission';
import { Role } from 'models/user';

const router: IRouter = require('express').Router();

//get Permissions
router.get(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      //get the only record from permissoin collection
      let permission = await PermissionCollection.findOne().lean();
      if (!permission) {
        throw new NotFound(`No Permissions found`);
      }
      res.status(HTTP_OK_CODE).json({ permission: permission });
    } catch (e) {
      next(e);
    }
  },
);

// TODO::  Update permissions
// router.put(
//   '/',
//   requireJwtAuth,
//   roleAuth(Role.Admin),
//   async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//       const { departmentId, serializedReport } = req.body;

//       // NOTE: May need to sanitize the reportTemplate before saving
//       let template = new TemplateCollection({
//         departmentId: departmentId,
//         reportObject: serializedReport,
//       });

//       let serializedTemplate = await TemplateCollection.findOne({
//         departmentId: departmentId,
//       }).lean();

//       if (serializedTemplate) {
//         template = new TemplateCollection({
//           _id: serializedTemplate._id,
//           departmentId: departmentId,
//           reportObject: serializedReport,
//         });
//         const saved = await TemplateCollection.updateOne({ departmentId: departmentId }, template);
//         return res
//           .status(HTTP_CREATED_CODE)
//           .json({ message: 'Report Template saved', report: saved });
//       } else {
//         const saved = await template.save();
//         return res
//           .status(HTTP_CREATED_CODE)
//           .json({ message: 'Report Template saved', report: saved });
//       }
//     } catch (e) {
//       next(e);
//     }
//   },
// );

export default router;
