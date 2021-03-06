import { Router, Response, NextFunction } from 'express';
import requireJwtAuth from 'middleware/requireJwtAuth';
import { oneImageUploader } from 'middleware/upload';
import { validateInput } from 'middleware/inputSanitization';
import BioMechCollection, { BioMech } from 'models/bioMech';
import { registerBioMechCreate } from 'sanitization/schemas/postBiomech';
import { deleteUploadedImage } from 'utils/unlinkImage';
import { BadRequest, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { RequestWithUser } from 'utils/definitions/express';
import { roleAuth } from 'middleware/roleAuth';
import { Role } from 'models/user';
import { BiomechApiIn } from './jsons/biomech';

const router = Router();

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const docs = await BioMechCollection.find({}).sort({ createdAt: 'desc' });
    const jsons = await Promise.all(docs.map((post) => post.toJson()));
    res.status(HTTP_OK_CODE).json(jsons);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', requireJwtAuth, async (req: RequestWithUser, res: Response, next: NextFunction) => {
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

router.post('/', requireJwtAuth, oneImageUploader(BiomechApiIn.FILE_FIELD), registerBioMechCreate, validateInput, (req: RequestWithUser, res: Response, next: NextFunction) => {
  const user = req.user;
  const userId = user._id!;
  const department = user.departmentId;
  let submitData: BiomechApiIn.BiomechPost = req.body;

  const bioMech: BioMech = {
    userId: userId,
    departmentId: department,
    equipmentName: submitData.equipmentName,
    equipmentFault: submitData.equipmentFault,
    equipmentPriority: submitData.equipmentPriority,
    imgPath: submitData.file.path,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const doc = new BioMechCollection(bioMech);
  doc
    .save()
    .then(() => res.sendStatus(HTTP_CREATED_CODE))
    .catch((err: any) => next(new InternalError(`Mongoose: Save biomech report failed: ${err}`)));
});

router.delete('/:id', requireJwtAuth, roleAuth(Role.Admin), (req: RequestWithUser, res: Response, next: NextFunction) => {
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
    .catch((err: any) => next(new InternalError(`Failed to delete biomech post: ${err}`)));
});

export default router;
