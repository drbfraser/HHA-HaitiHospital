"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
var joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().email().required(),
    password: joi_1.default.string().trim().min(6).max(20).required(),
});
exports.registerSchema = joi_1.default.object().keys({
    name: joi_1.default.string().trim().min(2).max(30).required(),
    username: joi_1.default.string()
        .trim()
        .min(2)
        .max(20)
        .regex(/^[a-zA-Z0-9_]+$/)
        .required(),
    email: joi_1.default.string().trim().email().required(),
    password: joi_1.default.string().trim().min(6).max(20).required(),
});
