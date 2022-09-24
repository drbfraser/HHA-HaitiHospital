"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpandableQuestion = void 0;
const QuestionCollection_1 = require("./QuestionCollection");
const QuestionGroup_1 = require("./QuestionGroup");
class ExpandableQuestion extends QuestionCollection_1.QuestionCollection {
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
                    .buildHandler({
                    textQuestion: handler,
                    numericQuestion: handler,
                    singleSelectionQuestion: handler,
                    multipleSelectionQuestion: handler,
                    questionGroup: handler,
                    compositionQuestion: handler,
                    expandableQuestion: handler,
                })
                    .apply();
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
