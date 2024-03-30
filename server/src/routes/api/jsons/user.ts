import { Role, UserJson } from '@hha/common';

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
  export interface UserGet extends UserJson {}
  export interface GetMe extends UserJson {}
  export interface GetId extends UserJson {}
  export interface GetAll extends Array<UserJson> {}
}
