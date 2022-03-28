import { Router, Request, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import CaseStudy from '../../models/caseStudies';
import { checkIsInRole } from '../../utils/authUtils';
import { Role } from '../../models/user';
import { registerCaseStudiesCreate } from '../../schema/registerCaseStudies';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import httpErrorMiddleware from 'middleware/httpErrorHandler';
import { HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError } from 'exceptions/httpException';

const router = Router();

const setFeatured = (flag: boolean): object => {
  return { featured: flag };
};

router.get('/', requireJwtAuth, async (req: Request, res: Response) => {
    await CaseStudy.find()
      .populate('user')
      .then((data: any) => res.status(HTTP_OK_CODE).json(data))
      .catch((err: any) => {throw new InternalError(`Failed to get case studies: ${err}`)});
}, httpErrorMiddleware);

router.get('/featured', requireJwtAuth, async (req: Request, res: Response) => {
    await CaseStudy.findOne(setFeatured(true))
      .populate('user')
      .then((data: any) => res.status(HTTP_OK_CODE).json(data))
      .catch((err: any) => {throw new InternalError(`Failed to get featured case study: ${err}`)});
}, httpErrorMiddleware);

router.get('/:id', requireJwtAuth, async (req: Request, res: Response) => {
    await CaseStudy.findById(req.params.id)
      .populate('user')
      .then((data: any) => res.status(HTTP_OK_CODE).json(data))
      .catch((err: any) => {throw new InternalError(`Failed to get case study id ${req.params.id}: ${err}`)});
}, httpErrorMiddleware);

router.post('/', 
    requireJwtAuth, registerCaseStudiesCreate, 
    validateInput, upload.single('file'), 
    async (req: any, res: Response) => {

    const { caseStudyType, patientStory, staffRecognition, trainingSession, equipmentReceived, otherStory } = JSON.parse(req.body.document);
    const user = req.user.id;
    const userDepartment = req.user.department;
    let imgPath: string = '';
    if (req.file) {
      imgPath = req.file.path.replace(/\\/g, '/');
    }
    const featured: boolean = ((await CaseStudy.estimatedDocumentCount()) as number) === 0;
    const newCaseStudy = new CaseStudy({
      caseStudyType,
      user,
      userDepartment,
      patientStory,
      staffRecognition,
      trainingSession,
      equipmentReceived,
      otherStory,
      imgPath,
      featured
    });
    await newCaseStudy
      .save()
      .then(() => res.status(201).json('Case Study Submitted successfully'))
      .catch((err: any) => { throw new InternalError(`Case study submission failed: ${err}`)});

}, httpErrorMiddleware);

router.delete('/:id', requireJwtAuth, checkIsInRole(Role.Admin, Role.MedicalDirector), async (req: Request, res: Response) => {
    CaseStudy.findByIdAndRemove(req.params.id)
      .then((data: any) => deleteUploadedImage(data.imgPath))
      .then(() => res.sendStatus(204))
      .catch((err: any) => {throw new InternalError(`Delete case study id ${req.params.id} failed: ${err}`)});

}, httpErrorMiddleware);

router.put('/:id',
  requireJwtAuth,
  registerCaseStudiesCreate,
  validateInput,
  upload.single('file'),
  checkIsInRole(Role.Admin, Role.MedicalDirector),
  async (req, res, next: NextFunction) => {
    const { caseStudyType, patientStory, staffRecognition, trainingSession, equipmentReceived, otherStory } = JSON.parse(req.body.document);
    const oldCaseStudy = await CaseStudy.findById(req.params.id);
    let imgPath = oldCaseStudy.imgPath;
    let user = req.user.id;
    let userDepartment = user.department;
    if (req.file) {
    imgPath = req.file.path.replace(/\\/g, '/');
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
        .then((data: any) => res.status(HTTP_NOCONTENT_CODE).json(data))
        .catch((err: any) => {throw new InternalError(`Failed to update case study id ${req.params.id}: ${err}`)});
  }, 
  httpErrorMiddleware
);

router.patch('/:id', requireJwtAuth, checkIsInRole(Role.Admin, Role.MedicalDirector), async (req: Request, res: Response, next: NextFunction) => {
    const prevFeaturedCaseStudy = await CaseStudy.findOne(setFeatured(true));
    if ((prevFeaturedCaseStudy._id as string) === req.params.id) {
        res.status(HTTP_NOCONTENT_CODE).json({ message: 'Case study is already featured' });
        return;
    }

    await CaseStudy.findByIdAndUpdate(prevFeaturedCaseStudy._id, { $set: setFeatured(false) })
        .catch((err: any) => { throw new InternalError(`Failed to unfeature previous case study: ${err}`)});

    await CaseStudy.findByIdAndUpdate(req.params.id, { $set: setFeatured(true) }, { new: true })
        .then((data: any) => res.status(HTTP_NOCONTENT_CODE).json(data))
        .catch((err: any) => { throw new InternalError(`Failed to feature the new case study: ${err}`)});
}, httpErrorMiddleware);

export default router;
