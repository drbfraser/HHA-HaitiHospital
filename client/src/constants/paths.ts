// Make sure slug's value matches with its corresponding variable name
const USER_ID_SLUG: string = 'userId';
export type UserIdParams = {
  userId: string;
};

// Patterns
export const ADMIN_MAIN: string = '/admin';
export const ADMIN_ADD_USER: string = `${ADMIN_MAIN}/add-user`;
export const ADMIN_EDIT_USER: string = `${ADMIN_MAIN}/edit-user/:${USER_ID_SLUG}`;

// URL instances
export const getAdminEditUser = (userId: string): string => {
    return `${ADMIN_MAIN}/edit-user/${userId}`;
}