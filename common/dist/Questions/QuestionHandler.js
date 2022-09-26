"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionHandler = void 0;
/*  A handler that enforces exhaustively handling all types of questions.

    The purpose of this module is to help the developer by enforcing proper
    handling (routine definition) of all question types at compile-time. The
    current design leverages types to define the question semantics and
    capabilities, and because there are currently multiple question types, and
    question types might be changed or added in the future, there is a high risk
    that code that acts upon (handles) these questions might not be updated to
    properly handle the new changes. In such case, the errors are probably going
    to be caught at runtime and significant time might be spent identifying the
    problem.

    The QuestionHandler class below will enforce handling of all question types
    by not transpiling if all question types are not exhaustively handled. This
    is accomplished by having QuestionHandler's constructor which takes in a
    handler for every question type, thus leveraging the question type full
    capabilities and also not transpiling if the proper handler is not provided.

    **Any modifications to the question types must be reflected in the
    constructs defined in this module for the exhaustive handling enforcement to
    take effect**
*/
const CompositionQuestion_1 = require("./CompositionQuestion");
const ExpandableQuestion_1 = require("./ExpandableQuestion");
const MultipleChoice_1 = require("./MultipleChoice");
const QuestionGroup_1 = require("./QuestionGroup");
const SimpleQuestionTypes_1 = require("./SimpleQuestionTypes");
class QuestionHandler {
    constructor(questionMapper) {
        this.getHandler = (question) => {
            return Object.values(this.questionMapper).find((classNameMap) => classNameMap.className === question.constructor.name);
        };
        this.apply = (question) => {
            this.getHandler(question)(question);
        };
        this.applyForEach = (questions) => {
            questions.forEach((question) => this.apply(question));
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
exports.QuestionHandler = QuestionHandler;
// Used to construct type-specific handlers
QuestionHandler.buildHandler = (handlers) => {
    return new QuestionHandler(handlers);
};
// Used when the handler is the same for all question types.
QuestionHandler.buildGenericHandler = (handler) => {
    return new QuestionHandler({
        textQuestion: handler,
        numericQuestion: handler,
        singleSelectionQuestion: handler,
        multipleSelectionQuestion: handler,
        questionGroup: handler,
        compositionQuestion: handler,
        expandableQuestion: handler
    });
};
