import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import EmployeeOfTheMonth from 'models/employeeOfTheMonth';
import { checkIsInRole } from '../../utils/authUtils';
import { Role } from '../../models/user';
// import { registerEmployeeOfTheMonthEdit } from '../../schema/registerEmployeeOfTheMonth';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import { msgCatchError } from 'utils/sanitizationMessages';
import CaseStudy from 'models/caseStudies';

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

export default router;
