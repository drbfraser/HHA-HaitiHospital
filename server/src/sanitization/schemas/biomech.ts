import { body } from 'express-validator';
import { INVALID_BIOMECH_PRIORITY, isBiomechPriority } from 'sanitization/validators/is_biomech_priority';
import { isImage, MUST_BE_AN_IMAGE_FILE } from '../validators/isImage';
import { isString, nonFalsy } from './common';

const bioMechCreate = [
  isString(nonFalsy(body(`equipmentName`))),
  isString(nonFalsy(body(`equipmentFault`))),
  isString(nonFalsy(body(`equipmentPriority`)))
    .custom(isBiomechPriority)
    .withMessage(INVALID_BIOMECH_PRIORITY),
  nonFalsy(body(`file`))
    .isObject()
    .custom(isImage)
    .withMessage(MUST_BE_AN_IMAGE_FILE)
];

export const Biomech = {
  post: bioMechCreate
};
