import { Router } from 'express';
import localAuthRoutes from './api/localAuth';
import apiRoutes from './api';
const router = Router();

router.use('/api', apiRoutes);
router.use('/api/auth', localAuthRoutes);
router.use('/api', (req, res) => res.status(404).json('No route for this path'));

export default router;
