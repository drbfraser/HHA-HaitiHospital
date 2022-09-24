"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionTypeMap = void 0;
const CompositionQuestion_1 = require("./CompositionQuestion");
const ExpandableQuestion_1 = require("./ExpandableQuestion");
const MultipleChoice_1 = require("./MultipleChoice");
const QuestionGroup_1 = require("./QuestionGroup");
const SimpleQuestionTypes_1 = require("./SimpleQuestionTypes");
class QuestionTypeMap {
    constructor(questionMapper) {
        this.getHandler = (question) => {
            return Object.values(this.questionMapper).find((classNameMap) => classNameMap.className === question.constructor.name);
        };
        this.questionMapper = {
            textQuestion: { className: SimpleQuestionTypes_1.TextQuestion.name, handler: questionMapper.textQuestion },
            numericQuestion: { className: SimpleQuestionTypes_1.NumericQuestion.name, handler: questionMapper.numericQuestion },
            singleSelectionQuestion: {
                className: MultipleChoice_1.SingleSelectionQuestion.name,
                handler: questionMapper.singleSelectionQuestion,
            },
            multipleSelectionQuestion: {
                className: MultipleChoice_1.MultipleSelectionQuestion.name,
                handler: questionMapper.multipleSelectionQuestion,
            },
            questionGroup: { className: QuestionGroup_1.QuestionGroup.name, handler: questionMapper.questionGroup },
            compositionQuestion: {
                className: CompositionQuestion_1.CompositionQuestion.name,
                handler: questionMapper.compositionQuestion,
            },
            expandableQuestion: {
                className: ExpandableQuestion_1.ExpandableQuestion.name,
                handler: questionMapper.expandableQuestion,
            },
        };
    }
}
exports.QuestionTypeMap = QuestionTypeMap;
