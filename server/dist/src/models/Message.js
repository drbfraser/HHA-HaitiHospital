"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessage = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var joi_1 = __importDefault(require("joi"));
var Schema = mongoose_1.default.Schema;
var messageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
messageSchema.methods.toJSON = function () {
    var someUser = this.user;
    return {
        id: this._id,
        text: this.text,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        user: someUser.toJSON(),
    };
};
var validateMessage = function (message) {
    var someJoi = joi_1.default;
    var schema = {
        text: joi_1.default.string().min(5).max(300).required(),
    };
    return someJoi.validate(message, schema);
};
exports.validateMessage = validateMessage;
var Message = mongoose_1.default.model('Message', messageSchema);
exports.default = Message;
