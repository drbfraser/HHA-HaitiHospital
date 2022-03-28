import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import EmployeeOfTheMonth from 'models/employeeOfTheMonth';
import { checkIsInRole } from '../../utils/authUtils';
import { Role } from '../../models/user';
import { registerEmployeeOfTheMonthEdit } from '../../schema/registerEmployeeOfTheMonth';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import httpErrorMiddleware from 'middleware/httpErrorHandler';
import { BadRequest, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError } from 'exceptions/httpException';
import { verifyDeptId } from 'common/definitions/departments';

const router = Router();

router.get('/', requireJwtAuth, async (req: Request, res: Response) => {
    await EmployeeOfTheMonth.findOne()
      .then((data: any) => res.status(HTTP_OK_CODE).json(data))
      .catch((err: any) => { throw new InternalError(`get employee of the month posts failed: ${err}`)});
}, httpErrorMiddleware);

router.put('/', requireJwtAuth, checkIsInRole(Role.Admin), registerEmployeeOfTheMonthEdit, validateInput, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    const previousEmployeeOfTheMonth = await EmployeeOfTheMonth.findOne();
    deleteUploadedImage(previousEmployeeOfTheMonth.imgPath);
    const { name, department, description } = JSON.parse(req.body.document);
    let imgPath: string = '';
    if (req.file) {
      imgPath = req.file.path.replace(/\\/g, '/');
    }

    if (!verifyDeptId) {
        throw new BadRequest(`Invalid department id ${department}`);
    }
    const updatedEmployeeOfTheMonth = {
      name: name,
      department: department,
      description: description,
      imgPath: imgPath
    };
    await EmployeeOfTheMonth.findByIdAndUpdate({ _id: previousEmployeeOfTheMonth._id }, { $set: updatedEmployeeOfTheMonth }, { new: true })
      .then((data: any) => res.status(HTTP_NOCONTENT_CODE).json(data))
      .catch((err: any) => { throw new InternalError(`Failed to update employee of the month: ${err}`)});
}, httpErrorMiddleware);

export default router;
