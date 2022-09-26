"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumericTable = exports.TextTable = void 0;
// Module containing question tables that have simple data as their question
// answers.
const ObjectSerializer_1 = require("../Serializer/ObjectSerializer");
const QuestionTable_1 = require("./QuestionTable");
let TextTable = class TextTable extends QuestionTable_1.QuestionTable {
};
TextTable = __decorate([
    (0, ObjectSerializer_1.serializable)(undefined, [], [], () => undefined)
], TextTable);
exports.TextTable = TextTable;
let NumericTable = class NumericTable extends QuestionTable_1.QuestionTable {
};
NumericTable = __decorate([
    (0, ObjectSerializer_1.serializable)(undefined, [], [], () => undefined)
], NumericTable);
exports.NumericTable = NumericTable;
