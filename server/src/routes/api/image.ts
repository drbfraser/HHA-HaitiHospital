import { HTTP_OK_CODE } from 'exceptions/httpException';
import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
const path = require('path');

const router = Router();

router.get('/:imgPath', requireJwtAuth, async (req: Request, res: Response, next: NextFunction) => {
  const imgPath: string = req.params.imgPath;
  res.status(HTTP_OK_CODE).sendFile(path.join(__dirname, `../../../public/images/${imgPath}`));
});

export default router;
