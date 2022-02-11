import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import CaseStudy from '../../models/caseStudies';
import { checkIsInRole } from '../../utils/authUtils';
import { Role } from '../../models/user';
import { registerCaseStudiesCreate } from '../../schema/registerCaseStudies';

const router = Router();

router.get('/', requireJwtAuth, async (req: Request, res: Response) => {
  try {
    await CaseStudy.find()
      .populate('user')
      .then((data: any) => res.status(200).json(data))
      .catch((err: any) => res.status(400).json('Failed to get case studies: ' + err));
  } catch (err: any) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', requireJwtAuth, async (req: Request, res: Response) => {
  try {
    await CaseStudy.findById(req.params.id)
      .populate('user')
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(400).json('Failed to get case study: ' + err));
  } catch (err: any) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, registerCaseStudiesCreate, validateInput, upload.single('file'), async (req: any, res: Response) => {
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
    await newCaseStudy
      .save()
      .then(() => res.status(201).json('Case Study Submitted successfully'))
      .catch((err: any) => res.status(400).json('Case study submission failed: ' + err));
  } catch (err: any) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, checkIsInRole(Role.Admin, Role.MedicalDirector), async (req: Request, res: Response) => {
  try {
    await CaseStudy.findByIdAndRemove(req.params.id)
      .then((data: any) => res.status(204).json(data))
      .catch((err: any) => res.status(400).json('Failed to delete: ' + err));
  } catch (err: any) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, registerCaseStudiesCreate, validateInput, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
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

    await CaseStudy.findByIdAndUpdate(req.params.id, { $set: updatedCaseStudy }, { new: true })
      .then((data: any) => res.status(201).json(data))
      .catch((err: any) => res.status(400).json('Failed to update: ' + err));
  } catch (err: any) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
