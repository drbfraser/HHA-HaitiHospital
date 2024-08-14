import * as ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { QuestionRow } from 'constants/interfaces';
import { underscoreAmount } from './utils';
import { useTranslation } from 'react-i18next';
import { ReportMetaData } from '@hha/common';
import { processCompositionOrSpecializedQuestion, processTableQuestion } from './QuestionRows';
import { monthYearOptions, userLocale } from 'constants/date';
import { useDepartmentData } from 'hooks';
import { useState } from 'react';

interface ReportType {
  questionItems: any[];
  metaData: ReportMetaData | null;
}

interface ExpandableQuestionList {
  [parentPrompt: string]: any[];
}

export const XlsxGenerator = ({ questionItems, metaData }: ReportType) => {
  const { departmentIdKeyMap } = useDepartmentData();
  const { t } = useTranslation();
  const getReportMonthString = () =>
    metaData?.reportMonth
      ? `${metaData?.reportMonth.getFullYear()}-${String(metaData?.reportMonth.getMonth() + 1).padStart(2, '0')}`
      : '';

  const generateQuestionRows = (language: string): any => {
    const processSelectionQuestion = (selectionItem: any): QuestionRow[] => {
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

    const processExpandableQuestion = (expandableItem: any): any[] => {
      let array: any[] = [];
      for (const questionGroup of expandableItem.questionGroups) {
        let subArray: any[] = [];
        for (let questionItem of questionGroup.questionItems) {
          if (
            questionItem.__class__ === 'SingleSelectionQuestion' ||
            questionItem.__class__ === 'MultipleSelectionQuestion'
          ) {
            const element = processSelectionQuestion(questionItem);
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

    let questionArray: QuestionRow[] = [];
    let patientsInfo: ExpandableQuestionList = {};
    for (let questionItem of questionItems) {
      if (questionItem.__class__ === 'NumericTable') {
        const element: QuestionRow = {
          id: questionItem.id,
          prompt: questionItem.tableTitle[language].replace(/\d+/g, ''),
          answer: questionItem?.answer,
        };
        questionArray.push(element);
        const subQuestionArray = processTableQuestion(questionItem, language);
        questionArray = questionArray.concat(subQuestionArray);
      } else {
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
        } else if (questionItem.__class__ === 'SpecializedGroup') {
          for (let nestedQuestionItem of questionItem.questions) {
            const subQuestionArray = processCompositionOrSpecializedQuestion(
              nestedQuestionItem,
              language,
            );
            questionArray = questionArray.concat(subQuestionArray);
          }
        } else if (questionItem.__class__ === 'ExpandableQuestion') {
          const parentPrompt = questionItem.prompt[language];
          const subQuestionArray = processExpandableQuestion(questionItem);
          if (subQuestionArray.length) {
            if (!patientsInfo[parentPrompt]) {
              patientsInfo[parentPrompt] = [];
            }
            patientsInfo[parentPrompt] = patientsInfo[parentPrompt].concat(subQuestionArray);
          }
        }
      }
    }
    return [questionArray, patientsInfo];
  };

  const generatePatientInfoSheet = (
    patientsInfo: ExpandableQuestionList,
    patientsInfoSheet: any,
    language: string,
  ) => {
    let currStartRow = 1;
    for (const [expandableQuestionKey, nestedQuestionsList] of Object.entries(patientsInfo)) {
      // skip if there are no subsections added to this expandable question item
      if (nestedQuestionsList.length < 1) continue;
      const promptRows = [];
      const rowIds = [];
      // get all of prompts and prompt ids using patient 1:
      for (const q of nestedQuestionsList[0]) {
        promptRows.push(q.prompt);
        rowIds.push([q.id]);
      }
      const tableName = toCamelCase(expandableQuestionKey + ' ' + language);
      patientsInfoSheet.addTable({
        name: tableName,
        ref: 'A' + currStartRow.toString(),
        columns: [{ name: 'ID' }],
        rows: rowIds,
      });
      currStartRow += promptRows.length + 2;

      const table = patientsInfoSheet.getTable(tableName);
      table.addColumn({ name: expandableQuestionKey, filterButton: false }, promptRows, 1);

      for (let i = 1; i <= nestedQuestionsList.length; i++) {
        const answers = [];
        for (const q of nestedQuestionsList[i - 1]) {
          const ans = isNaN(q.answer) || !q.answer.length ? q.answer : +q.answer;
          answers.push(ans);
        }
        table.addColumn({ name: 'Patient ' + i.toString(), filterButton: false }, answers, i + 1);
      }

      table.commit();
    }

    // patient info sheet styling
    const qRows: any[] = patientsInfoSheet['_rows'];
    for (let i = 0; i < qRows.length; i++) {
      if (!qRows[i] || !qRows[i]['values'] || !qRows[i]['values'][1]) continue;
      const outlineLevel = underscoreAmount(qRows[i]['values'][1]);
      const row = qRows[i];
      if (outlineLevel === 1) {
        row['_cells'][1].font = {
          name: 'Calibri',
          color: { argb: 'FFFF0000' },
          size: 12,
          bold: true,
        };
      }
      row['_cells'][0].value = row['_cells'][0].value.replaceAll('_', '.');
      row['_outlineLevel'] = outlineLevel;
    }
    const promptCol = patientsInfoSheet.getColumn('B');
    promptCol.width = 45;
  };

  const generateMainWorksheet = (worksheet: any, questionArray: QuestionRow[]) => {
    let reportMonth = '';
    if (metaData) {
      const reportDate = metaData.reportMonth;
      reportMonth = reportDate?.toLocaleDateString(userLocale, monthYearOptions) || '';
    }

    const headerRow = [];
    headerRow[1] = 'ID';
    headerRow[5] = 'Prompt';
    headerRow[8] = 'Answers - ' + reportMonth;
    worksheet.addRow(headerRow);
    for (let i = 0; i < questionArray.length; ++i) {
      const level = underscoreAmount(questionArray[i].id);
      const rowCells = [];
      rowCells[1 + level] = questionArray[i].id.replaceAll('_', '.');
      rowCells[5 + level] = questionArray[i].prompt;
      rowCells[8 + level] = questionArray[i].answer;
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
    worksheet['_rows'][0].fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00000000' },
    };
    worksheet['_rows'][0].font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
  };

  const generateExcel = (metaData: ReportMetaData | null) => {
    // Create a new Excel Workbook
    const workbook = new ExcelJS.Workbook();
    const languages = ['en', 'fr'];
    for (const language of languages) {
      const worksheet = workbook.addWorksheet(language);
      const [q, p] = generateQuestionRows(language);
      const questionArray: QuestionRow[] = q;
      const patientsInfo: ExpandableQuestionList = p;
      const keys = Object.keys(patientsInfo);

      // Expandable Question Items organized into separate worksheet
      if (keys.length) {
        const patientsInfoSheet = workbook.addWorksheet(toCamelCase('Patients Info ' + language));
        generatePatientInfoSheet(patientsInfo, patientsInfoSheet, language);
      }

      // main worksheets
      generateMainWorksheet(worksheet, questionArray);
    }

    workbook.xlsx.writeBuffer().then((data) => {
      const department = metaData?.departmentId
        ? departmentIdKeyMap.get(metaData.departmentId)
        : null;
      const filename = `${getReportMonthString()} ${department} - Data.xlsx`;

      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, filename);
    });
  };

  return (
    <button
      className="btn btn-outline-dark mr-3"
      data-testid="report-download-excel-button"
      onClick={() => generateExcel(metaData)}
    >
      {t('departmentReportDisplayDownloadExcel')}
    </button>
  );
};

function toCamelCase(str: string) {
  let words = str.split(/\s+/);

  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join('');
}
