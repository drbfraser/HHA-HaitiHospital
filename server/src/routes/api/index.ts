import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import nicuPaedsRoutes from './nicuPaeds';
import reportRouter from './report';
const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/nicupaeds', nicuPaedsRoutes);
router.use('/report',reportRouter);
export default router;
