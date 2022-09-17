/*  QuestionCollection has QuestionItems, so that it allows for individual
    questions as much as nested collections of questions.
*/
import { QuestionItem } from './QuestionItem';

export abstract class QuestionCollection<ID, ErrorType> extends QuestionItem<ID, ErrorType> {
  /*  Retrieves a QuestionItem with the given ID or undefined if it was 
        found. If more than one QuestionItem with the same ID exists, then this
        function might return either QuestionItem.
    */
  abstract searchById: (id: ID) => QuestionItem<ID, ErrorType> | undefined;
}
