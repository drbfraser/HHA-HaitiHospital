/*  QuestionParent represents a parent node in the question three. A parent
    question can have multiple children question. This type is meant to be
    further specialized to determine the constraints on how to operate upon
    its children questions and what kinds of children questions it can have.
*/
import { QuestionNode } from './QuestionNode';

export abstract class QuestionParent<ID, ErrorType> extends QuestionNode<ID, ErrorType> {
  /*  Retrieves a QuestionItem with the given ID or undefined if it was 
        found. If more than one QuestionItem with the same ID exists, then this
        function might return either QuestionItem.
    */
  abstract searchById(id: ID): QuestionNode<ID, ErrorType> | undefined;
}
