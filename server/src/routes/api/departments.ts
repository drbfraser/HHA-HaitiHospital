import { Router, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import DepartmentCollection, { DepartmentJson } from '../../models/departments';
import { HTTP_OK_CODE, NotFound } from '../../exceptions/httpException';
import { RequestWithUser } from '../../utils/definitions/express';

const router = Router();

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const docs = await DepartmentCollection.find();
    const jsons: DepartmentJson[] = await Promise.all(docs.map((dept) => dept.toJson()));
    res.status(HTTP_OK_CODE).json(jsons);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const deptId: string = req.params.id;
    const doc = await DepartmentCollection.findById(deptId);
    if (!doc) {
      throw new NotFound(`No department with id ${deptId} found`);
    }
    const json: DepartmentJson = await doc.toJson();
    res.status(HTTP_OK_CODE).json(json);
  } catch (e) {
    next(e);
  }
});

export default router;
