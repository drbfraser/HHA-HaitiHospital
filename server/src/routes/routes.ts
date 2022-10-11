import { NotFound } from '../../src/exceptions/httpException';
import { Router } from 'express';
import apiRoutes from './api';
const router = Router();

router.use('/api', apiRoutes);
router.use('/api', (req, res) => {
  throw new NotFound(`No route for this path`);
});

export default router;
