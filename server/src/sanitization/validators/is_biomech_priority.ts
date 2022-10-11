import { CustomValidator } from "express-validator";
import { BiomechPriority } from "../../models/bioMech";
import { getEnumKeyByStringValue } from "../../utils/utils";

export const isBiomechPriority: CustomValidator = (input: string) => {
    return getEnumKeyByStringValue(BiomechPriority, input) !== null;
}

export const INVALID_BIOMECH_PRIORITY = 'Invalid biomech priority';