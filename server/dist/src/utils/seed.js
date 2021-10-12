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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDb = void 0;
var faker_1 = __importDefault(require("faker"));
var path_1 = require("path");
var User_1 = __importDefault(require("../models/User"));
var Message_1 = __importDefault(require("../models/Message"));
var utils_1 = require("./utils");
var seedDb = function () { return __awaiter(void 0, void 0, void 0, function () {
    var usersPromises, messagePromises, users, messages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Seeding database...');
                return [4 /*yield*/, User_1.default.deleteMany({})];
            case 1:
                _a.sent();
                return [4 /*yield*/, Message_1.default.deleteMany({})];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, utils_1.deleteAllAvatars)((0, path_1.join)(__dirname, '../..', process.env.IMAGES_FOLDER_PATH))];
            case 3:
                _a.sent();
                usersPromises = __spreadArray([], Array(3).keys(), true).map(function (index, i) {
                    var user = new User_1.default({
                        provider: 'email',
                        username: "user" + index,
                        email: "email" + index + "@email.com",
                        password: '123456789',
                        name: faker_1.default.name.findName(),
                        // avatar: faker.image.avatar(),
                        avatar: "avatar" + index + ".jpg",
                        bio: faker_1.default.lorem.sentences(3),
                    });
                    if (index === 0) {
                        user.role = 'ADMIN';
                    }
                    user.registerUser(user, function () { });
                    return user;
                });
                return [4 /*yield*/, Promise.all(usersPromises.map(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, user.save()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 4:
                _a.sent();
                messagePromises = __spreadArray([], Array(9).keys(), true).map(function (index, i) {
                    var message = new Message_1.default({
                        text: faker_1.default.lorem.sentences(3),
                    });
                    return message;
                });
                return [4 /*yield*/, Promise.all(messagePromises.map(function (message) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, message.save()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 5:
                _a.sent();
                return [4 /*yield*/, User_1.default.find()];
            case 6:
                users = _a.sent();
                return [4 /*yield*/, Message_1.default.find()];
            case 7:
                messages = _a.sent();
                // every user 3 messages
                users.map(function (user, index) { return __awaiter(void 0, void 0, void 0, function () {
                    var threeMessagesIds;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                threeMessagesIds = messages.slice(index * 3, index * 3 + 3).map(function (m) { return m.id; });
                                return [4 /*yield*/, User_1.default.updateOne({ _id: user.id }, { $push: { messages: threeMessagesIds } })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                // 0,1,2 message belong to user 0 ...
                messages.map(function (message, index) { return __awaiter(void 0, void 0, void 0, function () {
                    var j, user;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                j = Math.floor(index / 3);
                                user = users[j];
                                return [4 /*yield*/, Message_1.default.updateOne({ _id: message.id }, {
                                        $set: {
                                            user: user.id,
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                console.log('Database seeded');
                return [2 /*return*/];
        }
    });
}); };
exports.seedDb = seedDb;
