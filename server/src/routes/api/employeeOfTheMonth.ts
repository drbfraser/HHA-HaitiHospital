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
import { BadRequest, HTTP_OK_CODE, NotFound } from 'exceptions/httpException';
import Departments from 'utils/departments';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';

const router = Router();

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const doc = await EOTMCollection.findOne();
    if (!doc) {
      throw new NotFound(`No employee of the month found`);
    }
    const json = (await doc.toJson()) as EmployeeOfTheMonthJson;
    res.status(HTTP_OK_CODE).json(json);
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
      const previousEmployeeOfTheMonth = await EOTMCollection.findOne();
      const defaultImgPath: string = 'public/images/avatar0.jpg';
      if (previousEmployeeOfTheMonth) {
        const imgPath: string = previousEmployeeOfTheMonth.imgPath;
        if (imgPath != defaultImgPath) {
          deleteUploadedImage(previousEmployeeOfTheMonth.imgPath);
        }
      }
      const { name, department, description } = JSON.parse(req.body.document);

      let imgPath: string = '';
      if (req.file) {
        imgPath = req.file.path.replace(/\\/g, '/');
      }

      if (!Departments.Database.validateDeptId(department.id)) {
        throw new BadRequest(`Invalid department id ${department}`);
      }
      const updatedEmployeeOfTheMonth: EmployeeOfTheMonth = {
        name: name,
        departmentId: department.id,
        description: description,
        imgPath: imgPath,
      };
      await EOTMCollection.findByIdAndUpdate(
        { _id: previousEmployeeOfTheMonth?._id },
        { $set: updatedEmployeeOfTheMonth },
        { new: true },
      );
      res.sendStatus(HTTP_OK_CODE);
    } catch (e) {
      next(e);
    }
  },
);

export default router;
