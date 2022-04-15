import { Router, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { HTTP_OK_CODE } from 'exceptions/httpException';
import { RequestWithUser } from 'utils/definitions/express';
import { DefaultDepartments } from 'utils/departments';
import Department, { LeaderboardJson } from 'models/departments';

const router = Router();
const POINTS_PER_CASE_STUDY: number = 10;

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    // Find all departments except for General
    const departments = await Department.find({ name: { $ne: DefaultDepartments.General } });
    const leaderboardJson: LeaderboardJson[] = await Promise.all(departments.map(async (dept) => await dept.toLeaderboard(POINTS_PER_CASE_STUDY)));

    // Return sorted leaderboard by points (Highest to lowest)
    res.status(HTTP_OK_CODE).json(leaderboardJson.sort((deptFormer, deptLatter) => (deptFormer.points > deptLatter.points ? 1 : -1)).reverse());
  } catch (e) {
    next(e);
  }
});

export default router;
