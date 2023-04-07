const router = require('express').Router();
import MessageCollection from 'models/messageBoard';
import { NextFunction, Response } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { validateInput } from 'middleware/inputSanitization';
import { Role } from 'models/user';
import { registerMessageBoardCreate } from 'sanitization/schemas/registerMessageBoard';
import {
  BadRequest,
  HTTP_CREATED_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_OK_CODE,
  InternalError,
  NotFound,
  Unauthorized,
} from 'exceptions/httpException';
import Departments, { DefaultDepartments } from 'utils/departments';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';
import MessageBoard from 'utils/messageboard';
import { checkUserHasMessageAdminLevelAuth } from 'utils/authUtils';
router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    let docs;
    if (req.user.role == Role.User) {
      const userDeptId = req.user.departmentId;
      const generalDeptId = await Departments.Database.getDeptIdByName(DefaultDepartments.General);
      docs = await MessageCollection.find()
        .or([{ departmentId: userDeptId }, { departmentId: generalDeptId }])
        .sort({ date: 'desc' });
    } else {
      docs = await MessageCollection.find({}).sort({ date: 'desc' });
    }
    const jsons = await Promise.all(docs.map((doc) => doc.toJson()));
    res.status(HTTP_OK_CODE).json(jsons);
  } catch (e) {
    next(e);
  }
});

router.get(
  '/department/:departmentId',
  requireJwtAuth,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const deptId = req.params.departmentId;
      if (!(await Departments.Database.validateDeptId(deptId))) {
        throw new BadRequest(`Invalid department id: ${deptId}`);
      }
      if (req.user.role == Role.User) {
        const userDeptId = req.user.departmentId;
        const generalDeptId = await Departments.Database.getDeptIdByName(
          DefaultDepartments.General,
        );
        if (deptId != userDeptId && deptId != generalDeptId) {
          throw new Unauthorized(`Do not have access to messages from department id: ${deptId}`);
        }
      }
      const docs = await MessageCollection.find({ departmentId: deptId }).sort({ date: 'desc' });
      const jsons = await Promise.all(docs.map((doc) => doc.toJson()));
      res.status(HTTP_OK_CODE).json(jsons);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  '/:id',
  requireJwtAuth,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const msgId = req.params.id;
      const doc = await MessageCollection.findById(msgId);
      if (!doc) {
        throw new NotFound(`No message with id ${msgId} available`);
      }
      if (req.user.role == Role.User) {
        const userDeptId = req.user.departmentId;
        const generalDeptId = await Departments.Database.getDeptIdByName(
          DefaultDepartments.General,
        );
        if (doc.departmentId != userDeptId && doc.departmentId != generalDeptId) {
          throw new Unauthorized(`Do not have access to message with id: ${msgId}`);
        }
      }
      const json = await doc.toJson();
      res.status(HTTP_OK_CODE).json(json);
    } catch (e) {
      next(e);
    }
  },
);

router.post(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment),
  registerMessageBoardCreate,
  validateInput,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const departmentId: string = req.body.department.id;
      if (!(await Departments.Database.validateDeptId(departmentId))) {
        throw new BadRequest(`Invalid department id ${departmentId}`);
      }
      if (!checkUserHasMessageAdminLevelAuth(req.user, departmentId)) {
        throw new Unauthorized(
          `Do not have access to post messages to department id: ${departmentId}`,
        );
      }
      const date: Date = new Date();
      const messageBody: string = req.body.messageBody;
      const messageHeader: string = req.body.messageHeader;
      const userId: string = req.user._id!;
      const messageEntry = new MessageCollection({
        departmentId: departmentId,
        userId: userId,
        date: date,
        messageBody: messageBody,
        messageHeader: messageHeader,
      });

      await messageEntry.save();
      res.sendStatus(HTTP_CREATED_CODE);
    } catch (e) {
      next(e);
    }
  },
);

router.put(
  '/:id',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment),
  registerMessageBoardCreate,
  validateInput,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const departmentId: string = req.body.department.id;
      if (!(await Departments.Database.validateDeptId(departmentId))) {
        throw new BadRequest(`Invalid department id ${departmentId}`);
      }
      if (!checkUserHasMessageAdminLevelAuth(req.user, departmentId)) {
        throw new Unauthorized(
          `Do not have access to post messages to department id: ${departmentId}`,
        );
      }
      const date: Date = new Date();
      const messageBody: string = req.body.messageBody;
      const messageHeader: string = req.body.messageHeader;
      const userId: string = req.user._id!;
      const updatedMessage = {
        departmentId: departmentId,
        userId: userId,
        date: date,
        messageBody: messageBody,
        messageHeader: messageHeader,
      };

      Object.keys(updatedMessage).forEach(
        (k) => (!updatedMessage[k] || updatedMessage[k] === undefined) && delete updatedMessage[k],
      );

      const msg = await MessageCollection.findByIdAndUpdate(
        { _id: req.params.id },
        updatedMessage,
        { new: true },
      );
      if (msg) {
        return res.sendStatus(HTTP_OK_CODE);
      }

      return res.sendStatus(HTTP_CREATED_CODE);
    } catch (e) {
      next(e);
    }
  },
);

router.delete(
  '/:id',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const msgId: string = req.params.id;
      const msg = await MessageCollection.findByIdAndRemove(msgId);
      if (!msg) {
        throw new NotFound(`No message with id ${msgId} found`);
      }
      if (!checkUserHasMessageAdminLevelAuth(req.user, msg.departmentId)) {
        throw new Unauthorized(
          `Do not have access to delete messages from department id: ${msg.departmentId}`,
        );
      }

      res.status(HTTP_NOCONTENT_CODE).send();
    } catch (e) {
      next(e);
    }
  },
);

export = router;
