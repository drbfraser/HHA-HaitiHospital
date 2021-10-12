"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var multer_1 = __importDefault(require("multer"));
var path_1 = require("path");
var requireJwtAuth_1 = __importDefault(require("../../middleware/requireJwtAuth"));
var User_1 = __importStar(require("../../models/User"));
var Message_1 = __importDefault(require("../../models/Message"));
var seed_1 = require("../../utils/seed");
var router = (0, express_1.Router)();
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, (0, path_1.resolve)(__dirname, '../../../public/images'));
    },
    filename: function (req, file, cb) {
        var fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, "avatar-" + Date.now() + "-" + fileName);
    },
});
var upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});
//`checkit`, which is probably the option I'd suggest if  `validatem`
router.put('/:id', [requireJwtAuth_1.default, upload.single('avatar')], function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tempUser, reqUser, error, avatarPath, password, existingUser, updatedUser_1, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, User_1.default.findById(req.params.id)];
            case 1:
                tempUser = _a.sent();
                reqUser = req.user;
                if (!tempUser)
                    return [2 /*return*/, res.status(404).json({ message: 'No such user.' })];
                if (!(tempUser.id === reqUser.id || reqUser.role === 'ADMIN'))
                    return [2 /*return*/, res.status(400).json({ message: 'You do not have privilegies to edit this user.' })];
                error = (0, User_1.validateUser)(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).json({ message: error.details[0].message })];
                avatarPath = null;
                if (req.file) {
                    avatarPath = req.file.filename;
                }
                password = null;
                if (!(reqUser.provider === 'email' && req.body.password && req.body.password !== '')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, User_1.hashPassword)(req.body.password)];
            case 2:
                password = _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, User_1.default.findOne({ username: req.body.username })];
            case 4:
                existingUser = _a.sent();
                if (existingUser && existingUser.id !== tempUser.id) {
                    return [2 /*return*/, res.status(400).json({ message: 'Username alredy taken.' })];
                }
                updatedUser_1 = { avatar: avatarPath, name: req.body.name, username: req.body.username, password: password };
                // remove '', null, undefined
                Object.keys(updatedUser_1).forEach(function (k) { return !updatedUser_1[k] && updatedUser_1[k] !== undefined && delete updatedUser_1[k]; });
                return [4 /*yield*/, User_1.default.findByIdAndUpdate(tempUser.id, { $set: updatedUser_1 }, { new: true })];
            case 5:
                user = _a.sent();
                res.status(200).json({ user: user });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                res.status(500).json({ message: 'Something went wrong.' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get('/reseed', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, seed_1.seedDb)()];
            case 1:
                _a.sent();
                res.json({ message: 'Database reseeded successfully.' });
                return [2 /*return*/];
        }
    });
}); });
router.get('/me', requireJwtAuth_1.default, function (req, res) {
    var reqUser = req.user;
    var me = reqUser.toJSON();
    res.json({ me: me });
});
router.get('/:username', requireJwtAuth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findOne({ username: req.params.username })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: 'No user found.' })];
                res.json({ user: user.toJSON() });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(500).json({ message: 'Something went wrong.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/', requireJwtAuth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.find().sort({ createdAt: 'desc' })];
            case 1:
                users = _a.sent();
                res.json({
                    users: users.map(function (m) {
                        return m.toJSON();
                    }),
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(500).json({ message: 'Something went wrong.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/:id', requireJwtAuth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tempUser, reqUser, user, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, User_1.default.findById(req.params.id)];
            case 1:
                tempUser = _a.sent();
                reqUser = req.user;
                if (!tempUser)
                    return [2 /*return*/, res.status(404).json({ message: 'No such user.' })];
                if (!(tempUser.id === reqUser.id || reqUser.role === 'ADMIN'))
                    return [2 /*return*/, res.status(400).json({ message: 'You do not have privilegies to delete that user.' })];
                // if (['email0@email.com', 'email1@email.com'].includes(tempUser.email))
                //   return res.status(400).json({ message: 'You can not delete seeded user.' });
                //delete all messages from that user
                return [4 /*yield*/, Message_1.default.deleteMany({ user: tempUser.id })];
            case 2:
                // if (['email0@email.com', 'email1@email.com'].includes(tempUser.email))
                //   return res.status(400).json({ message: 'You can not delete seeded user.' });
                //delete all messages from that user
                _a.sent();
                return [4 /*yield*/, User_1.default.findByIdAndRemove(tempUser.id)];
            case 3:
                user = _a.sent();
                res.status(200).json({ user: user });
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                res.status(500).json({ message: 'Something went wrong.' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
