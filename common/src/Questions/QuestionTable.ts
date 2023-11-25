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
type Translation = Record<string, string>;
// A tuple representing a row and column index
type maskIndex = [number, number];
// An array of such tuples'
type CellIndices = Array<maskIndex>;

// The cell must be gray if no question is defined.
class TableCell<ID, T, ErrorType, QuestionType extends QuestionLeaf<ID, T, ErrorType>> {
  // TODO: Make private and access by getter.
  // Currently the getter is not working (instance.getQuestion is not a function))
  // Possibly due to deserialization problem
  // So this field is temporally set to public for access
  public readonly question: QuestionType | undefined;
  private gray: boolean;

  constructor(question?: QuestionType) {
    this.question = question ?? undefined;
    this.gray = !question;
  }

  public makeGrey(): TableCell<ID, T, ErrorType, QuestionType> {
    this.gray = true;
    return this;
  }

  public ungrey(): TableCell<ID, T, ErrorType, QuestionType> {
    this.gray = !this.question;
    return this;
  }

  public isGray(): boolean {
    return this.gray;
  }

  // TODO: Getter not functioning after deserializing
  public getQuestion(): QuestionType | undefined {
    return this.question;
  }
}

export abstract class QuestionTable<
  ID,
  T,
  ErrorType,
  QuestionType extends QuestionLeaf<ID, T, ErrorType>,
> extends QuestionParent<ID, ErrorType> {
  protected readonly rowHeaders: Array<Translation> = [];
  protected readonly columnHeaders: Array<Translation> = [];
  protected readonly questionTable: table<TableCell<ID, T, ErrorType, QuestionType>>;
  protected readonly tableTitle: Translation = { en: '', fr: '' };
  protected readonly greyMask: Array<Array<boolean>> = [[]];
  protected readonly calculationMask?: Array<Array<CellIndices>> = [[]];

  /*  The questionCreator is a callback that takes in the row and column index
        for where the question will be placed and may return a question. 
    */

  constructor(
    id: ID,
    prompt: Translation,
    rowHeaders: Array<Translation>,
    columnHeaders: Array<Translation>,
    tableTitle: Translation,
    greyMask: Array<Array<boolean>>,
    questionCreator: (row: number, col: number) => QuestionType | undefined,
    calculationMask?: Array<Array<CellIndices>>,
  ) {
    super(id, prompt);
    this.rowHeaders = [...rowHeaders];
    this.columnHeaders = [...columnHeaders];
    this.tableTitle = tableTitle;
    this.greyMask = greyMask;
    this.calculationMask = calculationMask ?? [];
    this.questionTable = new Array(rowHeaders.length).fill(undefined).map((_, row) =>
      new Array(columnHeaders.length).fill(undefined).map((_, col) => {
        const question = questionCreator(row, col);
        return new TableCell(question);
      }),
    );
  }

  // Returns undefined if given numbers are out of bound OR if no question has
  // been defined in the given cell.
  // public getQuestionAt(row: number, col: number): QuestionType | undefined {
  //   return row >= 0 &&
  //     row < this.questionTable.length &&
  //     col >= 0 &&
  //     col < (this.questionTable[0]?.length ?? 0)
  //     ? this.questionTable[row]?.[col]?.getQuestion()
  //     : undefined;
  // }

  public getQuestionAt(row: number, col: number): QuestionType | undefined {
    const tableRow = this.questionTable[row];
    if (tableRow && col >= 0 && col < tableRow.length) {
      const tableCell = tableRow[col];
      // TODO: Change this to use getter instead of direct access after fixing the getter issue.
      return tableCell?.question;
    }
    return undefined;
  }

  public getRowHeaders(): Array<Translation> {
    return [...this.rowHeaders];
  }

  public getColumnHeaders(): Array<Translation> {
    return [...this.columnHeaders];
  }

  public getTableTitle(): Translation {
    return this.tableTitle;
  }
  public getGreyMask(): Array<Array<boolean>> {
    return this.greyMask;
  }

  public getCalculationMask(): Array<Array<CellIndices>> | undefined {
    return this.calculationMask;
  }

  public searchById(id: ID): QuestionNode<ID, ErrorType> | undefined {
    return this.questionTable
      .reduce((questions1, questions2) => [...questions1, ...questions2])
      .map((questionCell) => questionCell.getQuestion())
      .filter((questionItem) => questionItem?.getId() == id)[0];
  }

  public forEach(
    tableCellHandler: (
      tableCell: TableCell<ID, T, ErrorType, QuestionType>,
      row: number,
      col: number,
    ) => void,
  ): void {
    this.questionTable.forEach(
      (row: TableCell<ID, T, ErrorType, QuestionType>[], rowNumber: number) => {
        row.forEach((tableCell: TableCell<ID, T, ErrorType, QuestionType>, colNumber: number) => {
          tableCellHandler(tableCell, rowNumber, colNumber);
        });
      },
    );
  }

  public map<T2>(mapper: (tableCell: TableCell<ID, T, ErrorType, QuestionType>) => T2): T2[][] {
    return this.questionTable.map((row: TableCell<ID, T, ErrorType, QuestionType>[]) => {
      return row.map(mapper);
    });
  }
}
