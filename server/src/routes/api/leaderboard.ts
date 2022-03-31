import { Router, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Department from '../../models/departments';
import { updateDepartmentPoints } from '../../utils/leaderboardUtils';
import { HTTP_OK_CODE } from 'exceptions/httpException';
import { RequestWithUser } from 'utils/definitions/express';

const router = Router();

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

    await updateDepartmentPoints();
    const leaders = await Department.find().sort({ points: 'desc', name: 'asc' });
    res.status(HTTP_OK_CODE).json(leaders);
    
    } catch (e) { next(e); }
});

export default router;
