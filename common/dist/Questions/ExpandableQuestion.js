"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpandableQuestion = void 0;
/*  An expandable question represents a question whose answer determines how
    many groups of questions should be "expanded". One example of an expandable
    question is "How many people were hospitalized?". If the answer to this
    question is "3", then 3 groups of questions relating to the hospitalized
    patients are expanded (questions such as "Cause of hospitalization", or
    "Age"), where each expanded group of questions might relate to each
    hospitalized person.
*/
const QuestionParent_1 = require("./QuestionParent");
const QuestionGroup_1 = require("./QuestionGroup");
class ExpandableQuestion extends QuestionParent_1.QuestionParent {
    constructor(id, idGenerator, defaultAnswer, ...questions) {
        super(id);
        this.addToTemplate = (questionItem) => {
            this.questionsTemplate.add(questionItem);
            return this;
        };
        this.addAllToTemplate = (...questions) => {
            this.questionsTemplate.addAll(...questions);
            return this;
        };
        this.searchById = (id) => {
            return this.questionGroups
                .map((questionGroup) => questionGroup.searchById(id))
                .find((question) => question !== undefined);
        };
        this.expand = () => {
            var _a;
            let questionItemAdder = (questionGroup) => {
                return (questionItem) => {
                    questionGroup.add(questionItem);
                };
            };
            this.questionGroups = new Array((_a = this.answer) !== null && _a !== void 0 ? _a : 0)
                .fill(undefined)
                .map((x, index) => new QuestionGroup_1.QuestionGroup(this.idGenerator(index)))
                .map((questionGroup) => {
                let handler = () => questionItemAdder(questionGroup);
                this.questionsTemplate
                    .genericForEach(handler);
                return questionGroup;
            });
        };
        this.setAnswer = (answer) => {
            this.answer = answer;
            this.expand();
        };
        this.getAnswer = () => this.answer;
        this.idGenerator = idGenerator;
        this.questionsTemplate = new QuestionGroup_1.QuestionGroup(undefined).addAll(...questions);
        this.setAnswer(defaultAnswer);
    }
}
exports.ExpandableQuestion = ExpandableQuestion;
