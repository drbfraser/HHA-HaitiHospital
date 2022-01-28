import { seedDepartments } from '../../utils/seed';
const router = require('express').Router();
import FormEntry from '../../models/FormEntry';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { checkUserIsDepartmentAuthed } from '../../utils/authUtils';

//---RESEED DATABASE---//
//GET - reseeds the department database with the base models(WARNING: WILL REMOVE CUSTOM DEPARTMENTS)
router.get('/seedDepartments', async (req, res) => {
  await seedDepartments()
    .then(() => res.json('Departments have been successfully reseeded'))
    .catch((err) => res.status(400).json('Departments did not reseed: ' + err));
});

//---ADD TO DATABASE---//
//GET - gets the form key value pairs and sends a JSON of that data(template of the department)
// router.route('/add/:Departmentid').get((req: any, res: any) => {
//     let departmentArg = 0;
//     try{
//         departmentArg = +req.params.Departmentid;
//     }
//     catch(error){
//         error => res.status(400).json('id is not a number: '+ error);
//     }

//     //TODO: VALIDATE THAT THE :ID DOES NOT RETURN AN EMPTY ARRAY
//     Departments.find({departmentId : departmentArg}).populate('createdByUserId').populate('lastUpdatedByUserId')
//     .then(Departments => res.json(Departments))
//     .catch(err => res.status(400).json('Could not find the Department: ' + err));
// });

//POST - sends user submitted form to the server as a JSON
router.route('/add').post(requireJwtAuth, async (req: any, res: any) => {
  const isValidated: boolean = await checkUserIsDepartmentAuthed(req.user.id, parseInt(req.body.departmentId), req.user.role);
  if (!isValidated) {
    return res.status(401).json('User is unauthorized in to make a post in current department.');
  }

  let dateTime: Date = new Date();
  const createdByUserId = req.user.id as string;
  const createdOn = dateTime;
  const lastUpdatedByUserId = req.user.id;
  const lastUpdatedOn = dateTime;
  const departmentId = req.body.departmentId as string;
  const formData = req.body;
  const reportingMonth: Date = dateTime; //TODO: Modify Month to be able to be easily filtered by HHA Staff

  const formEntry = new FormEntry({
    departmentId: departmentId,
    createdByUserId: createdByUserId,
    reportingMonth: reportingMonth,
    createdOn: createdOn,
    lastUpdatedByUserId: lastUpdatedByUserId,
    lastUpdatedOn: lastUpdatedOn,
    formData: formData
  });

  formEntry
    .save()
    .then(() => res.json('Report has been successfully submitted'))
    .catch((err) => res.status(400).json('Report did not successfully submit: ' + err));
});

//---VIEW DATABASE---//
//view all Reports in the database
// router.route('/view').get((req: any, res: any) => {

//     FormEntry.find({}).populate('createdByUserId').populate('lastUpdatedByUserId').sort({createdOn: 'desc'})
//         .then(Reports => res.json(Reports))
//         .catch(err => res.status(400).json('Could not find any results: ' + err));
// });

//view all forms from a specific department
// router.route('/viewdepartment/:Departmentid').get((req: any, res: any) => {

//     FormEntry.find({departmentId : req.params.Departmentid}).populate('createdByUserId').populate('lastUpdatedByUserId')
//         .then(Reports => res.json(Reports))
//         .catch(err => res.status(400).json('Could not find any results: ' + err));
// });

//view specific Report by id
router.route('/viewreport/:Reportid').get((req: any, res: any) => {
  FormEntry.findById(req.params.Reportid)
    .populate('createdByUserId')
    .populate('lastUpdatedByUserId')
    .then((Report) => res.json(Report))
    .catch((err) => res.status(400).json('Could not find any results: ' + err));
});

//---EDIT REPORTS---//
//get specific report to display results before edit
// router.route('/edit/:Reportid').get((req: any, res: any) => {
//     FormEntry.findById(req.params.Reportid).populate('createdByUserId').populate('lastUpdatedByUserId')
//         .then(Report => res.json(Report))
//         .catch(err => res.status(400).json('Could not find any results: ' + err));
// });

//make the changes to report of id reportID
router.route('/edit/:Reportid').put(requireJwtAuth, async (req: any, res: any) => {
  const form = await FormEntry.findById(req.params.Reportid);
  const departmentId = form.departmentId;
  const isValidated: boolean = await checkUserIsDepartmentAuthed(req.user.id, departmentId, req.user.role);
  if (!isValidated) {
    return res.status(401).json('User is unauthorized in to delete the current department.');
  }

  let updatedDateTime: Date = new Date();
  const lastUpdatedByUserId = req.user.id;
  const lastUpdatedOn = updatedDateTime;
  const formData = req.body;

  const updatedFormEntry = {
    lastUpdatedByUserId,
    lastUpdatedOn,
    formData
  };

  return FormEntry.findByIdAndUpdate({ _id: req.params.Reportid }, updatedFormEntry, { new: true })
    .populate('createdByUserId')
    .populate('lastUpdatedByUserId')
    .then((Report) => res.json(Report))
    .catch((err) => res.status(400).json('Could not successfully edit the report: ' + err));
});

//---DELETE REPORTS---//
//delete a single report with Reportid
router.route('/delete/:Reportid').delete(requireJwtAuth, async (req: any, res: any) => {
  const form = await FormEntry.findById(req.params.Reportid);
  const departmentId = form.departmentId;
  const isValidated: boolean = await checkUserIsDepartmentAuthed(req.user.id, departmentId, req.user.role);
  if (!isValidated) {
    return res.status(401).json('User is unauthorized in to delete the current department.');
  }

  FormEntry.deleteOne({ _id: req.params.Reportid })
    .then(() => res.json('Succesfully deleted report'))
    .catch((err) => res.status(400).json('Could not delete: ' + err));
});

// retrieve reports with deparmentId param and/or dateRange param
// ?departmentId?from=YYYY-MM-DD?to=YYYY-MM-DD
router.route('/').get(requireJwtAuth, async (req, res) => {
  try {
    const departmentId: number = parseInt(req.query.departmentId);

    const isValidated: boolean = await checkUserIsDepartmentAuthed(req.user.id, departmentId, req.user.role);

    if (!isValidated) {
      return res.status(401).json('User is unauthorized in to view the current department.');
    }

    const strFrom = req.query.from;
    const strTo = req.query.to;
    const reportId = req.query.reportId;

    let filterQuery = FormEntry.find({});

    if (reportId !== undefined) {
      filterQuery.find({ _id: reportId });
    }

    if (strFrom !== undefined && strTo != undefined) {
      let fromDate = strToDate(strFrom);
      let toDate = strToDate(strTo);
      fromDate.setHours(0, 0, 0);
      toDate.setHours(23, 59, 59);

      filterQuery = filterQuery.find({
        lastUpdatedOn: {
          $gte: fromDate,
          $lte: toDate
        }
      });
    }

    if (Number.isNaN(departmentId) === false) {
      filterQuery = filterQuery.find({
        departmentId: departmentId
      });
    }

    let result = await filterQuery.sort({ createdOn: 'desc' }).populate('lastUpdatedByUserId').exec();
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'failure',
      error: error.messages
    });
  }
});

export = router;

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>. HELPERS >>>>>>>>>>>>>>>>>>>>>>>>
// string in format YYYY-MM-DD
function strToDate(strDate: string): Date {
  const substrs = strDate.split('-');

  // month is 0 based
  const year = parseInt(substrs[0]);
  const month = parseInt(substrs[1]);
  const day = parseInt(substrs[2]);

  return new Date(year, month - 1, day);
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
