import { Router, Request, Response } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import BioMech from '../../models/bioMech';
import { registerBioMechCreate } from '../../schema/registerBioMech';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import { verifyDeptId } from 'common/definitions/departments';
import { BadRequest, InternalError } from 'exceptions/httpException';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    await BioMech.find({})
      .populate('user')
      .sort({ createdOn: 'desc' })
      .then((response: any) => res.status(200).json(response))
      .catch((err: any) => {throw new InternalError(`Get biomechs failed: ${err}`)});
});

router.get('/:id', async (req: Request, res: Response) => {
    await BioMech.findById(req.params.id)
      .populate('user')
      .then((response: any) => res.status(200).json(response))
      .catch((err: any) => {throw new BadRequest(`Could not find biomech id ${req.params.id} results`)});
});

router.post('/', 
    requireJwtAuth, 
    registerBioMechCreate, 
    validateInput, 
    upload.single('file'), 
    async (req: any, res: Response) => {

    const user = req.user;
    const department = req.user.department;
    if (!verifyDeptId(department)) {
        throw new BadRequest(`Invalid department id ${department}`);
    }

    const { equipmentName, equipmentFault, equipmentPriority } = JSON.parse(req.body.document);

    let imgPath: String = '';
    if (req.file) {
      imgPath = req.file.path.replace(/\\/g, '/');
    }

    const bioMech = new BioMech({
      user,
      department,
      equipmentName,
      equipmentFault,
      equipmentPriority,
      imgPath
    });

    await bioMech
      .save()
      .then(() => res.status(201).json('BioMech Report Submitted Successfully'))
      .catch((err: any) => { throw new InternalError(`BioMech Report submission failed: ${err}`)} );
});

router.delete('/:id', async (req: Request, res: Response) => {
    BioMech.findByIdAndRemove(req.params.id)
        .then((data: any) => deleteUploadedImage(data.imgPath))
        .then(() => res.sendStatus(204))
        .catch((err: any) => {throw new InternalError(`Failed to delete bio mech: ${err}`)});
});

export default router;
