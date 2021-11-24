// Common utility functions used throughout the client

export const isUserInDepartment = (userDepartment, wantedDepartment) => {
    if (userDepartment === wantedDepartment) {
        return true;
    }
    return false;
}