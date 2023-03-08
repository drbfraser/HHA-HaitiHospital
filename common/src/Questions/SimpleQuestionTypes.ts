// Leaf questions in the question tree for questions with simple data types as
// answers.
import { serializable } from '../Serializer/ObjectSerializer';
import { QuestionLeaf } from './QuestionLeaf';

@serializable(undefined, '')
export class TextQuestion<ID, ErrorType> extends QuestionLeaf<ID, string, ErrorType> {}

@serializable(undefined, '')
export class NumericQuestion<ID, ErrorType> extends QuestionLeaf<ID, number, ErrorType> {}
