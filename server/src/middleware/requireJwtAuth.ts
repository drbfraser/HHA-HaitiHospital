import passport from 'passport';

const requireJwtAuth = passport.authenticate('jwt');

export default requireJwtAuth;
