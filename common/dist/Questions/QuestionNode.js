"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionNode = void 0;
/*  Represents a question node in the question tree. This class encapsulates
    all data and capabilities common to all nodes in the question tree.
    
    Its type is meant to be further specialized to determine the kind of node it
    represents and what other capabilities it should support.
*/
class QuestionNode {
    constructor(id) {
        this.getId = () => this.id;
        this.id = id;
    }
}
exports.QuestionNode = QuestionNode;
