"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var users_1 = __importDefault(require("./users"));
var messages_1 = __importDefault(require("./messages"));
var nicuPaeds_1 = __importDefault(require("./nicuPaeds"));
var router = (0, express_1.Router)();
router.use('/users', users_1.default);
router.use('/messages', messages_1.default);
router.use('/NicuPaeds', nicuPaeds_1.default);
exports.default = router;
