"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var joi_1 = __importDefault(require("joi"));
var faker_1 = __importDefault(require("faker"));
var User_1 = __importDefault(require("../models/User"));
var requireLocalAuth_1 = __importDefault(require("../middleware/requireLocalAuth"));
var validators_1 = require("../services/validators");
var router = (0, express_1.Router)();
router.post('/login', requireLocalAuth_1.default, function (req, res) {
    var reqUser = req.user;
    var token = reqUser.generateJWT();
    var me = reqUser.toJSON();
    res.json({ token: token, me: me });
});
router.post('/register', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var someJoi, error, _a, email, password, name, username, existingUser, newUser, err_1, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                someJoi = joi_1.default;
                error = someJoi.validate(req.body, validators_1.registerSchema).error;
                if (error) {
                    return [2 /*return*/, res.status(422).send({ message: error.details[0].message })];
                }
                _a = req.body, email = _a.email, password = _a.password, name = _a.name, username = _a.username;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 2:
                existingUser = _b.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(422).send({ message: 'Email is in use' })];
                }
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, new User_1.default({
                        provider: 'email',
                        email: email,
                        password: password,
                        username: username,
                        name: name,
                        avatar: faker_1.default.image.avatar(),
                    })];
            case 4:
                newUser = _b.sent();
                newUser.registerUser(newUser, function (err, user) {
                    if (err)
                        throw err;
                    res.json({ message: 'Register success.' }); // just redirect to login
                });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                return [2 /*return*/, next(err_1)];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_2 = _b.sent();
                return [2 /*return*/, next(err_2)];
            case 8: return [2 /*return*/];
        }
    });
}); });
// logout
router.get('/logout', function (req, res) {
    req.logout();
    res.send(false);
});
exports.default = router;
