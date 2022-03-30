import { Router, Response } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import BioMech from '../../models/bioMech';
import { registerBioMechCreate } from '../../schema/registerBioMech';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import { BadRequest, HTTP_CREATED_CODE, HTTP_NOCONTENT_CODE, HTTP_OK_CODE, InternalError, NotFound } from 'exceptions/httpException';
import { RequestWithUser } from 'utils/definitions/express';

const router = Router();

router.get('/', requireJwtAuth, async (req: RequestWithUser, res: Response) => {
    BioMech.find({}).populate('user')
      .sort({ createdOn: 'desc' }).exec()
      .then((response: []) => res.status(HTTP_OK_CODE).json(response))
      .catch((err: any) => {throw new InternalError(`Get biomechs failed: ${err}`)});
});

router.get('/:id', requireJwtAuth, async (req: RequestWithUser, res: Response) => {
    const bioId = req.params.id;
    BioMech.findById(bioId).populate('user')
      .then((response: any) => {
          if (!response) {
            throw new NotFound(`No biomech post with id ${bioId} available`);
          }
          res.status(HTTP_OK_CODE).json(response)
        })
      .catch((err: any) => {throw new InternalError(`Could not find biomech id ${bioId} results`)});
});

router.post('/', 
    requireJwtAuth, 
    registerBioMechCreate, 
    validateInput, 
    upload.single('file'), 
    async (req: RequestWithUser, res: Response) => {

    const user = req.user;
    const userId = user.id;
    const department = user.department;
    const { equipmentName, equipmentFault, equipmentPriority } = JSON.parse(req.body.document);

    let imgPath: string = '';
    if (req.file) {
      imgPath = req.file.path.replace(/\\/g, '/');
    }

    const bioMech = new BioMech({
      userId,
      department,
      equipmentName,
      equipmentFault,
      equipmentPriority,
      imgPath
    });

    bioMech.save()
      .then(() => res.status(HTTP_CREATED_CODE).json('BioMech Report Submitted Successfully'))
      .catch((err: any) => { throw new InternalError(`BioMech Report submission failed: ${err}`)} );
});

router.delete('/:id', requireJwtAuth, async (req: RequestWithUser, res: Response) => {
    const bioId = req.params.id;
    BioMech.findByIdAndRemove(bioId).exec()
        .then((data: any) => { 
            if (!data) {
                throw new BadRequest(`No biomech post with id ${bioId} available`);
            }
            return deleteUploadedImage(data.imgPath); 
        })
        .then(() => res.sendStatus(HTTP_NOCONTENT_CODE))
        .catch((err: any) => {throw new InternalError(`Failed to delete biomech post: ${err}`)});
});

export default router;
