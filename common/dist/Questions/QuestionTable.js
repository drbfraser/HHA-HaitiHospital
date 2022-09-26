"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionTable = void 0;
const QuestionParent_1 = require("./QuestionParent");
// The cell must be gray if no question is defined.
class TableCell {
    constructor(question) {
        this.makeGrey = () => {
            this.gray = true;
            return this;
        };
        this.ungrey = () => {
            this.gray = !this.question;
            return this;
        };
        this.isGray = () => this.gray;
        this.getQuestion = () => {
            return this.question;
        };
        this.question = question !== null && question !== void 0 ? question : undefined;
        this.gray = !question;
    }
}
class QuestionTable extends QuestionParent_1.QuestionParent {
    /*  The questionCreator is a callback that takes in the row and column index
          for where the question will be placed and may return a question.
      */
    constructor(id, rowHeaders, columnHeaders, questionCreator) {
        super(id);
        // Returns undefined if given numbers are out of bound OR if no question has
        // been defined in the given cell.
        this.getQuestionAt = (row, col) => {
            return row >= 0 &&
                row < this.questionTable.length &&
                col >= 0 &&
                col < this.questionTable[0].length
                ? this.questionTable[row][col].getQuestion()
                : undefined;
        };
        this.getRowHeaders = () => [...this.rowHeaders];
        this.getColumnHeaders = () => [...this.columnHeaders];
        this.searchById = (id) => {
            return this.questionTable
                .reduce((questions1, questions2) => [...questions1, ...questions2])
                .map((questionCell) => questionCell.getQuestion())
                .filter((questionItem) => questionItem.getId() == id)[0];
        };
        this.rowHeaders = [...rowHeaders];
        this.columnHeaders = [...columnHeaders];
        this.questionTable = new Array(rowHeaders.length).map((x, row) => new Array(columnHeaders.length)
            .map((x, col) => questionCreator(row, col))
            .map((question) => new TableCell(question)));
    }
}
exports.QuestionTable = QuestionTable;
