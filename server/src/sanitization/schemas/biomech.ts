import { msgString } from 'sanitization/messages';
import { isImage, MUST_BE_AN_IMAGE_FILE } from 'sanitization/validators/isImage';
import { INVALID_BIOMECH_PRIORITY, isBiomechPriority } from 'sanitization/validators/is_biomech_priority';
import { nonFalsyBodyField } from './common';

const bioMechCreate = [
  nonFalsyBodyField(`equipmentName`)
    .isString().withMessage(msgString)
    .trim().escape(),
  nonFalsyBodyField(`equipmentFault`)
    .isString().withMessage(msgString)
    .trim().escape(),
  nonFalsyBodyField(`equipmentPriority`)
    .isString().withMessage(msgString)
    .trim().escape()
    .custom(isBiomechPriority).withMessage(INVALID_BIOMECH_PRIORITY),
  nonFalsyBodyField(`file`)
    .isObject()
    .custom(isImage).withMessage(MUST_BE_AN_IMAGE_FILE)
];

export const Biomech = {
  post: bioMechCreate
};
