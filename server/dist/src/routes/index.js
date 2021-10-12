"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var localAuth_1 = __importDefault(require("./localAuth"));
var api_1 = __importDefault(require("./api"));
var router = (0, express_1.Router)();
router.use('/auth', localAuth_1.default);
router.use('/api', api_1.default);
// fallback 404
router.use('/api', function (req, res) { return res.status(404).json('No route for this path'); });
exports.default = router;
/*
routes:

GET /auth/google
GET /auth/google/callback

GET /auth/facebook
GET /auth/facebook/callback

POST /auth/login
POST /auth/register
GET /auth/logout

GET api/users/me
GET /api/users/feature

*/
