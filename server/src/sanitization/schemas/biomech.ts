import { body, check } from 'express-validator';
import { INVALID_BIOMECH_PRIORITY, isBiomechPriority } from 'sanitization/validators/is_biomech_priority';
import { msgString } from '../messages';
import { isImage, MUST_BE_AN_IMAGE_FILE } from '../validators/isImage';

const bioMechCreate = [
  body('equipmentName', msgString)
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .isString()
    .trim()
    .escape(),
  body('equipmentFault', msgString)
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .isString()
    .trim()
    .escape(),
  body('equipmentPriority', msgString)
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .isString()
    .trim()
    .escape()
    .custom(isBiomechPriority)
    .withMessage(INVALID_BIOMECH_PRIORITY),
  body('file')
    .exists({
      checkNull: true,
      checkFalsy: true
    })
    .isObject()
    .custom(isImage)
    .withMessage(MUST_BE_AN_IMAGE_FILE)
];

export { bioMechCreate as registerBioMechCreate };
