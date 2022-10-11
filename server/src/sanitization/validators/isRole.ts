import { CustomValidator } from "express-validator";
import { isOneOfRoles } from "../../utils/roles";

export const isRole: CustomValidator = (value: string) => {
    return isOneOfRoles(value); 
}