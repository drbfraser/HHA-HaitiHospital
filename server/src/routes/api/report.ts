import { seedDepartments } from '../../utils/seed';
const router = require('express').Router();
const { number } = require('joi');
import Departments from '../../models/Departments';
import FormEntry from '../../models/FormEntry';


//---RESEED DATABASE---//
//GET - reseeds the department database with the base models(WARNING: WILL REMOVE CUSTOM DEPARTMENTS)
router.get('/seedDepartments', async (req, res) => {
    await seedDepartments()
    .then(() => res.json("Departments have been successfully reseeded"))
    .catch(err => res.status(400).json('Departments did not reseed: ' + err));
});


//---ADD TO DATABASE---//
//GET - gets the form key value pairs and sends a JSON of that data(template of the department)
router.route('/add/:Departmentid').get((req: any, res: any) => {
    let departmentArg = 0;
    try{
        departmentArg = +req.params.Departmentid;
    }
    catch(error){
        error => res.status(400).json('id is not a number: '+ error);
    }
    
    //TODO: VALIDATE THAT THE :ID DOES NOT RETURN AN EMPTY ARRAY
    Departments.find({departmentId : departmentArg})
    .then(Departments => res.json(Departments))
    .catch(err => res.status(400).json('Could not find the Department: ' + err));
});

//POST - sends user submitted form to the server as a JSON
router.route('/add').post((req: any, res: any) => {
    
    let dateTime: Date = new Date();
    const createdByUserId = 0; //GET VALUE FROM FRONTEND USER SESSION
    const createdOn = dateTime;
    const lastUpdatedByUserId = 0; //GET VALUE FROM FRONTEND USER SESSION
    const lastUpdatedOn = dateTime;
    const departmentId = req.body.departmentId;
    const formData = req.body;

    const formEntry = new FormEntry({
        departmentId,
        createdByUserId,
        createdOn,
        lastUpdatedByUserId,
        lastUpdatedOn,
        formData,
    });
    
    formEntry.save()
        .then(() => res.json("Report has been successfully submitted"))
        .catch(err => res.status(400).json('Report did not successfully submit: ' + err));
});


//---VIEW DATABASE---//
//view all Reports in the database
router.route('/view').get((req: any, res: any) => {
    FormEntry.find({}).sort({createdOn: 'desc'})
        .then(Reports => res.json(Reports))
        .catch(err => res.status(400).json('Could not find any results: ' + err));
});

//view all forms from a specific department
router.route('/viewdepartment/:Departmentid').get((req: any, res: any) => {
    FormEntry.find({departmentId : req.params.Departmentid})
        .then(Reports => res.json(Reports))
        .catch(err => res.status(400).json('Could not find any results: ' + err));
});

//view specific Report by id
router.route('/viewreport/:Reportid').get((req: any, res: any) => {
    FormEntry.findById(req.params.Reportid)
        .then(Report => res.json(Report))
        .catch(err => res.status(400).json('Could not find any results: ' + err));
});

//---EDIT REPORTS---//
//get specific report to display results before edit 
router.route('/edit/:Reportid').get((req: any, res: any) => {
    FormEntry.findById(req.params.Reportid)
        .then(Report => res.json(Report))
        .catch(err => res.status(400).json('Could not find any results: ' + err));
});

//make the changes to report of id reportID
router.route('/edit/:Reportid').put((req: any, res: any) => {
    let updatedDateTime: Date = new Date();
    const lastUpdatedByUserId = 0; //GET VALUE FROM FRONTEND USER SESSION
    const lastUpdatedOn = updatedDateTime;
    const formData = req.body;
    
    const updatedFormEntry = ({
        lastUpdatedByUserId,
        lastUpdatedOn,
        formData,
    });
    
    return FormEntry.findByIdAndUpdate({_id: req.params.Reportid}, updatedFormEntry , { new : true })
        .then(Report => res.json(Report))
        .catch(err => res.status(400).json('Could not successfully edit the report: ' + err));
})

//---DELETE REPORTS---//
//delete a single report with Reportid
router.route('/delete/:Reportid').delete((req: any, res: any) => {
    FormEntry.deleteOne({_id: req.params.Reportid})
        .then(() => res.json('Succesfully deleted report'))
        .catch(err => res.status(400).json('Could not delete: ' + err));
});

export = router;