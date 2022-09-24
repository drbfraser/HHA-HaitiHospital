"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const QuestionItem_1 = require("./QuestionItem");
class Question extends QuestionItem_1.QuestionItem {
    constructor(id, prompt, defaultAnswer) {
        super(id);
        this.getPrompt = () => this.prompt;
        this.getAnswer = () => this.answer;
        this.setAnswer = (answer) => {
            this.answer = answer;
        };
        this.addValidator = (validator) => {
            this.validators.push(validator);
        };
        this.isValid = () => {
            return this.validators
                .map((validator) => validator(this.answer).isValid)
                .reduce((isValid1, isValid2) => isValid1 && isValid2);
        };
        this.getValidationResults = () => {
            return this.validators.map((validator) => validator(this.answer));
        };
        this.prompt = prompt;
        this.answer = defaultAnswer;
        this.validators = new Array();
    }
}
exports.Question = Question;
