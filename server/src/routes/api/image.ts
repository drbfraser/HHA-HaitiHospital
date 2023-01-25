import { HTTP_OK_CODE } from 'exceptions/httpException';
import { Router, Response, NextFunction } from 'express';
import { RequestWithUser } from 'utils/definitions/express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
const path = require('path');

const router = Router();

router.get(
  '/:imgPath',
  requireJwtAuth,
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    const imgPath: string = req.params.imgPath;
    res.status(HTTP_OK_CODE).sendFile(path.join(__dirname, `../../../public/images/${imgPath}`));
  },
);

export default router;
