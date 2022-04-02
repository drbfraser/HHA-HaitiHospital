import { Router, Response, NextFunction } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import BioMechModel, { BioMech } from '../../models/bioMech';
import { registerBioMechCreate } from '../../schema/registerBioMech';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import { BadRequest, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { RequestWithUser } from 'utils/definitions/express';
import { resolveSchema } from 'ajv/dist/compile';

const router = Router();

router.get('/', requireJwtAuth, (req: RequestWithUser, res: Response, next: NextFunction) => {
    BioMechModel.find({})
      .sort({ createdOn: 'desc' }).exec()
      .then((posts) => {
        const jsons = posts.map((post) => post.toJson())
        return res.status(HTTP_OK_CODE).json(jsons);
      })
      .catch((err: any) => next(new InternalError(`Get biomechs failed: ${err}`)));
});

router.get('/:id', requireJwtAuth, (req: RequestWithUser, res: Response, next: NextFunction) => {
    const bioId = req.params.id;
    BioMechModel.findById(bioId).populate('user')
      .then((response) => {
          if (!response) {
            return next(new NotFound(`No biomech post with id ${bioId} available`));
          }
          res.status(HTTP_OK_CODE).json(response.toJson());
        })
      .catch((err: any) => next(new InternalError(`Could not find biomech id ${bioId} results`)));
});

router.post('/', 
    requireJwtAuth, 
    registerBioMechCreate, 
    validateInput, 
    upload.single('file'), 
    (req: RequestWithUser, res: Response, next: NextFunction) => {

    const user = req.user;
    const userId = user._id!;
    const department = user.departmentId;
    const { equipmentName, equipmentFault, equipmentPriority } = JSON.parse(req.body.document);

    let imgPath: string = '';
    if (req.file) {
      imgPath = req.file.path.replace(/\\/g, '/');
    }

    const bioMech: BioMech = {
      userId: userId,
      departmentId: department,
      equipmentName: equipmentName,
      equipmentFault: equipmentFault,
      equipmentPriority: equipmentPriority,
      imgPath: imgPath,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const doc = new BioMechModel(bioMech);
    doc.save()
      .then(() => res.sendStatus(HTTP_CREATED_CODE))
      .catch((err: any) => next(new InternalError(`BioMech Report submission failed: ${err}`)));
});

router.delete('/:id', requireJwtAuth, (req: RequestWithUser, res: Response, next: NextFunction) => {
    const bioId = req.params.id;
    BioMechModel.findByIdAndRemove(bioId).exec()
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
