// Make sure slug's value matches with its corresponding variable name
const USER_ID_SLUG: string = 'userId';
export type UserIdParams = {
  userId: string;
};

// Patterns
const ADMIN_MAIN: string = '/admin';
const ADMIN_ADD_USER: string = `${ADMIN_MAIN}/add-user`;
const ADMIN_EDIT_USER: string = `${ADMIN_MAIN}/edit-user/:${USER_ID_SLUG}`;

// URL instances
const getAdminEditUser = (userId: string): string => {
    return `${ADMIN_MAIN}/edit-user/${userId}`;
}
const getAdminMain = (): string => {
    return `${ADMIN_MAIN}`;
}
const getAdminAddUser = (): string =>{
    return `${ADMIN_ADD_USER}`;
}

export const Paths = {
    getAdminMain,
    getAdminAddUser,
    getAdminEditUser
}

export const PathPatterns = {
    ADMIN_MAIN,
    ADMIN_ADD_USER,
    ADMIN_EDIT_USER
}