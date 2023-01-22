import { Role } from 'models/user';
import { getEnumKeyByStringValue } from './utils';

export const isOneOfRoles = (role: string): boolean => {
  return getEnumKeyByStringValue(Role, role) !== null;
};
