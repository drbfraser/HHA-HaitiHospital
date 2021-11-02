// Export empty to make it module
// export {};
// Comment out during JS to TS for future reference
import * as Yup from 'yup';

export const loginSchema = Yup.object({
  username: Yup.string()
    // .email('Invalid email address')
    .min(2, 'Must be 2 characters at minimum')
    .max(20, 'Must be 20 characters or less')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Must be 6 characters at minimum')
    .max(20, 'Must be 20 characters or less')
    .required('Required'),
});
