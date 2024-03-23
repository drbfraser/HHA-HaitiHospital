// import { Role } from 'models/user';

// export namespace UserApiIn {
//   export interface Post {
//     username: string;
//     password: string;
//     department: {
//       id: string;
//       name: string;
//     };
//     name: string;
//     role: Role;
//   }

//   export interface Put {
//     username?: string;
//     password?: string;
//     department: {
//       id: string;
//       name: string;
//     };
//     name: string;
//     role: Role;
//   }
// }

// export namespace UserApiOut {
//   export interface UserJson {
//     id: string;
//     name: string;
//     username: string;
//     role: string;
//     department: {
//       id: string;
//       name: string;
//     };
//     createdAt: Date;
//     updatedAt: Date;
//   }

//   export interface GetMe extends UserJson {}
//   export interface GetId extends UserJson {}
//   export interface GetAll extends Array<UserJson> {}

//   export interface UnknownUserJson extends UserJson {
//     id: string;
//     name: string;
//     username: string;
//     role: string;
//     department: {
//       id: string;
//       name: string;
//     };
//     createdAt: Date;
//     updatedAt: Date;
//   }
// }
// const unknownDepartmentId = '-1';
// const unknownDepartmentName = 'Unknown Department';
// const unknownUserId = '-1';
// const unknownUserName = 'Unknown User';
// const unknownUsername = 'unknown';
// const unknownRole = 'User';
// const unknownDate = new Date(0);

// export const unknownUserJson: UserApiOut.UnknownUserJson = {
//   id: unknownUserId,
//   name: unknownUserName,
//   username: unknownUsername,
//   role: unknownRole,
//   department: {
//     id: unknownDepartmentId,
//     name: unknownDepartmentName,
//   },
//   createdAt: unknownDate,
//   updatedAt: unknownDate,
// };
