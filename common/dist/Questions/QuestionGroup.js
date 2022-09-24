"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionHandler = exports.QuestionGroup = void 0;
const ObjectSerializer_1 = require("../Serializer/ObjectSerializer");
const QuestionCollection_1 = require("./QuestionCollection");
const QuestionTypeMapper_1 = require("./QuestionTypeMapper");
let QuestionGroup = class QuestionGroup extends QuestionCollection_1.QuestionCollection {
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
        this.buildHandler = (handlers) => {
            return new QuestionHandler(this.questionItems, handlers);
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
class QuestionHandler extends QuestionTypeMapper_1.QuestionTypeMap {
    constructor(questions, handlers) {
        super(handlers);
        this.apply = () => {
            this.questions.forEach((question) => this.getHandler(question)(question));
        };
        this.questions = questions;
    }
}
exports.QuestionHandler = QuestionHandler;
