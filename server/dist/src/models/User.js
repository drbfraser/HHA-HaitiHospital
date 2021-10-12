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
exports.validateUser = exports.validateUserSchema = exports.hashPassword = void 0;
var path_1 = require("path");
var mongoose_1 = __importDefault(require("mongoose"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var joi_1 = __importDefault(require("joi"));
var Schema = mongoose_1.default.Schema;
var userSchema = new Schema({
    provider: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9_]+$/, 'is invalid'],
        index: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
    },
    password: {
        type: String,
        trim: true,
        minlength: 6,
        maxlength: 60,
    },
    name: String,
    // avatar: String,
    role: { type: String, default: 'USER' },
    bio: String,
    // TODO: Remove the commented code when we confirm that this file works.
    // google
    // googleId: {
    //   type: String,
    //   unique: true,
    //   sparse: true,
    // },
    // // fb
    // facebookId: {
    //   type: String,
    //   unique: true,
    //   sparse: true,
    // },
    messages: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true });
console.log((0, path_1.join)(__dirname, '../..', process.env.IMAGES_FOLDER_PATH));
userSchema.methods.toJSON = function () {
    // // if not exists avatar1 default
    // const absoluteAvatarFilePath = `${join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH)}${this.avatar}`;
    // const avatar = isValidUrl(this.avatar)
    //   ? this.avatar
    //   : fs.existsSync(absoluteAvatarFilePath)
    //   ? `${process.env.IMAGES_FOLDER_PATH}${this.avatar}`
    //   : `${process.env.IMAGES_FOLDER_PATH}avatar2.jpg`;
    return {
        id: this._id,
        provider: this.provider,
        email: this.email,
        username: this.username,
        // avatar: avatar,
        name: this.name,
        role: this.role,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};
var isProduction = process.env.NODE_ENV === 'production';
var secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;
userSchema.methods.generateJWT = function () {
    var token = jsonwebtoken_1.default.sign({
        expiresIn: '12h',
        id: this._id,
        provider: this.provider,
        email: this.email,
    }, secretOrKey);
    return token;
};
userSchema.methods.registerUser = function (newUser, callback) {
    bcryptjs_1.default.genSalt(10, function (err, salt) {
        bcryptjs_1.default.hash(newUser.password, salt, function (errh, hash) {
            if (err) {
                console.log(err);
            }
            // set pasword to hash
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    // @ts-ignore
    bcryptjs_1.default.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err)
            return callback(err);
        callback(null, isMatch);
    });
};
// const delay = (t, ...vs) => new Promise(r => setTimeout(r, t, ...vs)) or util.promisify(setTimeout)
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        var saltRounds, hashedPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    saltRounds = 10;
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            bcryptjs_1.default.hash(password, saltRounds, function (err, hash) {
                                if (err)
                                    reject(err);
                                else
                                    resolve(hash);
                            });
                        })];
                case 1:
                    hashedPassword = _a.sent();
                    return [2 /*return*/, hashedPassword];
            }
        });
    });
}
exports.hashPassword = hashPassword;
exports.validateUserSchema = joi_1.default.object().keys({
    name: joi_1.default.string().min(2).max(30).required(),
    username: joi_1.default.string()
        .min(2)
        .max(20)
        .regex(/^[a-zA-Z0-9_]+$/)
        .required(),
    password: joi_1.default.string().min(6).max(20).allow('').allow(null),
});
var validateUser = function (user) {
    // const schema = {
    //   avatar: Joi.any(),
    //   name: Joi.string().min(2).max(30).required(),
    //   username: Joi.string()
    //     .min(2)
    //     .max(20)
    //     .regex(/^[a-zA-Z0-9_]+$/)
    //     .required(),
    //   password: Joi.string().min(6).max(20).allow('').allow(null),
    // };
    // return Joi.validate(user, schema);
    return exports.validateUserSchema.validate(user);
};
exports.validateUser = validateUser;
var User = mongoose_1.default.model('User', userSchema);
exports.default = User;
