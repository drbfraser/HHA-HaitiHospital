import { Router, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import CaseStudy from '../../models/caseStudies';
import { Role } from '../../models/user';
import { registerCaseStudiesCreate } from '../../schema/registerCaseStudies';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import { HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { roleAuth } from 'middleware/roleAuth';
import { RequestWithUser } from 'utils/definitions/express';

const router = Router();

const setFeatured = (flag: boolean): object => {
  return { featured: flag };
};

router.get('/', requireJwtAuth, (req: RequestWithUser, res: Response, next: NextFunction) => {
    CaseStudy.find().populate('user').exec()
      .then((data: []) => res.status(HTTP_OK_CODE).json(data))
      .catch((err: any) => next(new InternalError(`Failed to get case studies: ${err}`)));
});

router.get('/featured', requireJwtAuth, (req: RequestWithUser, res: Response, next: NextFunction) => {
    CaseStudy.findOne(setFeatured(true)).populate('user').exec()
      .then((data: any) => res.status(HTTP_OK_CODE).json(data))
      .catch((err: any) => next(new InternalError(`Failed to get featured case study: ${err}`)));
});

router.get('/:id', requireJwtAuth, (req: RequestWithUser, res: Response, next: NextFunction) => {
    const caseId = req.params.id;
    CaseStudy.findById(caseId).populate('user').exec()
      .then((data: any) => {
          if (!data) {
             return next(new NotFound(`Case study with id ${caseId} not available`));
          }
          res.status(HTTP_OK_CODE).json(data);
        })
      .catch((err: any) => next(new InternalError(`Failed to get case study id ${caseId}: ${err}`)));
});

router.post('/', 
    requireJwtAuth, registerCaseStudiesCreate, 
    validateInput, upload.single('file'), 
    async (req: RequestWithUser, res: Response, next: NextFunction) => {

    try {
    const { caseStudyType, patientStory, staffRecognition, trainingSession, equipmentReceived, otherStory } = JSON.parse(req.body.document);
    const user = req.user;
    const userId = user._id!;
    const userDepartment = user.department;
    let imgPath: string = '';
    if (req.file) {
      imgPath = req.file.path.replace(/\\/g, '/');
    }
    const featured: boolean = ((await CaseStudy.estimatedDocumentCount()) as number) === 0;
    const newCaseStudy = new CaseStudy({
      caseStudyType,
      user: userId,
      userDepartment,
      patientStory,
      staffRecognition,
      trainingSession,
      equipmentReceived,
      otherStory,
      imgPath,
      featured
    });
    newCaseStudy.save()
      .then(() => res.status(HTTP_CREATED_CODE).json('Case Study Submitted successfully'))
      .catch((err: any) => { throw new InternalError(`Case study submission failed: ${err}`)});

    } catch (e) {
        return next(e);
    }
});

router.delete('/:id', requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), (req: RequestWithUser, res: Response, next: NextFunction) => {

    const caseId = req.params.id;
    CaseStudy.findByIdAndRemove(caseId).exec()
      .then((data: any) => {
        if (!data) {
            return next(new NotFound(`No case study with id ${caseId} found`));
        }

        return deleteUploadedImage(data.imgPath);
      })
      .then(() => res.sendStatus(HTTP_NOCONTENT_CODE))
      .catch((err: any) => next(new InternalError(`Delete case study id ${caseId} failed: ${err}`)));

});

router.put('/:id',
  requireJwtAuth,
  registerCaseStudiesCreate,
  validateInput,
  upload.single('file'),
  roleAuth(Role.Admin, Role.MedicalDirector),
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

    const { caseStudyType, patientStory, staffRecognition, trainingSession, equipmentReceived, otherStory } = JSON.parse(req.body.document);
    const oldCaseStudy = await CaseStudy.findById(req.params.id);
    let imgPath = oldCaseStudy.imgPath;
    const user = req.user;
    const userId = req.user._id!;
    const userDepartment = user.department;
    if (req.file) {
        imgPath = req.file.path.replace(/\\/g, '/');
    }

    const updatedCaseStudy = {
    caseStudyType: caseStudyType,
    user: userId,
    userDepartment: userDepartment,
    patientStory: patientStory,
    staffRecognition: staffRecognition,
    trainingSession: trainingSession,
    equipmentReceived: equipmentReceived,
    otherStory: otherStory,
    imgPath: imgPath
    };
    Object.keys(updatedCaseStudy).forEach((k) => (!updatedCaseStudy[k] || updatedCaseStudy[k] === undefined) && delete updatedCaseStudy[k]);

    CaseStudy.findByIdAndUpdate(req.params.id, { $set: updatedCaseStudy }, { new: true }).exec()
        .then((data: any) => res.status(HTTP_OK_CODE).json(data))
        .catch((err: any) => {throw new InternalError(`Failed to update case study id ${req.params.id}: ${err}`)});

    } catch (e) { next(e); }
  });

// Set feature case study
router.patch('/:id', requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

    const prevFeaturedCaseStudy = await CaseStudy.findOne(setFeatured(true));
    if ((prevFeaturedCaseStudy._id as string) === req.params.id) {
        return res.status(HTTP_NOCONTENT_CODE).send();
    }

    CaseStudy.findByIdAndUpdate(prevFeaturedCaseStudy._id, { $set: setFeatured(false) }).exec()
        .catch((err: any) => next(new InternalError(`Failed to unfeature previous case study: ${err}`)));

    CaseStudy.findByIdAndUpdate(req.params.id, { $set: setFeatured(true) }, { new: true }).exec()
        .then((data: any) => res.status(HTTP_OK_CODE).json(data))
        .catch((err: any) => next(new InternalError(`Failed to feature the new case study: ${err}`)));

    } catch (e) {
        next(e);
    }
});

export default router;
