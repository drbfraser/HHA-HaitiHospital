import { Router, Request, Response, NextFunction } from 'express';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';

import CaseStudy from '../../models/CaseStudies';

const router = Router();

router.get('/', async (req, res) => {
    try {
        await CaseStudy.find().then(data => res.json(data));
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        await CaseStudy.findById(req.params.id).then(data => res.json(data));
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

router.post('/', upload.single("file"), async (req, res) => {
    try {
        const { caseStudyType, patientStory, staffRecognition, trainingSession, equipmentReceived, otherStory } = req.body;
        // const createdByUser = req.user;
        let imgPath = null;
        if (req.file) {
            imgPath = req.file.path;
        }
        const newCaseStudy = new CaseStudy({
            caseStudyType,
            // createdByUser,
            patientStory,
            staffRecognition,
            trainingSession,
            equipmentReceived,
            otherStory,
            imgPath
        });
        newCaseStudy.save()
            .then(() => res.json("Case study submmitted successfully"))
            .catch(err => res.status(400).json('Case study submission failed: ' + err));
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const caseStudy = await CaseStudy.findByIdAndRemove(req.params.id);
        res.status(200).json({ caseStudy });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

router.put('/:id', upload.single("file"), async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { caseStudyType, patientStory, staffRecognition, trainingSession, equipmentReceived, otherStory } = req.body;
        let imgPath = null;
        if (req.file) {
            imgPath = req.file.path;
        }
        const updatedCaseStudy = new CaseStudy({
            caseStudyType,
            patientStory,
            staffRecognition,
            trainingSession,
            equipmentReceived,
            otherStory,
            imgPath
        }); 
        const caseStudy = await CaseStudy.findByIdAndUpdate(req.params.id, updatedCaseStudy, { new: true });
        res.status(200).json({ caseStudy });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

export default router;
