import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import nicuPaedsRoutes from './nicuPaeds';
import reportRouter from './report';
import messageBoardRoutes from './messageboard';
import caseStudiesRouter from './caseStudies';
import leaderboardRouter from './leaderboard';
import biomechRouter from './bioMech';
const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/nicupaeds', nicuPaedsRoutes);
router.use('/report', reportRouter);
router.use('/caseStudies', caseStudiesRouter);
router.use('/leaderboard', leaderboardRouter);
router.use('/biomech', biomechRouter);

//TODO: Might have to change messageBoard routing based on dashboard and where it needs to go
router.use('/messageBoard', messageBoardRoutes);

export default router;
