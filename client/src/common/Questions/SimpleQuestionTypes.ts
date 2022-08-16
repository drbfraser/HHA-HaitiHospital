import { serializable } from '../Serializer/ObjectSerializer';
import { Question } from './Question';

@serializable(undefined, '')
export class TextQuestion<ID, ErrorType> extends Question<ID, string, ErrorType> {}

@serializable(undefined, '')
export class NumericQuestion<ID, ErrorType> extends Question<ID, number, ErrorType> {}
