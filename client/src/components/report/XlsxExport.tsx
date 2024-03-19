import * as ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { QuestionRow } from 'constants/interfaces';
import { underscoreAmount } from './utils';
import { useTranslation } from 'react-i18next';
import { processCompositionOrSpecializedQuestion, processTableQuestion } from './QuestionRows';
import { ReportMetaData } from '@hha/common';
import { useState } from 'react';

interface ReportType {
  questionItems: any[];
  metaData: ReportMetaData;
}

export interface ExpandableQuestionList {
  [parentPrompt: string]: any[];
}

export const processSelectionQuestion = (selectionItem, language: string): QuestionRow[] => {
  const array: QuestionRow[] = [];
  const element: QuestionRow = {
    id: selectionItem.id,
    prompt: selectionItem.prompt[language],
    answer: '',
  };
  array.push(element);
  const selectionRows: QuestionRow[] = [];
  for (let i = 0; i < selectionItem.choices.length; ++i) {
    const selectionElement: QuestionRow = {
      id: selectionItem.id + '_' + (i + 1).toString(),
      prompt: selectionItem.choices[i].description[language],
      answer: selectionItem.choices[i].chosen ? '1' : '0',
    };
    selectionRows.push(selectionElement);
  }

  return array.concat(selectionRows);
};

export const processExpandableQuestion = (expandableItem, language: string): any[] => {
  let array: any[] = [];
  for (const questionGroup of expandableItem.questionGroups) {
    let subArray: any[] = [];
    for (let questionItem of questionGroup.questionItems) {
      if (questionItem.__class__ === 'SingleSelectionQuestion') {
        const element = processSelectionQuestion(questionItem, language);
        subArray = subArray.concat(element);
      } else if (questionItem.__class__ === 'MultiSelectionQuestion') {
        const element = processSelectionQuestion(questionItem, language);
        subArray = subArray.concat(element);
      } else {
        const element: QuestionRow = {
          id: questionItem.id,
          prompt: questionItem.prompt[language],
          answer: questionItem.answer,
        };
        subArray.push(element);
      }
    }
    array.push(subArray);
  }

  return array;
};

const sheetRowStyle = (sheet: ExcelJS.Worksheet, cells: string[], style: any) => {
  for (const cell of cells) {
    sheet.getCell(cell).style = style;
  }
};

