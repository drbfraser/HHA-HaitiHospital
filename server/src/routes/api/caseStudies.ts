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

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const postDocs = await CaseStudyModel.find();
    const jsonPosts = await Promise.all(postDocs.map((post) => post.toJson()));
    res.status(HTTP_OK_CODE).json(jsonPosts);
  } catch (e) {
    next(e);
  }
});

router.get('/featured', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const postDoc = await CaseStudyModel.findOne({ featured: true });
    if (!postDoc) {
      return res.sendStatus(HTTP_NOCONTENT_CODE);
    }
    const jsonPost = await postDoc.toJson();
    res.status(HTTP_OK_CODE).json(jsonPost);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const caseId = req.params.id;
    const postDoc = await CaseStudyModel.findById(caseId);
    if (!postDoc) {
      throw new NotFound(`No case study with id ${caseId} available`);
    }
    const postJson = await postDoc.toJson();
    res.status(HTTP_OK_CODE).json(postJson);
  } catch (e) {
    next(e);
  }
});

router.post('/', requireJwtAuth, registerCaseStudiesCreate, validateInput, upload.single('file'), async (req: RequestWithUser, res: Response, next: NextFunction) => {
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
      userId: userId,
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

    newCaseStudyDoc
      .save()
      .then(() => res.status(HTTP_CREATED_CODE).send('Case Study Submitted successfully'))
      .catch((err: any) => {
        throw new InternalError(`Case study submission failed: ${err}`);
      });
  } catch (e) {
    return next(e);
  }
});

router.delete('/:id', requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), (req: RequestWithUser, res: Response, next: NextFunction) => {
  const caseId = req.params.id;
  CaseStudyModel.findByIdAndRemove(caseId)
    .exec()
    .then((data: any) => {
      if (!data) {
        return next(new NotFound(`No case study with id ${caseId} found`));
      }

      return deleteUploadedImage(data.imgPath);
    })
    .then(() => res.sendStatus(HTTP_NOCONTENT_CODE))
    .catch((err: any) => next(new InternalError(`Delete case study id ${caseId} failed: ${err}`)));
});

// Set feature case study
router.patch('/:id', requireJwtAuth, roleAuth(Role.Admin, Role.MedicalDirector), async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const prevFeaturedCaseStudy = await CaseStudyModel.findOne({ featured: true });
    if ((prevFeaturedCaseStudy!._id as string) === req.params.id) {
      return res.status(HTTP_NOCONTENT_CODE).send();
    }

    CaseStudyModel.findByIdAndUpdate(prevFeaturedCaseStudy!._id, { $set: setFeatured(false) })
      .exec()
      .catch((err: any) => next(new InternalError(`Failed to unfeature previous case study: ${err}`)));

    CaseStudyModel.findByIdAndUpdate(req.params.id, { $set: { featured: true } }, { new: true })
      .exec()
      .then((data) => res.status(HTTP_OK_CODE).json(data!.toJson()))
      .catch((err: any) => next(new InternalError(`Failed to feature the new case study: ${err}`)));
  } catch (e) {
    next(e);
  }
});

export default router;
