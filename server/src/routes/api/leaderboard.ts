import { Router, Request, Response, NextFunction } from 'express';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import CaseStudy from '../../models/CaseStudies';
import Leader, { updateLeaderboard } from '../../models/Leader';

const router = Router();

router.get('/', async (req, res) => {
    try {
        updateLeaderboard();
        Leader.find()
            .then(data => res.json(data))
            .catch(err => res.status(400).json('Failed to get leaderboard: ' + err));
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

export default router;

        // var pointsNicuPaeds = 0;
        // await CaseStudy.find({ userDepartment: 0 }).exec(function (err, results) {
        //     var count = results.length;
        //     pointsNicuPaeds += count;
        // });
        // var pointsMaternity = 0;
        // await CaseStudy.find({ userDepartment: 1 }).exec(function (err, results) {
        //     var count = results.length;
        //     pointsMaternity += count;
        // });
        // var pointsRehab = 0;
        // await CaseStudy.find({ userDepartment: 2 }).exec(function (err, results) {
        //     var count = results.length;
        //     pointsRehab += count;
        // });
        // var pointsCommunity = 0;
        // await CaseStudy.find({ userDepartment: 3 }).exec(function (err, results) {
        //     var count = results.length;
        //     pointsCommunity += count;
        // });
        // var data = {
        //     nicuPaeds: pointsNicuPaeds,
        //     maternity: pointsMaternity,
        //     rehab: pointsRehab,
        //     community: pointsCommunity,
        // }
        // await res.json(data);
        // // await CaseStudy.find().then(data => res.json(data));