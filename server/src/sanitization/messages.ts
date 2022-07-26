const msgBoolean = 'Must be a boolean';
const msgNumber = 'Must be a number';
const msgStringMulti = (min: number, max: number) => {
  return `Must have a length of at least ${min} characters and at most ${max} characters`;
};
const msgString = 'Must have a length of at least 1 character';
const msgDate = 'Must be in format yyyy:mm:dd hh:mm:ss';
const msgCatchError = { message: 'Something went wrong.' };

export { msgBoolean, msgNumber, msgStringMulti, msgString, msgDate, msgCatchError };

export const EXPECTING_DEPARTMENT: string = "Expecting department information";
export const INVALID_DEPARTMENT: string = `Department information is invalid`;
export const EXPECTING_NAME: string = `Expecting user name`;
export const INVALID_ROLE: string = `Role information is invalid`;
export const EXPECTING_ROLE: string = `Expecting role information`;