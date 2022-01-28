import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Department from '../../models/Leaderboard';
import { updateDepartmentPoints } from '../../utils/leaderboard-utils';

const router = Router();

router.get('/', requireJwtAuth, async (req: Request, res: Response) => {
  try {
    await updateDepartmentPoints();
    const leaders = await Department.find().sort({ points: 'desc', name: 'asc' });
    res.status(200).json(leaders);
  } catch (err: any) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
