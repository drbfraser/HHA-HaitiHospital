import { Router } from 'express';
import usersRoutes from './users';
import messagesRoutes from './messages';
import NICUPaedsRouter from './nicuPaeds';
const router = Router();

router.use('/users', usersRoutes);
router.use('/messages', messagesRoutes);
router.use('/NicuPaeds',NICUPaedsRouter);

export default router;
