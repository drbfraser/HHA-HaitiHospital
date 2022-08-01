import { serializable } from '../Serializer/ObjectSerializer';
import { Question } from './Question';

@serializable(undefined, '')
export class TextQuestion<ID> extends Question<ID, string> {}

@serializable(undefined, '')
export class NumericQuestion<ID> extends Question<ID, number> {}
