import { Router, Request, Response, NextFunction } from 'express';

import requireJwtAuth from '../../middleware/requireJwtAuth';
import upload from '../../middleware/upload';

import BioMech from '../../models/BioMech';

import { readFileSync } from 'fs';

const router = Router();

router.get('/', async (req, res) => {
    try{
        BioMech.find({}).sort({createdOn: 'desc'})
            .then(Reports => res.json(Reports))
            .catch(err => res.status(400).json('Could not find any results: ' + err));
    } catch(err){
        res.status(500).json({message: 'Something went wrong.' });
    }
});

router.get('/:id', async (req, res) => {
    try{
        BioMech.findById(req.params.id)
            .then(Reports => res.json(Reports))
            .catch(err => res.status(400).json('Could not find any results: ' + err));
    } catch(err){
        res.status(500).json({message: 'Something went wrong.' });
    }
});

router.post('/', [requireJwtAuth, upload.single("file")], async (req, res) => {
    try{
        let dateTime: Date = new Date();
        const userId = req.user.id;
        // const userId = 0; //TEST ONLY
        const createdOn: Date = dateTime;
        const equipmentName: String = req.body.equipmentName;
        const equipmentFault: String = req.body.equipmentFault;
        const equipmentPriority: String = req.body.equipmentPriority;
        let imgPath : String;
        let contentType : String = 'image/jpg';
    
        if(req.file){
            imgPath = req.file.path;
        }
    
        const image = {
            imgPath,
            contentType,
        };
    
        const bioMech = new BioMech({
            userId,
            createdOn,
            equipmentName,
            equipmentFault,
            equipmentPriority,
            image,
        });

        bioMech.save()
            .then(() => res.json("BioMech Report Submitted Successfully"))
            .catch(err => res.status(400).json('BioMech Report submission failed: ' + err));
    } catch(err){
        res.status(500).json({message: 'Something went wrong.'});
    }
});

router.delete('/:id', async (req, res) => {
    BioMech.deleteOne({_id: req.params.id})
        .then(() => res.json('Succesfully deleted report'))
        .catch(err => res.status(400).json('Could not delete: ' + err));
});


export default router;
