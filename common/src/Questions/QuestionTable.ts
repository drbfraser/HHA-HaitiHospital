/*  Meant to represent a table with columns and rows. The table can also be
  regarded as a question matrix where each coordinate corresponds to a single
  question whose prompt is the union of the prompts in the corresponding row and
  column's headers.

  In the context of the question tree containing all questions, the
  QuestionTable is a parent node whose children are the questions formed by the
  process described above.
*/
import { QuestionLeaf } from './QuestionLeaf';
import { QuestionParent } from './QuestionParent';
import { QuestionNode } from './QuestionNode';

type table<T> = Array<Array<T>>;

// The cell must be gray if no question is defined.
class TableCell<ID, T, ErrorType, QuestionType extends QuestionLeaf<ID, T, ErrorType>> {
  private readonly question?: QuestionType;
  private gray: boolean;

  constructor(question?: QuestionType) {
    this.question = question ?? undefined;
    this.gray = !question;
  }

  public makeGrey(): TableCell<ID, T, ErrorType, QuestionType> {
    this.gray = true;
    return this;
  };

  public ungrey(): TableCell<ID, T, ErrorType, QuestionType> {
    this.gray = !this.question;
    return this;
  };

  public isGray(): boolean {
    return this.gray;
  }

  public getQuestion(): QuestionType | undefined {
    return this.question;
  };
}

export abstract class QuestionTable<
  ID,
  T,
  ErrorType,
  QuestionType extends QuestionLeaf<ID, T, ErrorType>,
> extends QuestionParent<ID, ErrorType> {
  private readonly rowHeaders: Array<string>;
  private readonly columnHeaders: Array<string>;

  private readonly questionTable: table<TableCell<ID, T, ErrorType, QuestionType>>;

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

    this.questionTable = new Array(rowHeaders.length).map((x, row) =>
      new Array(columnHeaders.length)
        .map((x, col) => questionCreator(row, col))
        .map((question) => new TableCell(question)),
    );
  }

  // Returns undefined if given numbers are out of bound OR if no question has
  // been defined in the given cell.
  public getQuestionAt(row: number, col: number): QuestionType | undefined {
    return row >= 0 &&
      row < this.questionTable.length &&
      col >= 0 &&
      col < this.questionTable[0].length
      ? this.questionTable[row][col].getQuestion()
      : undefined;
  };

  public getRowHeaders(): Array<string> {
    return [...this.rowHeaders];
  }

  public getColumnHeaders(): Array<string> {
    return [...this.columnHeaders];
  }

  public searchById(id: ID): QuestionNode<ID, ErrorType> | undefined {
    return this.questionTable
      .reduce((questions1, questions2) => [...questions1, ...questions2])
      .map((questionCell) => questionCell.getQuestion())
      .filter((questionItem) => questionItem.getId() == id)[0];
  };
}
