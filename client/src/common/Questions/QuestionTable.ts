import { Question } from "./Question";
import { QuestionCollection } from "./QuestionCollection";
import { QuestionItem } from "./QuestionItem";

type table<T> = Array<Array<T>>;

// The cell must be gray if no question is defined. 
class TableCell<ID, T, QuestionType extends Question<ID, T>> {
    private readonly question?: QuestionType;
    private gray: boolean;
    
    constructor(question?: QuestionType) {
        this.question = question ?? undefined;
        this.gray = !question;
    }

    public readonly makeGrey = (): TableCell<ID, T, QuestionType> => {
        this.gray = true;
        return this;
    }

    public readonly ungrey = (): TableCell<ID, T, QuestionType> => {
        this.gray = !this.question; 
        return this;
    }

    public readonly isGray = (): boolean => this.gray;

    public readonly getQuestion = (): QuestionType | undefined => {
        return this.question;
    }
}

export abstract class QuestionTable<ID, T, QuestionType extends Question<ID, T>> extends QuestionCollection<ID> {

    private readonly rowHeaders: Array<string>;
    private readonly columnHeaders: Array<string>;

    private readonly questionTable: table<TableCell<ID, T, QuestionType>>;

    /*  The questionCreator is a callback that takes in the row and column index
        for where the question will be placed and may return a question. 
    */
    constructor(
        id: ID,
        rowHeaders: Array<string>,
        columnHeaders: Array<string>,
        questionCreator: (row: number, col: number) => QuestionType | undefined,
    ) {
        super(id);
        this.rowHeaders = [...rowHeaders];
        this.columnHeaders = [...columnHeaders];

        this.questionTable = (new Array(rowHeaders.length))
            .map((x, row) => new Array(columnHeaders.length)
                .map((x, col) => questionCreator(row, col))
                .map(question => new TableCell(question))
            );
    }

    // Returns undefined if given numbers are out of bound OR if no question has
    // been defined in the given cell.
    public readonly getQuestionAt = (row: number, col: number): QuestionType | undefined => {
        return (row >= 0 && row < this.questionTable.length)
            && (col >= 0 && col < this.questionTable[0].length) ?
            this.questionTable[row][col].getQuestion() : undefined;
    }

    public readonly getRowHeaders = (): Array<string> => [...this.rowHeaders];

    public readonly getColumnHeaders = (): Array<string> => [...this.columnHeaders];

    public readonly searchById = (id: ID): QuestionItem<ID> | undefined => {
        return this.questionTable
            .reduce((questions1, questions2) => [...questions1, ...questions2])
            .map(questionCell => questionCell.getQuestion())
            .filter((questionItem) => questionItem.getId() == id)[0];
    }
}