import { Router, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import EmployeeOfTheMonthModel, { EmployeeOfTheMonth } from 'models/employeeOfTheMonth';
import { Role } from '../../models/user';
import { registerEmployeeOfTheMonthEdit } from '../../schema/registerEmployeeOfTheMonth';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import { BadRequest, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError } from 'exceptions/httpException';
import { verifyDeptId } from 'utils/departments';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';

const router = Router();

router.get('/', requireJwtAuth, (req: RequestWithUser, res: Response, next: NextFunction) => {
  EmployeeOfTheMonthModel.findOne()
    .exec()
    .then((data) => {
      if (!data) {
        return res.status(HTTP_NOCONTENT_CODE);
      }

      res.status(HTTP_OK_CODE).json(data.toJson());
    })
    .catch((err) => next(new InternalError(`get employee of the month posts failed: ${err}`)));
});

router.put('/', requireJwtAuth, roleAuth(Role.Admin), registerEmployeeOfTheMonthEdit, validateInput, upload.single('file'), async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const previousEmployeeOfTheMonth = await EmployeeOfTheMonthModel.findOne();
    if (previousEmployeeOfTheMonth) {
      deleteUploadedImage(previousEmployeeOfTheMonth.imgPath);
    }
    const { name, department, description } = JSON.parse(req.body.document);
    let imgPath: string = '';
    if (req.file) {
      imgPath = req.file.path.replace(/\\/g, '/');
    }
    if (!verifyDeptId(department.id)) {
      throw new BadRequest(`Invalid department id ${department}`);
    }

    const updatedEmployeeOfTheMonth: EmployeeOfTheMonth = {
      name: name,
      departmentId: department.id,
      description: description,
      imgPath: imgPath
    };
    await EmployeeOfTheMonthModel.findByIdAndUpdate({ _id: previousEmployeeOfTheMonth?._id }, { $set: updatedEmployeeOfTheMonth }, { new: true });
    res.sendStatus(HTTP_OK_CODE);
  } catch (e) {
    next(e);
  }
});

export default router;
