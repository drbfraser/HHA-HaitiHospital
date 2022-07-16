import { check } from 'express-validator';
import { msgString } from '../messages';
import { isImage, MUST_BE_AN_IMAGE_FILE } from '../validators/isImage';

const bioMechCreate = [
  check('equipmentName').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('equipmentFault').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('equipmentPriority').trim().escape().isLength({ min: 1 }).withMessage(msgString),
  check('file')
    .exists({
      checkFalsy: true
    })
    .isObject()
    .custom(isImage)
    .withMessage(MUST_BE_AN_IMAGE_FILE)
];

export { bioMechCreate as registerBioMechCreate };
