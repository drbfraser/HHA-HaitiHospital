"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionGroup = void 0;
//  A parent node in the question tree that supports any question type as child.
const ObjectSerializer_1 = require("../Serializer/ObjectSerializer");
const QuestionParent_1 = require("./QuestionParent");
const QuestionHandler_1 = require("./QuestionHandler");
let QuestionGroup = class QuestionGroup extends QuestionParent_1.QuestionParent {
    constructor(id, ...questions) {
        super(id);
        this.add = (questionItem) => {
            this.questionItems.push(questionItem);
            return this;
        };
        this.addAll = (...questions) => {
            questions.forEach((question) => this.add(question));
            return this;
        };
        this.genericForEach = (handler) => {
            QuestionHandler_1.QuestionHandler.buildGenericHandler(handler).applyForEach(this.questionItems);
        };
        this.forEach = (handlers) => {
            QuestionHandler_1.QuestionHandler.buildHandler(handlers).applyForEach(this.questionItems);
        };
        this.searchById = (id) => {
            return this.questionItems.filter((questionItem) => questionItem.getId() == id)[0];
        };
        questions ? this.addAll(...questions) : undefined;
    }
};
QuestionGroup = __decorate([
    (0, ObjectSerializer_1.serializable)(undefined)
], QuestionGroup);
exports.QuestionGroup = QuestionGroup;
