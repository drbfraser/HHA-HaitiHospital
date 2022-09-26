"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionLeaf = void 0;
// Should represent a single question and have no nested questions.
const QuestionNode_1 = require("./QuestionNode");
class QuestionLeaf extends QuestionNode_1.QuestionNode {
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
exports.QuestionLeaf = QuestionLeaf;
