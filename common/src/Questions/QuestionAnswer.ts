import { QuestionNode } from './QuestionNode';
import { QuestionParent } from './QuestionParent';

export interface QuestionAnswer<T> {
  getAnswer(): T | undefined;
}

export abstract class QuestionAnswerNode<ID, T, ErrorType>
  extends QuestionNode<ID, ErrorType>
  implements QuestionAnswer<T>
{
  abstract getAnswer(): T | undefined;
}

export abstract class QuestionAnswerParent<ID, T, ErrorType>
  extends QuestionParent<ID, ErrorType>
  implements QuestionAnswer<T>
{
  abstract getAnswer(): T | undefined;
}
