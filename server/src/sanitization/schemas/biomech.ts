import { BiomechApiIn } from '../../routes/api/jsons/biomech';
import { msgString } from '../messages';
import { isImage, MUST_BE_AN_IMAGE_FILE } from '../validators/isImage';
import { INVALID_BIOMECH_PRIORITY, isBiomechPriority } from '../validators/is_biomech_priority';
import { nonFalsyBodyField } from './common';

const JSON = BiomechApiIn.BIOMECH_POST_PROPERTIES;
const bioMechCreate = [
  nonFalsyBodyField(JSON.equipmentName).isString().withMessage(msgString).trim().escape(),
  nonFalsyBodyField(JSON.equipmentFault).isString().withMessage(msgString).trim().escape(),
  nonFalsyBodyField(JSON.equipmentPriority).isString().withMessage(msgString).trim().escape().custom(isBiomechPriority).withMessage(INVALID_BIOMECH_PRIORITY),
  nonFalsyBodyField(JSON.file).isObject().custom(isImage).withMessage(MUST_BE_AN_IMAGE_FILE)
];

export const Biomech = {
  post: bioMechCreate
};
