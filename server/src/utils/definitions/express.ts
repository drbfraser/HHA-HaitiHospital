import { Request } from 'express';
import { User } from '@hha/common';

export interface RequestWithUser extends Request {
  user: User;
}
