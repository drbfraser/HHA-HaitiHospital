"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositionQuestion = void 0;
const ObjectSerializer_1 = require("../Serializer/ObjectSerializer");
const QuestionCollection_1 = require("./QuestionCollection");
let CompositionQuestion = class CompositionQuestion extends QuestionCollection_1.QuestionCollection {
    constructor(id, defaultAnswer, ...questions) {
        super(id);
        this.searchById = (id) => {
            return this.questions.find((question) => question.getId() === id);
        };
        this.add = (numericQuestion) => {
            this.questions.push(numericQuestion);
            return this;
        };
        this.addAll = (...questions) => {
            questions.forEach((question) => this.add(question));
            return this;
        };
        this.handleNumericQuestions = (handler) => {
            this.questions.forEach((question) => handler(question));
        };
        this.getAnswer = () => this.answer;
        // Changes answer if given a non-negative number
        this.setAnswer = (answer) => {
            this.answer = answer >= 0 ? answer : this.answer;
        };
        this.sumsUp = () => {
            return this.answer ? this.questions.map((question) => question.getAnswer()).reduce((answer1, answer2) => answer1 + answer2) === this.answer : false;
        };
        this.setAnswer(defaultAnswer);
        questions ? this.addAll(...questions) : undefined;
    }
};
CompositionQuestion = __decorate([
    (0, ObjectSerializer_1.serializable)(undefined)
], CompositionQuestion);
exports.CompositionQuestion = CompositionQuestion;
