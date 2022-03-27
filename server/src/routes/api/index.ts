import { Router } from 'express';
import usersRoutes from './user';
import nicuPaedsRoutes from './nicuPaeds';
import reportRoutes from './report';
import newReportRoutes from './dynamicReport';
import messageBoardRoutes from './messageBoard';
import caseStudiesRoutes from './caseStudies';
import leaderboardRoutes from './leaderboard';
import biomechRoutes from './bioMech';
import imageRoutes from './image';
import authRoutes from './localAuth';
import employeeOfTheMonthRoutes from './employeeOfTheMonth';
import templateRoutes from './report_template';

const router = Router();

router.use('/users', usersRoutes);
router.use('/nicupaeds', nicuPaedsRoutes);
router.use('/report', reportRoutes);
router.use('/case-studies', caseStudiesRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/biomech', biomechRoutes);
router.use('/auth', authRoutes);
router.use('/new-report', newReportRoutes);
router.use('/image', imageRoutes);
//TODO: Might have to change messageBoard routing based on dashboard and where it needs to go
router.use('/message-board', messageBoardRoutes);
router.use('/employee-of-the-month', employeeOfTheMonthRoutes);
router.use('/template', templateRoutes);

export default router;
