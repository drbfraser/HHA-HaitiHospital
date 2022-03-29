import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import EmployeeOfTheMonth from 'models/employeeOfTheMonth';
import { Role } from '../../models/user';
import { registerEmployeeOfTheMonthEdit } from '../../schema/registerEmployeeOfTheMonth';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import { BadRequest, HTTP_OK_CODE, InternalError } from 'exceptions/httpException';
import { verifyDeptId } from 'common/definitions/departments';
import { roleAuth } from 'middleware/roleAuth';

const router = Router();

router.get('/', requireJwtAuth, async (req: Request, res: Response) => {
    EmployeeOfTheMonth.findOne().exec()
      .then((data: any) => res.status(HTTP_OK_CODE).json(data))
      .catch((err: any) => { throw new InternalError(`get employee of the month posts failed: ${err}`)});
});

router.put('/', requireJwtAuth, roleAuth(Role.Admin), registerEmployeeOfTheMonthEdit, validateInput, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    const previousEmployeeOfTheMonth = await EmployeeOfTheMonth.findOne();
    deleteUploadedImage(previousEmployeeOfTheMonth.imgPath);
    const { name, department, description } = JSON.parse(req.body.document);
    let imgPath: string = '';
    if (req.file) {
      imgPath = req.file.path.replace(/\\/g, '/');
    }
    if (!verifyDeptId(department)) {
        throw new BadRequest(`Invalid department id ${department}`);
    }

    const updatedEmployeeOfTheMonth = {
      name: name,
      department: department,
      description: description,
      imgPath: imgPath
    };
    const post = await EmployeeOfTheMonth.findByIdAndUpdate({ _id: previousEmployeeOfTheMonth._id }, { $set: updatedEmployeeOfTheMonth }, { new: true }).exec();
    res.status(HTTP_OK_CODE).json(post);
});

export default router;
