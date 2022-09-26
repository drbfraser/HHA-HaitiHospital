"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionParent = void 0;
/*  QuestionParent represents a parent node in the question three. A parent
    question can have multiple children question. This type is meant to be
    further specialized to determine the constraints on how to operate upon
    its children questions and what kinds of children questions it can have.
*/
const QuestionNode_1 = require("./QuestionNode");
class QuestionParent extends QuestionNode_1.QuestionNode {
}
exports.QuestionParent = QuestionParent;
