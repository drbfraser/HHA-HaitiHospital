import { Request } from 'express';
import { UserJson } from "models/user";

export interface RequestWithUser extends Request {
    user: UserJson
};