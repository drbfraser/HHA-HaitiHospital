import { QuestionItem } from "./QuestionItem";

export abstract class QuestionCollection<ID> extends QuestionItem<ID> { 

    /*  This method takes in a callback which gets an array of user-defined IDs
        and returns the index corresponding to the ID that has been found. This
        allows for suitable searching heuristics to be implemented depending
        on the nature of the ID. May return undefined if the searcher returns
        an out-of-bound index.
    */
    abstract searchById:(searcher: (ids: Array<ID>) => number) => QuestionItem<ID> | undefined;
}