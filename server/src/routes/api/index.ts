import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import nicuPaedsRoutes from './nicuPaeds';
import reportRouter from './report';
import messageBoardRoutes from './messageBoard';
const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/nicupaeds', nicuPaedsRoutes);
router.use('/report',reportRouter);

//TODO: Might have to change messageBoard routing based on dashboard and where it needs to go
router.use('/messageBoard',messageBoardRoutes);

export default router;
