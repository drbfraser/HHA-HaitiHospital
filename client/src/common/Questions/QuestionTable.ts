import { serializable } from "common/Serializer/ObjectSerializer";
import { Question } from "./Question";
import { QuestionCollection } from "./QuestionCollection";
import { QuestionItem } from "./QuestionItem";
import { NumericQuestion, TextQuestion } from "./SimpleQuestionTypes";

type table<T> = Array<Array<T>>;

@serializable(undefined, [], [], (row, col) => undefined)
export class QuestionTable<ID, T, QuestionType extends Question<ID, T>> extends QuestionCollection<ID> {

    private readonly rowHeaders: Array<string>;
    private readonly columnHeaders: Array<string>;

    private readonly questionTable: table<QuestionType>;

    /*  The questionCreator is a callback that takes in the row and column index
        for where the question will be placed and returns a created question
        of the type used in the table. The developer is free to choose how to
        create that question and how to use the arguments given in the question
        creation.
    */
    constructor(
        id: ID,
        rowHeaders: Array<string>,
        columnHeaders: Array<string>,
        questionCreator: (row: number, col: number) => QuestionType,
    ) {
        super(id);
        this.rowHeaders = [...rowHeaders];
        this.columnHeaders = [...columnHeaders];

        this.questionTable = (new Array(rowHeaders.length))
            .map((x, row) => new Array(columnHeaders.length)
                .map((x, col) => questionCreator(row, col))
            );
    }

    // Returns undefined if given numbers are out of bound
    public readonly getQuestionAt = (row: number, col: number): QuestionType | undefined => {
        return (row > 0 && row < this.questionTable.length)
            && (col > 0 && col < this.questionTable[0].length) ?
            this.questionTable[row][col] : undefined;
    }

    public readonly getRowHeaders = (): Array<string> => [...this.rowHeaders];

    public readonly getColumnHeaders = (): Array<string> => [...this.columnHeaders];
}