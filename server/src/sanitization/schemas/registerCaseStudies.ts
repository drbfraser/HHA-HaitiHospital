import { check, oneOf } from 'express-validator';
import { msgNumber, msgString, msgDate } from '../messages';

const caseStudiesCreate = [
  // check('document').exists(),
  // check('document.caseStudyType').exists().trim().escape().withMessage(msgString),
  // oneOf(
  //   [
  //     [
  //       check('document.patientStory.patientsName').trim().escape().exists().withMessage(msgString),
  //       check('document.patientStory.patientsAge').trim().escape().exists().isNumeric().withMessage(msgNumber),
  //       check('document.patientStory.whereIsThePatientFrom').trim().escape().exists().withMessage(msgString),
  //       check('document.patientStory.whyComeToHcbh').trim().escape().exists().withMessage(msgString),
  //       check('document.patientStory.howLongWereTheyAtHcbh').trim().escape().exists().withMessage(msgString),
  //       check('document.patientStory.diagnosis').trim().escape().exists().withMessage(msgString),
  //       check('document.patientStory.caseStudyStory').trim().escape().exists().withMessage(msgString)
  //     ],
  //     [
  //       check('document.staffRecognition.staffName').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.staffRecognition.jobTitle').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.staffRecognition.department').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.staffRecognition.howLongWorkingAtHcbh').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.staffRecognition.mostEnjoy').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.staffRecognition.caseStudyStory').trim().escape().isLength({ min: 1 }).withMessage(msgString)
  //     ],
  //     [
  //       check('document.trainingSession.trainingDate')
  //         .notEmpty()
  //         .custom((val) => /^(19|20)\d\d-(0[1-9]|1[012])-([012]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val))
  //         .trim()
  //         .escape()
  //         .withMessage(msgDate),
  //       check('document.trainingSession.trainingOn').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.trainingSession.whoConducted').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.trainingSession.whoAttended').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.trainingSession.benefitsFromTraining').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.trainingSession.caseStudyStory').trim().escape().isLength({ min: 1 }).withMessage(msgString)
  //     ],
  //     [
  //       check('document.equipmentReceived.equipmentReceived').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.equipmentReceived.departmentReceived').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.equipmentReceived.whoSentEquipment').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.equipmentReceived.purchasedOrDonated').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.equipmentReceived.whatDoesEquipmentDo').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  //       check('document.equipmentReceived.caseStudyStory').trim().escape().isLength({ min: 1 }).withMessage(msgString)
  //     ],
  //     [check('document.otherStory.caseStudyStory').trim().escape().isLength({ min: 1 }).withMessage(msgString)]
  //   ],
  //   'Please fill in all fields of Case Study'
  // )
];

export { caseStudiesCreate as registerCaseStudiesCreate };
