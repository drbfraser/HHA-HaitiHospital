import { Role } from 'models/user';

export namespace UserApiIn {
  export interface Post {
    username: string;
    password: string;
    department: {
      id: string;
      name: string;
    };
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

  export interface GetMe extends UserJson {}
  export interface GetId extends UserJson {}
  export interface GetAll extends Array<UserJson> {}
}
