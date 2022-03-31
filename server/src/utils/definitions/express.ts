import { Request } from 'express';
import { User } from "models/user";

export interface RequestWithUser extends Request {
    user: User
};