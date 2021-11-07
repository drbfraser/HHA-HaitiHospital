const router = require('express').Router();
const { number } = require('joi');
import MessageBody from '../../models/MessageBody';
import { Request, Response } from "express";
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { checkIsInRole, ROLES } from '../../utils/roleUtils'

router.get('/', async (req: any, res: any) => {
    MessageBody.find({}).sort({date : 'desc'})
        .then(Reports => res.json(Reports))
        .catch(err => res.status(400).json('Could not find any results: ' + err));
});

//REMOVED FOR NOW - MIGHT BRING DEPARTMENT SPECIFIC MESSAGES FUNCTION BACK LATER
router.get('/department/:departmentId', async (req: any, res: any) => {
    MessageBody.find({departmentId: req.params.departmentId}).sort({date : 'desc'})
        .then(Reports => res.json(Reports))
        .catch(err => res.status(400).json('Could not find any results: ' + err));
});

router.get('/message/:messageId', async (req: any, res: any) => {
    MessageBody.findById(req.params.messageId)
        .then(Reports => res.json(Reports))
        .catch(err => res.status(400).json('Could not find any results: ' + err));
});

router.route('/').post(requireJwtAuth, checkIsInRole(ROLES.Admin),(req: Request, res: Response) => {
    let dateTime: Date = new Date();
    const departmentId: Number = <Number>req.body.departmentId;
    const departmentName: String = req.body.departmentName;
    const authorId: Number = <Number>req.body.authorId;
    const date: Date = dateTime
    const messageBody: String = req.body.messageBody;
    //TODO: replace messageHeader with Document Type 
    const messageHeader: String = req.body.messageHeader;
    // @ts-ignore
    const name: String = req.user.name;
    
    const messageEntry = new MessageBody({
        departmentId,
        departmentName,
        authorId,
        name,
        date,
        messageBody,
        messageHeader
    });
    
    messageEntry.save()
        .then(() => res.json("Message has been successfully posted"))
        .catch(err => res.status(400).json('Message did not successfully post: ' + err));
});

export = router;