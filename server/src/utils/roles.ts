import { Role } from '@hha/common';
import { getEnumKeyByStringValue } from './utils';

export const isOneOfRoles = (role: string): boolean => {
  return getEnumKeyByStringValue(Role, role) !== null;
};
