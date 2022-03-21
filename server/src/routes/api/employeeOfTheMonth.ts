import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import EmployeeOfTheMonth from 'models/employeeOfTheMonth';
import { checkIsInRole } from '../../utils/authUtils';
import { Role } from '../../models/user';
import { registerEmployeeOfTheMonthEdit } from '../../schema/registerEmployeeOfTheMonth';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import { msgCatchError } from 'utils/sanitizationMessages';

const router = Router();

router.get('/', requireJwtAuth, async (req: Request, res: Response) => {
  try {
    await EmployeeOfTheMonth.findOne()
      .then((data: any) => res.status(200).json(data))
      .catch((err: any) => res.status(400).json('Failed to get employee of the month: ' + err));
  } catch (err: any) {
    res.status(500).json(msgCatchError);
  }
});

router.put('/', requireJwtAuth, checkIsInRole(Role.Admin), registerEmployeeOfTheMonthEdit, validateInput, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const previousEmployeeOfTheMonth = await EmployeeOfTheMonth.findOne();
    deleteUploadedImage(previousEmployeeOfTheMonth.imgPath);
    const { name, department, description } = JSON.parse(req.body.document);
    let imgPath: string = '';
    if (req.file) {
      imgPath = req.file.path.replace(/\\/g, '/');
    }
    const updatedEmployeeOfTheMonth = {
      name: name,
      department: department,
      description: description,
      imgPath: imgPath
    };
    await EmployeeOfTheMonth.findByIdAndUpdate({ _id: previousEmployeeOfTheMonth._id }, { $set: updatedEmployeeOfTheMonth }, { new: true })
      .then((data: any) => res.status(201).json(data))
      .catch((err: any) => res.status(400).json('Failed to update: ' + err));
  } catch (err: any) {
    res.status(500).json(msgCatchError);
  }
});

export default router;