export const XlsxGenerator = ({ questionItems, metaData }: ReportType) => {
  const { t } = useTranslation();
  const generateQuestionRows = (language: string): any => {
    let questionArray: QuestionRow[] = [];
    let patientsInfo: ExpandableQuestionList = {};
    for (let questionItem of questionItems) {
      const element: QuestionRow = {
        id: questionItem.id,
        prompt: questionItem.prompt[language],
        answer: questionItem?.answer,
      };
      questionArray.push(element);
      if (questionItem.__class__ === 'CompositionQuestion') {
        for (let nestedQuestionItem of questionItem.compositionGroups) {
          const subQuestionArray = processCompositionOrSpecializedQuestion(
            nestedQuestionItem,
            language,
          );
          questionArray = questionArray.concat(subQuestionArray);
        }
      }
      if (questionItem.__class__ === 'SpecializedGroup') {
        for (let nestedQuestionItem of questionItem.questions) {
          const subQuestionArray = processCompositionOrSpecializedQuestion(
            nestedQuestionItem,
            language,
          );
          questionArray = questionArray.concat(subQuestionArray);
        }
      }
      if (questionItem.__class__ === 'NumericTable') {
        const subQuestionArray = processTableQuestion(questionItem, language);
        questionArray = questionArray.concat(subQuestionArray);
      }
      if (questionItem.__class__ === 'ExpandableQuestion') {
        const parentPrompt = questionItem.prompt[language];
        const subQuestionArray = processExpandableQuestion(questionItem, language);
        if (!patientsInfo[parentPrompt]) {
          patientsInfo[parentPrompt] = [];
        }
        patientsInfo[parentPrompt] = patientsInfo[parentPrompt].concat(subQuestionArray);
      }
    }
    return [questionArray, patientsInfo];
  };

  const generateExcel = () => {
    // Create a new Excel Workbook
    const workbook = new ExcelJS.Workbook();
    const languages = ['en', 'fr'];
    for (const language of languages) {
      const worksheet = workbook.addWorksheet(language);
      const reportDate = new Date(metaData.reportMonth.substring(0, 10));
      const month = reportDate.toLocaleString('default', { month: 'long' });
      const year = reportDate.getFullYear().toString();
      const [q, p] = generateQuestionRows(language);
      const questionArray: QuestionRow[] = q;
      const patientsInfo: ExpandableQuestionList = p;
      // custom only for Rehab reports
      if (patientsInfo) {
        const patientsInfoSheet = workbook.addWorksheet('PatientsInfo' + language);
        for (const [expandableQuestionKey, nestedQuestionsList] of Object.entries(patientsInfo)) {
          if (nestedQuestionsList.length < 1) continue;
          const promptRows = [];
          // get column of prompts using patient 1:
          for (const q of nestedQuestionsList[0]) {
            promptRows.push([q.prompt]);
          }
          const tableName = toCamelCase(expandableQuestionKey) + language;
          patientsInfoSheet.addTable({
            name: tableName,
            ref: 'A1',
            columns: [{ name: expandableQuestionKey }],
            rows: promptRows,
          });
          const table = patientsInfoSheet.getTable(tableName);
          for (let i = 1; i <= nestedQuestionsList.length; i++) {
            const answers = [];
            for (const q of nestedQuestionsList[i]) {
              answers.push(q.answer);
            }
            table.addColumn(
              { name: 'Patient ' + i.toString(), filterButton: false },
              answers,
              i + 1,
            );
          }
        }

        const table = patientsInfoSheet.getTable('MyTable' + language);
        table.addColumn({ name: 'Patient1' }, ['1', '2', '3'], 2);
        table.commit();
      }
      const headerRow = [];
      headerRow[1] = 'ID';
      headerRow[4] = 'Prompt';
      headerRow[7] = 'Answers - ' + month + ' ' + year;
      worksheet.addRow(headerRow);
      for (let i = 0; i < questionArray.length; ++i) {
        const level = underscoreAmount(questionArray[i].id);
        const rowCells = [];
        rowCells[1 + level] = questionArray[i].id.replaceAll('_', '.');
        rowCells[4 + level] = questionArray[i].prompt;
        rowCells[7 + level] = questionArray[i].answer;
        worksheet.addRow(rowCells).commit();
        worksheet['_rows'][i + 1]['_outlineLevel'] = level;
      }
      const rowFontStyles = [
        {
          name: 'Calibri',
          color: { argb: 'FFFF0000' },
          size: 12,
        },
        {
          name: 'Calibri',
          color: { argb: 'FF008E00' },
          size: 12,
        },
        {
          color: { argb: 'FF1B2BF5' },
          size: 12,
        },
        {
          name: 'Calibri',
          color: { argb: 'FF702BF5' },
          size: 12,
        },
      ];

      for (let i = 1; i < questionArray.length + 1; i++) {
        const row = worksheet['_rows'][i];
        const r = i + 1;

        if (row) {
          const outlineLevel = row['_outlineLevel'];
          worksheet.getRow(r).font = rowFontStyles[outlineLevel];
        }
      }
    }

    // workbook.xlsx.writeFile('./data.xlsx');
    // workbook.xlsx.writeBuffer().then((data) => {
    //   const blob = new Blob([data], {
    //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   });
    //   saveAs(blob, 'data.xlsx');
    // });
  };

  return (
    <button className="btn btn-outline-dark mr-3" onClick={generateExcel}>
      {t('departmentReportDisplayDownloadExcel')}
    </button>
  );
};

function toCamelCase(str) {
  let words = str.split(/\s+/);

  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join('');
}
