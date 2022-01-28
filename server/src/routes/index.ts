import { Router } from 'express';
import localAuthRoutes from './localAuth';
import apiRoutes from './api';
const router = Router();

router.use('/auth', localAuthRoutes);
router.use('/api', apiRoutes);
router.use('/api', (req, res) => res.status(404).json('No route for this path'));

export default router;
