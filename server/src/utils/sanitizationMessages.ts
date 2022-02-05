const msgBoolean = 'Must be a boolean';
const msgNumber = 'Must be a number';
const msgStringMulti = (min: number, max: number) => {
  return `Must have a length of at least ${min} characters and at most ${max} characters`;
};
const msgString = 'Must have a length of at least 1 character';
const msgDate = 'Must be in format yyyy:mm:dd hh:mm:ss';

export { msgBoolean, msgNumber, msgStringMulti, msgString, msgDate };
