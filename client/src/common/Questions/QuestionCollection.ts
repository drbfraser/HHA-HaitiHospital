import { QuestionItem } from "./QuestionItem";

export abstract class QuestionCollection<ID> extends QuestionItem<ID> { 
   
    /*  Retrieves a QuestionItem with the given ID or undefined if it was 
        found. If more than one QuestionItem with the same ID exists, then this
        function might return either QuestionItem.
    */
    abstract searchById:(id: ID) => QuestionItem<ID> | undefined;
}