import { Department } from './department';

export enum Role {
  Admin = 'Admin',
  MedicalDirector = 'Medical Director',
  HeadOfDepartment = 'Head of Department',
  BioMechanic = 'Bio Mechanic',
  User = 'User',
}

export const GeneralDepartment: string = 'General';

export enum hashAlgorithm {
  bcrypt = 'bcrypt',
  argon2id = 'argon2id',
}

// User is used internally. Currently _id is optional since _id is generated by mongodb.
// May want to use uuid if so, can add replace _id with id and modify the schema accordingly into this.
export interface User {
  _id?: string;
  username: string;
  password: string;
  name: string;
  role: string;
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
  hashAlgorithm?: hashAlgorithm;
}

export interface UserJson {
  id: string;
  name: string;
  username: string;
  role: string;
  department: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserClientModel {
  id: string;
  name: string;
  username: string;
  role: Role;
  department: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export namespace UserApiIn {
  export interface Post {
    username: string;
    password: string;
    department: Department;
    name: string;
    role: Role;
  }

  export interface Put {
    username?: string;
    password?: string;
    department: {
      id: string;
      name: string;
    };
    name: string;
    role: Role;
  }
}

export namespace UserApiOut {
  export interface UserGet extends UserJson {}
  export interface GetMe extends UserJson {}
  export interface GetId extends UserJson {}
  export interface GetAll extends Array<UserJson> {}

  export interface UnknownUserJson extends UserJson {
    id: string;
    name: string;
    username: string;
    role: Role;
    department: {
      id: string;
      name: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }
}
const unknownDepartmentId = '-1';
const unknownDepartmentName = 'Unknown Department';
const unknownUserId = '-1';
const unknownUserName = 'Unknown User';
const unknownUsername = 'unknown';
const unknownRole = 'User';
const unknownDate = new Date(0);

export const unknownUserJson: UserApiOut.UnknownUserJson = {
  id: unknownUserId,
  name: unknownUserName,
  username: unknownUsername,
  role: Role[unknownRole],
  department: {
    id: unknownDepartmentId,
    name: unknownDepartmentName,
  },
  createdAt: unknownDate,
  updatedAt: unknownDate,
};
