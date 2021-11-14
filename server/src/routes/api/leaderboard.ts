import { Router, Request, Response, NextFunction } from 'express';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import Department from '../../models/Leaderboard';
import { updateDepartmentPoints } from '../../utils/leaderboard-utils'

const router = Router();

router.get('/', async (req, res) => {
    try {
        await updateDepartmentPoints();
        Department.find()
            .then(data => res.json(data))
            .catch(err => res.status(400).json('Failed to get leaderboard: ' + err));
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

export default router;