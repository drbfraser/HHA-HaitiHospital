import {
  BadRequest,
  HTTP_CREATED_CODE,
  HTTP_NOCONTENT_CODE,
  HTTP_OK_CODE,
  InternalError,
  NotFound,
} from 'exceptions/httpException';
import BioMechCollection, { BioMech } from 'models/bioMech';
import { Request, NextFunction, Response, Router } from 'express';

import { BiomechApiIn } from './jsons/biomech';
import { ImageUploader } from 'middleware/multer';
import { Biomech as InputSchema } from 'sanitization/schemas/biomech';
import { Role, User } from 'models/user';
import { deleteUploadedImage } from 'utils/unlinkImage';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { roleAuth } from 'middleware/roleAuth';
import { validateInput } from 'middleware/inputSanitization';

const router = Router();

router.get('/', requireJwtAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const docs = await BioMechCollection.find({}).sort({ createdAt: 'desc' });
    const jsons = await Promise.all(docs.map((post) => post.toJson()));
    res.status(HTTP_OK_CODE).json(jsons);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', requireJwtAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bioId = req.params.id;
    const doc = await BioMechCollection.findById(bioId);
    if (!doc) {
      throw new NotFound(`No biomech post with id ${bioId} available`);
    }
    const json = await doc.toJson();
    res.status(HTTP_OK_CODE).json(json);
  } catch (e) {
    next(e);
  }
});

const FILE_FIELD = BiomechApiIn.BIOMECH_POST_PROPERTIES.file;
router.post(
  '/',
  requireJwtAuth,
  ImageUploader(FILE_FIELD),
  InputSchema.post,
  validateInput,
  (req: Request, res: Response, next: NextFunction) => {
    const user: User | undefined = req.user;
    if (!req.user) {
      throw new NotFound(`No user found`);
    }
    const department = user?.departmentId;
    const submitData: BiomechApiIn.BiomechPost = req.body;

    const bioMech: BioMech = {
      userId: user?._id || '-1',
      departmentId: department || 'Unknown department',
      equipmentName: submitData.equipmentName,
      equipmentFault: submitData.equipmentFault,
      equipmentPriority: submitData.equipmentPriority,
      equipmentStatus: submitData.equipmentStatus,
      imgPath: submitData.file.path,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const doc = new BioMechCollection(bioMech);

    doc
      .save()
      .then(() => res.sendStatus(HTTP_CREATED_CODE))
      .catch((err: any) => {
        deleteUploadedImage(bioMech.imgPath);
        return next(new InternalError(`Mongoose: Save biomech report failed: ${err}`));
      });
  },
);

router.delete(
  '/:id',
  requireJwtAuth,
  roleAuth(Role.Admin, Role.BioMechanic),
  (req: Request, res: Response, next: NextFunction) => {
    const bioId = req.params.id;

    BioMechCollection.findByIdAndRemove(bioId)
      .exec()
      .then((data) => {
        if (!data) {
          return next(new BadRequest(`No biomech post with id ${bioId} available`));
        }

        deleteUploadedImage(data.imgPath);
        res.sendStatus(HTTP_NOCONTENT_CODE);
      })
      .catch((err: any) => {
        next(new InternalError(`Failed to delete biomech post: ${err}`));
      });
  },
);

router.put(
  '/:id',
  requireJwtAuth,
  ImageUploader(FILE_FIELD, false),
  InputSchema.post,
  roleAuth(Role.Admin, Role.BioMechanic),
  async (req: Request, res: Response) => {
    const bioId = req.params.id;
    const submitData: BiomechApiIn.BiomechPost = req.body;
    const report = await BioMechCollection.findById(bioId);

    if (!report) {
      throw new NotFound(`No report with id ${bioId}`);
    }

    report.equipmentName = submitData.equipmentName;
    report.equipmentFault = submitData.equipmentFault;
    report.equipmentPriority = submitData.equipmentPriority;
    report.equipmentStatus = submitData.equipmentStatus;

    if (submitData.file) {
      deleteUploadedImage(report.imgPath);
      report.imgPath = submitData.file.path;
    }

    report.updatedAt = new Date();

    await report.save();

    res.status(HTTP_OK_CODE).json({ message: 'Report updated' });
  },
);

export default router;
