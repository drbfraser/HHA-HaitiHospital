import { Router, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import CaseStudyModel, { CaseStudy } from '../../models/caseStudies';
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
    CaseStudyModel.find().exec()
      .then((stories) => {
          const jsons = stories.map((story) => story.toJson());
          res.status(HTTP_OK_CODE).json(jsons);
      })
      .catch((err: any) => next(new InternalError(`Failed to get case studies: ${err}`)));
});

router.get('/featured', requireJwtAuth, (req: RequestWithUser, res: Response, next: NextFunction) => {
    CaseStudyModel.findOne(setFeatured(true)).populate('user').exec()
      .then((data) => {
          if (!data) {
            return res.sendStatus(HTTP_NOCONTENT_CODE);
          }
          res.status(HTTP_OK_CODE).json(data.toJson())
        })
      .catch((err: any) => next(new InternalError(`Failed to get featured case study: ${err}`)));
});

router.get('/:id', requireJwtAuth, (req: RequestWithUser, res: Response, next: NextFunction) => {
    const caseId = req.params.id;
    CaseStudyModel.findById(caseId).populate('user').exec()
      .then((data: any) => {
          if (!data) {
             return next(new NotFound(`Case study with id ${caseId} not available`));
          }
          res.status(HTTP_OK_CODE).json(data.toJson());
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
    const userDepartment = user.departmentId;
    let imgPath: string = '';
    if (req.file) {
      imgPath = req.file.path.replace(/\\/g, '/');
    }
    const featured: boolean = ((await CaseStudyModel.estimatedDocumentCount()) as number) === 0;
    const newCaseStudy: CaseStudy = {
        caseStudyType: caseStudyType,
        user: userId,
        departmentId: userDepartment,
        patientStory: patientStory,
        staffRecognition: staffRecognition,
        trainingSession: trainingSession,
        equipmentReceived: equipmentReceived,
        otherStory: otherStory,
        imgPath: imgPath,
        featured: featured,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const newCaseStudyDoc = new CaseStudyModel(newCaseStudy);

    newCaseStudyDoc.save()
      .then(() => res.status(HTTP_CREATED_CODE).send('Case Study Submitted successfully'))
      .catch((err: any) => { throw new InternalError(`Case study submission failed: ${err}`)});

    } catch (e) {
        return next(e);
    }
});

router.delete('/:id', requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), (req: RequestWithUser, res: Response, next: NextFunction) => {

    const caseId = req.params.id;
    CaseStudyModel.findByIdAndRemove(caseId).exec()
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
    const oldCaseStudy = await CaseStudyModel.findById(req.params.id);
    const user = req.user;
    const userId = req.user._id!;
    const userDepartment = user.departmentId;
    let imgPath = oldCaseStudy? oldCaseStudy.imgPath : "";
    if (req.file) {
        if (oldCaseStudy) {
            deleteUploadedImage(oldCaseStudy.imgPath);
        }
        imgPath = req.file.path.replace(/\\/g, '/');
    }

    const updatedCaseStudy: CaseStudy = {
        caseStudyType: caseStudyType,
        user: userId,
        departmentId: userDepartment,
        patientStory: patientStory,
        staffRecognition: staffRecognition,
        trainingSession: trainingSession,
        equipmentReceived: equipmentReceived,
        otherStory: otherStory,
        imgPath: imgPath,
        updatedAt: new Date(),
        createdAt: oldCaseStudy ? oldCaseStudy.createdAt : new Date(),
        featured: oldCaseStudy? oldCaseStudy.featured: false
    };

    Object.keys(updatedCaseStudy).forEach((k) => (!updatedCaseStudy[k] || updatedCaseStudy[k] === undefined) && delete updatedCaseStudy[k]);

    CaseStudyModel.findByIdAndUpdate(req.params.id, { $set: updatedCaseStudy }, { new: true }).exec()
        .then((data) => {
            if (!data) {
                return res.sendStatus(HTTP_CREATED_CODE);
            }
            res.sendStatus(HTTP_OK_CODE);
        })
        .catch((err: any) => {throw new InternalError(`Failed to update case study id ${req.params.id}: ${err}`)});

    } catch (e) { next(e); }
  }
);

// Set feature case study
router.patch('/:id', requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

    const prevFeaturedCaseStudy = await CaseStudyModel.findOne({featured: true});
    if ((prevFeaturedCaseStudy!._id as string) === req.params.id) {
        return res.status(HTTP_NOCONTENT_CODE).send();
    }

    CaseStudyModel.findByIdAndUpdate(prevFeaturedCaseStudy!._id, { $set: setFeatured(false) }).exec()
        .catch((err: any) => next(new InternalError(`Failed to unfeature previous case study: ${err}`)));

    CaseStudyModel.findByIdAndUpdate(req.params.id, { $set: {featured: true}}, { new: true }).exec()
        .then((data) => res.status(HTTP_OK_CODE).json(data!.toJson()))
        .catch((err: any) => next(new InternalError(`Failed to feature the new case study: ${err}`)));

    } catch (e) {
        next(e);
    }
});

export default router;
