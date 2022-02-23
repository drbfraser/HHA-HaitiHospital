import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
const path = require('path');

const router = Router();

router.get('/:imgPath', requireJwtAuth, async (req: Request, res: Response, next: NextFunction) => {
  const imgPath: string = req.params.imgPath;
  try {
    res.status(200).sendFile(path.join(__dirname, `../../../public/images/${imgPath}`));
  } catch (err: any) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
