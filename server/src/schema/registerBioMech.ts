import { check } from 'express-validator';
import { msgString } from '../utils/sanitizationMessages';
import { isImage, MUST_BE_AN_IMAGE_FILE } from './validators/is_image';

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
