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
// Create a put request to update permissions from the front end

export default router;
