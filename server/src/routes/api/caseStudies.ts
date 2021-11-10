import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { resolve } from 'path';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import CaseStudy from '../../models/CaseStudies';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, `case-study-${Date.now()}-${fileName}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});

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
        if (!req.file) {
            return res.send("you must select a file.");
        }
        const img = req.file.filename;
        const newCaseStudy = new CaseStudy({
            caseStudyType,
            // createdByUser,
            patientStory,
            staffRecognition,
            trainingSession,
            equipmentReceived,
            otherStory,
            img
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

router.put('/:id', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { caseStudyType, patientStory, staffRecognition, trainingSession, equipmentReceived, otherStory } = req.body;
        const updatedCaseStudy = new CaseStudy({
            caseStudyType,
            patientStory,
            staffRecognition,
            trainingSession,
            equipmentReceived,
            otherStory
        }); 
        const caseStudy = await CaseStudy.findByIdAndUpdate(req.params.id, updatedCaseStudy, { new: true });
        res.status(200).json({ caseStudy });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

export default router;
