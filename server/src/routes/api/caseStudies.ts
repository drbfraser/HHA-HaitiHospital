import { Router, Request, Response, NextFunction } from 'express';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';

import CaseStudy from '../../models/CaseStudies';
import { checkIsInRole } from '../../utils/authUtils';
import { Role } from '../../models/User';

const router = Router();

router.get('/', async (req, res) => {
  try {
    CaseStudy.find()
      .populate('user')
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json('Failed to get case studies: ' + err));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    CaseStudy.findById(req.params.id)
      .populate('user')
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json('Failed to get case study: ' + err));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', [requireJwtAuth, upload.single('file')], async (req, res) => {
  try {
    const { caseStudyType, patientStory, staffRecognition, trainingSession, equipmentReceived, otherStory } = JSON.parse(req.body.document);
    const user = req.user.id;
    const userDepartment = req.user.department;
    let imgPath: string;
    if (req.file) {
      imgPath = req.file.path;
    }
    const newCaseStudy = new CaseStudy({
      caseStudyType,
      user,
      userDepartment,
      patientStory,
      staffRecognition,
      trainingSession,
      equipmentReceived,
      otherStory,
      imgPath
    });
    newCaseStudy
      .save()
      .then(() => res.json('Case Study Submitted successfully'))
      .catch((err) => res.status(400).json('Case study submission failed: ' + err));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, checkIsInRole(Role.Admin, Role.MedicalDirector), async (req, res) => {
  try {
    CaseStudy.findByIdAndRemove(req.params.id)
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json('Failed to delete: ' + err));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', [requireJwtAuth, upload.single('file')], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { caseStudyType, patientStory, staffRecognition, trainingSession, equipmentReceived, otherStory } = JSON.parse(req.body.document);
    const oldCaseStudy = await CaseStudy.findById(req.params.id);
    let imgPath = oldCaseStudy.imgPath;
    let user = oldCaseStudy.user;
    let userDepartment = oldCaseStudy.userDepartment;
    if (req.file) {
      imgPath = req.file.path;
    }

    const updatedCaseStudy = {
      caseStudyType: caseStudyType,
      user: user,
      userDepartment: userDepartment,
      patientStory: patientStory,
      staffRecognition: staffRecognition,
      trainingSession: trainingSession,
      equipmentReceived: equipmentReceived,
      otherStory: otherStory,
      imgPath: imgPath
    };
    Object.keys(updatedCaseStudy).forEach((k) => (!updatedCaseStudy[k] || updatedCaseStudy[k] === undefined) && delete updatedCaseStudy[k]);

    CaseStudy.findByIdAndUpdate(req.params.id, { $set: updatedCaseStudy }, { new: true })
      .then((data) => res.json(data))
      .catch((err) => res.status(400).json('Failed to update: ' + err));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
