"use strict";
exports.__esModule = true;
// import passport from 'passport';
var passport = require("passport");
var requireLocalAuth = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(422).send(info);
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports["default"] = requireLocalAuth;
