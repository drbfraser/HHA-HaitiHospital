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
var requireJwtAuth_1 = __importDefault(require("../../middleware/requireJwtAuth"));
var Message_1 = __importStar(require("../../models/Message"));
var router = (0, express_1.Router)();
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Message_1.default.find().sort({ createdAt: 'desc' }).populate('user')];
            case 1:
                messages = _a.sent();
                res.json({
                    messages: messages.map(function (m) {
                        return m.toJSON();
                    }),
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(500).json({ message: 'Something went wrong.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Message_1.default.findById(req.params.id).populate('user')];
            case 1:
                message = _a.sent();
                if (!message)
                    return [2 /*return*/, res.status(404).json({ message: 'No message found.' })];
                res.json({ message: message.toJSON() });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(500).json({ message: 'Something went wrong.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/', requireJwtAuth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error, reqUser, message, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                error = (0, Message_1.validateMessage)(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).json({ message: error.details[0].message })];
                reqUser = req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Message_1.default.create({
                        text: req.body.text,
                        user: reqUser.id,
                    })];
            case 2:
                message = _a.sent();
                return [4 /*yield*/, message.populate('user').execPopulate()];
            case 3:
                message = _a.sent();
                res.status(200).json({ message: message.toJSON() });
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                res.status(500).json({ message: 'Something went wrong.' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.delete('/:id', requireJwtAuth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tempMessage, reqUser, message, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Message_1.default.findById(req.params.id).populate('user')];
            case 1:
                tempMessage = _a.sent();
                reqUser = req.user;
                if (!(tempMessage.user.id === reqUser.id || reqUser.role === 'ADMIN'))
                    return [2 /*return*/, res.status(400).json({ message: 'Not the message owner or admin.' })];
                return [4 /*yield*/, Message_1.default.findByIdAndRemove(req.params.id).populate('user')];
            case 2:
                message = _a.sent();
                if (!message)
                    return [2 /*return*/, res.status(404).json({ message: 'No message found.' })];
                res.status(200).json({ message: message });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                res.status(500).json({ message: 'Something went wrong.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put('/:id', requireJwtAuth_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error, tempMessage, reqUser, message, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                error = (0, Message_1.validateMessage)(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).json({ message: error.details[0].message })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, Message_1.default.findById(req.params.id).populate('user')];
            case 2:
                tempMessage = _a.sent();
                reqUser = req.user;
                if (!(tempMessage.user.id === reqUser.id || reqUser.role === 'ADMIN'))
                    return [2 /*return*/, res.status(400).json({ message: 'Not the message owner or admin.' })];
                return [4 /*yield*/, Message_1.default.findByIdAndUpdate(req.params.id, { text: req.body.text, user: tempMessage.user.id }, { new: true })];
            case 3:
                message = _a.sent();
                if (!message)
                    return [2 /*return*/, res.status(404).json({ message: 'No message found.' })];
                return [4 /*yield*/, message.populate('user').execPopulate()];
            case 4:
                message = _a.sent();
                res.status(200).json({ message: message });
                return [3 /*break*/, 6];
            case 5:
                err_5 = _a.sent();
                res.status(500).json({ message: 'Something went wrong.' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
