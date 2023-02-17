import { QuestionNode } from '.';

export interface QuestionAnswer<ID, ErrorType> {
  getAnswer(): number | undefined;
}

//export type QuestionAnswerNode<ID, ErrorType> = QuestionAnswer<ID, ErrorType> & QuestionNode<ID, ErrorType>;
export interface QuestionAnswerNode<ID, ErrorType> extends QuestionAnswer<ID, ErrorType>, QuestionNode<ID, ErrorType> {
}
