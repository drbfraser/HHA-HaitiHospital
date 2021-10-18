import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import nicuPaedsRoutes from './nicuPaeds';
const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/nicupaeds', nicuPaedsRoutes);

export default router;
