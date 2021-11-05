const router = require('express').Router();
const { number } = require('joi');
import MessageBody from '../../models/MessageBody';

router.get('/', async (req: any, res: any) => {
    MessageBody.find({}).sort({date : 'desc'})
        .then(Reports => res.json(Reports))
        .catch(err => res.status(400).json('Could not find any results: ' + err));
});

//REMOVED FOR NOW - MIGHT BRING DEPARTMENT SPECIFIC MESSAGES FUNCTION BACK LATER
// router.get('/department/:departmentId', async (req: any, res: any) => {
//     MessageBody.find({departmentId: req.params.departmentId}).sort({date : 'desc'})
//         .then(Reports => res.json(Reports))
//         .catch(err => res.status(400).json('Could not find any results: ' + err));
// });

router.get('/message/:messageId', async (req: any, res: any) => {
    MessageBody.findById(req.params.messageId)
        .then(Reports => res.json(Reports))
        .catch(err => res.status(400).json('Could not find any results: ' + err));
});

router.route('/').post((req: any, res: any) => {
    let dateTime: Date = new Date();
    const departmentId: Number = <Number>req.body.departmentId;
    const departmentName: String = req.body.departmentName;
    const authorId: Number = <Number>req.body.authorId;
    const authorFirstName: String = req.body.authorFirstName;
    const authorLastName: String = req.body.authorLastName;
    const date: Date = dateTime
    const messageBody: String = req.body.messageBody;
    //TODO: replace messageHeader with Document Type 
    const messageHeader: String = req.body.messageHeader;
    
    const messageEntry = new MessageBody({
        departmentId,
        departmentName,
        authorId,
        authorFirstName,
        authorLastName,
        date,
        messageBody,
        messageHeader
    });
    
    messageEntry.save()
        .then(() => res.json("Message has been successfully posted"))
        .catch(err => res.status(400).json('Message did not successfully post: ' + err));
});

export = router;