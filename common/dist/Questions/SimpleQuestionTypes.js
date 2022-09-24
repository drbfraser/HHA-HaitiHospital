"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumericQuestion = exports.TextQuestion = void 0;
const ObjectSerializer_1 = require("../Serializer/ObjectSerializer");
const Question_1 = require("./Question");
let TextQuestion = class TextQuestion extends Question_1.Question {
};
TextQuestion = __decorate([
    (0, ObjectSerializer_1.serializable)(undefined, '')
], TextQuestion);
exports.TextQuestion = TextQuestion;
let NumericQuestion = class NumericQuestion extends Question_1.Question {
};
NumericQuestion = __decorate([
    (0, ObjectSerializer_1.serializable)(undefined, '')
], NumericQuestion);
exports.NumericQuestion = NumericQuestion;
