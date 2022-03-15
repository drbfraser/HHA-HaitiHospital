import { Router, Request, Response } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';
import { validateInput } from '../../middleware/inputSanitization';
import BioMech from '../../models/bioMech';
import { registerBioMechCreate } from '../../schema/registerBioMech';
import { deleteUploadedImage } from '../../utils/unlinkImage';
import { msgCatchError } from 'utils/sanitizationMessages';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    await BioMech.find({})
      .populate('user')
      .sort({ createdOn: 'desc' })
      .then((response: any) => res.status(200).json(response))
      .catch((err: any) => res.status(400).json('Could not find any results: ' + err));
  } catch (err) {
    res.status(500).json(msgCatchError);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    await BioMech.findById(req.params.id)
      .populate('user')
      .then((response: any) => res.status(200).json(response))
      .catch((err: any) => res.status(400).json('Could not find any results: ' + err));
  } catch (err) {
    res.status(500).json(msgCatchError);
  }
});

router.post('/', requireJwtAuth, registerBioMechCreate, validateInput, upload.single('file'), async (req: any, res: Response) => {
  try {
    const user = req.user;
    const department = req.user.department;
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
      .catch((err: any) => res.status(400).json('BioMech Report submission failed: ' + err));
  } catch (err) {
    res.status(500).json(msgCatchError);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    BioMech.findByIdAndRemove(req.params.id)
      .then((data: any) => deleteUploadedImage(data.imgPath))
      .then(() => res.sendStatus(204))
      .catch((err: any) => res.status(400).json('Failed to delete bio mech: ' + err));
  } catch (err) {
    res.status(500).json(msgCatchError);
  }
});

export default router;
