import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Department from '../../models/departments';
import { updateDepartmentPoints } from '../../utils/leaderboardUtils';
import { HTTP_OK_CODE } from 'exceptions/httpException';

const router = Router();

router.get('/', requireJwtAuth, async (req: Request, res: Response, next: NextFunction) => {
    await updateDepartmentPoints();
    const leaders = await Department.find().sort({ points: 'desc', name: 'asc' });
    res.status(HTTP_OK_CODE).json(leaders);
});

export default router;
