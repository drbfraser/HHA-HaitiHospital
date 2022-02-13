import { Router } from 'express';
import usersRoutes from './user';
import nicuPaedsRoutes from './nicuPaeds';
import reportRouter from './report';
import newReportRoutes from './dynamicReport';
import messageBoardRoutes from './messageBoard';
import caseStudiesRouter from './caseStudies';
import leaderboardRouter from './leaderboard';
import biomechRouter from './bioMech';
import authRoutes from './localAuth';

const router = Router();

router.use('/users', usersRoutes);
router.use('/nicupaeds', nicuPaedsRoutes);
router.use('/report', reportRouter);
router.use('/case-studies', caseStudiesRouter);
router.use('/leaderboard', leaderboardRouter);
router.use('/biomech', biomechRouter);
router.use('/auth', authRoutes);
router.use('/new-report', newReportRoutes);

//TODO: Might have to change messageBoard routing based on dashboard and where it needs to go
router.use('/message-board', messageBoardRoutes);

export default router;
