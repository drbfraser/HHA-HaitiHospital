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

// The cell must be gray if no question is defined.
class TableCell<ID, T, ErrorType, QuestionType extends QuestionLeaf<ID, T, ErrorType>> {
  private readonly question: QuestionType | undefined;
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
  private readonly rowHeaders: Array<string>;
  private readonly columnHeaders: Array<string>;

  private readonly questionTable: table<TableCell<ID, T, ErrorType, QuestionType>>;
  private serializedColumnHeaders: Array<string> = [];

  /*  The questionCreator is a callback that takes in the row and column index
        for where the question will be placed and may return a question. 
    */

  public serialize(): any {
    this.serializedColumnHeaders = this.getColumnHeaders(); // Store columnHeaders
    return {
      ...this,
      __class__: this.constructor.name,
      ___serializedColumnHeaders__: this.serializedColumnHeaders,
    };
  }

  public deserialize(serialized: any): void {
    if (serialized.___serializedColumnHeaders__) {
      this.setDeserializedColumnHeaders(serialized.___serializedColumnHeaders__);
      delete serialized.___serializedColumnHeaders__;
    }

    Object.assign(this, serialized);
  }

  public setDeserializedColumnHeaders(headers: Array<string>): void {
    this.serializedColumnHeaders = headers;
  }

  // public getColumnHeaders(): Array<string> {
  //   if (this.serializedColumnHeaders.length > 0) {
  //     return this.serializedColumnHeaders;
  //   } else {
  //     return this.columnHeaders;
  //   }
  // }

  constructor(
    id: ID,
    prompt: Translation,
    rowHeaders: Array<string>,
    columnHeaders: Array<string>,
    questionCreator: (row: number, col: number) => QuestionType | undefined,
  ) {
    super(id, prompt);
    this.rowHeaders = [...rowHeaders];
    this.columnHeaders = [...columnHeaders];

    // this.questionTable = new Array(rowHeaders.length).map((x, row) =>
    //   new Array(columnHeaders.length)
    //     .map((x, col) => questionCreator(row, col))
    //     .map((question) => new TableCell(question)),
    // );

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
      return tableCell?.getQuestion();
    }
    return undefined;
  }

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
