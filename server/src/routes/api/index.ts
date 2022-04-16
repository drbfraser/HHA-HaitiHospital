import { Router } from 'express';
import usersRoutes from './user';
import newReportRoutes from './report';
import messageBoardRoutes from './messageBoard';
import caseStudiesRoutes from './caseStudies';
import leaderboardRoutes from './leaderboard';
import biomechRoutes from './bioMech';
import imageRoutes from './image';
import authRoutes from './authentication';
import employeeOfTheMonthRoutes from './employeeOfTheMonth';
import templateRoutes from './report_template';
import departmentRoutes from './departments';
import messageBoardCommentRoutes from './messageBoardComment';

const router = Router();

router.use('/users', usersRoutes);
router.use('/case-studies', caseStudiesRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/biomech', biomechRoutes);
router.use('/auth', authRoutes);
router.use('/report', newReportRoutes);
router.use('/image', imageRoutes);
router.use('/message-board', messageBoardRoutes);
router.use('/employee-of-the-month', employeeOfTheMonthRoutes);
router.use('/template', templateRoutes);
router.use('/department', departmentRoutes);
router.use('/message-board/comments/', messageBoardCommentRoutes);

export default router;
