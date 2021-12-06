const router = require('express').Router();
const { number } = require('joi');
import MessageBody from '../../models/MessageBody';
import { Request, Response } from "express";
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { checkIsInRole } from '../../utils/authUtils';
import { Role } from "../../models/User"

router.get('/', async (req: any, res: any) => {

    MessageBody.find({}).sort({date : 'desc'}).populate('userId')
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

    MessageBody.findById(req.params.messageId).populate('userId')
        .then(Reports => res.json(Reports))
        .catch(err => res.status(400).json('Could not find any results: ' + err));
});

router.route('/').post(requireJwtAuth, checkIsInRole(Role.Admin),(req: Request, res: Response) => {
    let dateTime: Date = new Date();
    const departmentId: Number = <Number>req.body.departmentId;
    const departmentName: String = req.body.departmentName;
    const date: Date = dateTime;
    const messageBody: String = req.body.messageBody;
    //TODO: replace messageHeader with Document Type 
    const messageHeader: String = req.body.messageHeader;
    // @ts-ignore
    const userId: String = req.user.id;
    console.log(req);
    
    const messageEntry = new MessageBody({
        "departmentId": departmentId,
        "departmentName": departmentName,
        "userId": userId,
        "date": date, 
        "messageBody": messageBody,
        "messageHeader": messageHeader
    });
    
    messageEntry.save()
        .then(() => res.json("Message has been successfully posted"))
        .catch(err => res.status(400).json('Message did not successfully post: ' + err));  
});

//make the changes to message of id reportID
router.route('/:messageId').put(requireJwtAuth, checkIsInRole(Role.Admin),(req: any, res: any) => {

    let dateTime: Date = new Date();
    const departmentId: Number = <Number>req.body.departmentId;
    const departmentName: String = req.body.departmentName;
    const date: Date = dateTime;
    const messageBody: String = req.body.messageBody;
    //TODO: replace messageHeader with Document Type 
    const messageHeader: String = req.body.messageHeader;
    // @ts-ignore
    const userId: String = req.user.id;

    const updatedMessage = {
        "departmentId": departmentId,
        "departmentName": departmentName,
        "userId": userId,
        "date": date, 
        "messageBody": messageBody,
        "messageHeader": messageHeader 
    }

    Object.keys(updatedMessage).forEach((k) => (!updatedMessage[k] || updatedMessage[k] === undefined) && delete updatedMessage[k]);
    
    return MessageBody.findByIdAndUpdate({_id: req.params.messageId}, updatedMessage, {new:true}).populate("userId")
        .then(message => res.json(message))
        .catch(err => res.status(400).json('Edit message failed: ' + err));
})

// delete message id
router.route('/:id').delete(requireJwtAuth, checkIsInRole(Role.Admin), (req:Request, res: Response) => {
    try {
        MessageBody.findByIdAndRemove(req.params.id)
            .then(data => res.json(data))
            .catch(err => res.status(400).json('Failed to delete: ' + err));
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

export = router;