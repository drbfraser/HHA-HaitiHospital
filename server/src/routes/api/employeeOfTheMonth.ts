import { Router, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/multer';
import { validateInput } from '../../middleware/inputSanitization';
import EOTMCollection, {
  EmployeeOfTheMonth,
  EmployeeOfTheMonthJson,
} from 'models/employeeOfTheMonth';
import { Role } from '../../models/user';
import { registerEmployeeOfTheMonthEdit } from '../../sanitization/schemas/registerEmployeeOfTheMonth';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import {
  BadRequest,
  HTTP_CREATED_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_OK_CODE,
  InternalError,
  NotFound,
} from 'exceptions/httpException';
import Departments from 'utils/departments';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';

const router = Router();

router.get(
  '/:awardedYear/:awardedMonth',
  requireJwtAuth,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { awardedYear, awardedMonth } = req.params;
      const doc = await EOTMCollection.find({
        awardedYear: +awardedYear,
        awardedMonth: +1,
      });
      // find eotm with current year and month, if not found, find the closest below it.

      if (!doc) {
        throw new NotFound(`No employee of the month found`);
      }

      const jsons = doc.map(async (eotm) => (await eotm.toJson()) as EmployeeOfTheMonthJson);

      Promise.all(jsons).then((eotms) => {
        res.status(HTTP_OK_CODE).json(eotms);
      });
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  '/:eotmId',
  requireJwtAuth,
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { eotmId } = req.params;
      const doc = await EOTMCollection.findById(eotmId);

      if (!doc) {
        throw new NotFound(`No employee of the month found`);
      }

      const json = (await doc.toJson()) as EmployeeOfTheMonthJson;

      res.status(HTTP_OK_CODE).json(json);
    } catch (e) {
      next(e);
    }
  },
);

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const doc = await EOTMCollection.find({});
    if (!doc) {
      throw new NotFound(`No employee of the month found`);
    }

    const jsons = doc.map(async (eotm) => (await eotm.toJson()) as EmployeeOfTheMonthJson);

    Promise.all(jsons).then((eotms) => {
      res.status(HTTP_OK_CODE).json(eotms);
    });
  } catch (e) {
    next(e);
  }
});

router.put(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  registerEmployeeOfTheMonthEdit,
  validateInput,
  upload.single('file'),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { id, name, department, description, awardedMonth, awardedYear } = JSON.parse(
        req.body.document,
      );

      const preUpdatedEmployeeOfTheMonth = await EOTMCollection.findById(id);

      let imgPath: string = preUpdatedEmployeeOfTheMonth.imgPath;
      if (req.file) {
        imgPath = req.file.path.replace(/\\/g, '/');
        deleteUploadedImage(preUpdatedEmployeeOfTheMonth.imgPath);
      }

      if (!Departments.Database.validateDeptId(department.id)) {
        throw new BadRequest(`Invalid department id ${department}`);
      }

      const updatedEmployeeOfTheMonth: EmployeeOfTheMonth = {
        name: name,
        departmentId: department.id,
        description: description,
        imgPath: imgPath,
        awardedMonth: awardedMonth,
        awardedYear: awardedYear,
      };
      await EOTMCollection.findByIdAndUpdate(
        { _id: id },
        { $set: updatedEmployeeOfTheMonth },
        { new: true },
      );
      res.sendStatus(HTTP_OK_CODE);
    } catch (e) {
      next(e);
    }
  },
);

router.post(
  '/',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  registerEmployeeOfTheMonthEdit,
  validateInput,
  upload.single('file'),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { name, department, description, awardedMonth, awardedYear } = JSON.parse(
        req.body.document,
      );

      let imgPath: string = '';
      if (req.file) {
        imgPath = req.file.path.replace(/\\/g, '/');
      }

      if (!Departments.Database.validateDeptId(department.id)) {
        throw new BadRequest(`Invalid department id ${department}`);
      }
      const addedEmployeeOfTheMonth: EmployeeOfTheMonth = {
        name: name,
        departmentId: department.id,
        description: description,
        imgPath: imgPath,
        awardedMonth: awardedMonth,
        awardedYear: awardedYear,
      };

      await EOTMCollection.create(addedEmployeeOfTheMonth);
      res.sendStatus(HTTP_OK_CODE);
    } catch (e) {
      next(e);
    }
  },
);

router.delete(
  '/:id',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.MedicalDirector),
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    const eotmId = req.params.id;
    EOTMCollection.findByIdAndRemove(eotmId)
      .exec()
      .then((data: any) => {
        if (!data) {
          return next(new NotFound(`No Employee of the month with id ${eotmId} found`));
        }

        return deleteUploadedImage(data.imgPath);
      })
      .then(() => res.sendStatus(HTTP_NOCONTENT_CODE))
      .catch((err: any) =>
        next(new InternalError(`Delete Employee of the month id ${eotmId} failed: ${err}`)),
      );
  },
);

export default router;
