const router = require('express').Router();
const { number } = require('joi');
import NicuPaeds from '../../models/NicuPaeds';


router.route('/').get((req,res)=>{
    NicuPaeds.find()
        .then(NicuPaeds=> res.json(NicuPaeds))
        .catch(err => res.status(400).json('Reports could not be found: ' + err));
});

router.route('/:id').delete((req,res) => {
    NicuPaeds.findByIdAndDelete(req.params.id)
        .then(() => res.json('Report deleted.'))
        .catch(err => res.status(400).json('Report could not be deleted: ' + err));
});

// adding NICUPaeds Form into the Database
router.route('/add').post((req: any, res)=>{
    let newNicuPaedsDocument = new NicuPaeds(req.body);

    newNicuPaedsDocument.save()
        .then(() => res.json("Report has been successfully submitted"))
        .catch(err => res.status(400).json('Report did not successfully submit: ' + err));
})

export = router;