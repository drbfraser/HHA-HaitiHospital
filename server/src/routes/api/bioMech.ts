import { Router, Request, Response, NextFunction } from 'express';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';

import BioMech from '../../models/BioMech';

import { readFileSync } from 'fs';

const router = Router();

router.get('/', async (req, res) => {
    try{
        BioMech.find({}).populate('user').sort({createdOn: 'desc'})
            .then(Reports => res.json(Reports))
            .catch(err => res.status(400).json('Could not find any results: ' + err));
    } catch(err){
        res.status(500).json({message: 'Something went wrong.' });
    }
});

router.get('/:id', async (req, res) => {
    try{
        BioMech.findById(req.params.id).populate('user')
            .then(Reports => res.json(Reports))
            .catch(err => res.status(400).json('Could not find any results: ' + err));
    } catch(err){
        res.status(500).json({message: 'Something went wrong.' });
    }
});

router.post('/', [requireJwtAuth, upload.single("file")], async (req, res) => {
    try{
        const user = req.user;
        const department = req.user.department;
        const { equipmentName, equipmentFault, equipmentPriority } = JSON.parse(req.body.document);
    
        let imgPath : String;
        if(req.file){
            imgPath = req.file.path;
        }
    
        const bioMech = new BioMech({
            user,
            department,
            equipmentName,
            equipmentFault,
            equipmentPriority,
            imgPath,
        });

        bioMech.save()
            .then(() => res.json("BioMech Report Submitted Successfully"))
            .catch(err => res.status(400).json('BioMech Report submission failed: ' + err));
    } catch(err){
        res.status(500).json({message: 'Something went wrong:' + err});
    }
});

router.delete('/:id', async (req, res) => {
    BioMech.deleteOne({_id: req.params.id})
        .then(() => res.json('Succesfully deleted report'))
        .catch(err => res.status(400).json('Could not delete: ' + err));
});


export default router;
