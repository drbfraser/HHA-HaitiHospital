import { check, oneOf } from 'express-validator';
import { msgNumber, msgString, msgDate } from '../utils/sanitizationMessages';

const caseStudiesCreate = [
  check('user.*.id').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('user.*.username').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('user.*.name').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('user.*.role').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('user.*.department').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('user.*.createdAt')
    .notEmpty()
    .custom((val) => /^(19|20)\d\d-(0[1-9]|1[012])-([012]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val))
    .trim()
    .escape()
    .withMessage(msgDate),
  check('user.*.updatedAt')
    .notEmpty()
    .custom((val) => /^(19|20)\d\d-(0[1-9]|1[012])-([012]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val))
    .trim()
    .escape()
    .withMessage(msgDate),
  check('document.*.caseStudyType').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  oneOf(
    [
      [
        check('document.*.patientsName').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.patientsAge').trim().escape().notEmpty().isNumeric().withMessage(msgNumber),
        check('document.*.whereIsThePatientFrom').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.whyComeToHcbh').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.howLongWereTheyAtHcbh').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.diagnosis').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.caseStudyStory').trim().escape().isLength({ min: 1 }).withMessage(msgString)
      ],
      [
        check('document.*.staffName').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.jobTitle').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.department').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.howLongWorkingAtHcbh').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.mostEnjoy').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.caseStudyStory').trim().escape().isLength({ min: 1 }).withMessage(msgString)
      ],
      [
        check('document.*.trainingDate')
          .notEmpty()
          .custom((val) => /^(19|20)\d\d-(0[1-9]|1[012])-([012]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val))
          .trim()
          .escape()
          .withMessage(msgDate),
        check('document.*.trainingOn').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.whoConducted').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.whoAttended').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.benefitsFromTraining').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.caseStudyStory').trim().escape().isLength({ min: 1 }).withMessage(msgString)
      ],
      [
        check('document.*.equipmentReceived').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.departmentReceived').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.whoSentEquipment').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.purchasedOrDonated').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.whatDoesEquipmentDo').trim().escape().isLength({ min: 1 }).withMessage(msgString),
        check('document.*.caseStudyStory').trim().escape().isLength({ min: 1 }).withMessage(msgString)
      ],
      [check('document.*.caseStudyStory').trim().escape().isLength({ min: 1 }).withMessage(msgString)]
    ],
    'Please fill in all fields of Case Study'
  ),
  check('document.*.createdAt')
    .notEmpty()
    .custom((val) => /^(19|20)\d\d-(0[1-9]|1[012])-([012]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val))
    .trim()
    .escape()
    .withMessage(msgDate),
  check('document.*.updatedAt')
    .notEmpty()
    .custom((val) => /^(19|20)\d\d-(0[1-9]|1[012])-([012]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(val))
    .trim()
    .escape()
    .withMessage(msgDate)
];

export { caseStudiesCreate as registerCaseStudiesCreate };
