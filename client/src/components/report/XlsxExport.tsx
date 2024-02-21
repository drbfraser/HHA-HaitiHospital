import * as ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { QuestionRow } from 'constants/interfaces';
import { underscoreAmount } from './utils';
import { useTranslation } from 'react-i18next';

export const processCompositionOrSpecializedQuestion = (specialQuestionItem): QuestionRow[] => {
  let array: QuestionRow[] = [];
  const element: QuestionRow = {
    id: specialQuestionItem.id,
    prompt_fr: specialQuestionItem.prompt.fr,
    prompt_en: specialQuestionItem.prompt.en,
    answer: specialQuestionItem?.answer,
  };
  array.push(element);
  for (let questionItem of specialQuestionItem.questions) {
    const element: QuestionRow = {
      id: questionItem.id,
      prompt_fr: questionItem.prompt.fr,
      prompt_en: questionItem.prompt.en,
      answer: questionItem?.answer,
    };
    array.push(element);
  }
  return array;
};

export const processTableQuestion = (tableItem): QuestionRow[] => {
  let array: QuestionRow[] = [];
  const questionTable = tableItem.questionTable;
  for (let questionRows of questionTable) {
    for (let tableCell of questionRows) {
      const questionItem = tableCell.question;
      const element: QuestionRow = {
        id: questionItem.id,
        prompt_fr: questionItem.prompt.fr,
        prompt_en: questionItem.prompt.en,
        answer: questionItem?.answer,
      };
      array.push(element);
    }
  }
  return array;
};

export const XlsxGenerator = ({ questionItems }: { questionItems: any[] }) => {
  const { t } = useTranslation();

  const generateExcel = () => {
    let array: QuestionRow[] = [];
    for (let questionItem of questionItems) {
      const element: QuestionRow = {
        id: questionItem.id,
        prompt_en: questionItem.prompt?.en,
        prompt_fr: questionItem?.prompt?.fr,
        answer: questionItem?.answer,
      };
      array.push(element);
      if (questionItem.__class__ === 'CompositionQuestion') {
        for (let nestedQuestionItem of questionItem.compositionGroups) {
          const subArray = processCompositionOrSpecializedQuestion(nestedQuestionItem);
          array = array.concat(subArray);
        }
      }
      if (questionItem.__class__ === 'SpecializedGroup') {
        for (let nestedQuestionItem of questionItem.questions) {
          const subArray = processCompositionOrSpecializedQuestion(nestedQuestionItem);
          array = array.concat(subArray);
        }
      }
      if (questionItem.__class__ === 'NumericTable') {
        const subArray = processTableQuestion(questionItem);
        array = array.concat(subArray);
      }
    }
    // Create a new Excel Workbook
    const workbook = new ExcelJS.Workbook();
    const sheetName = 'Sheet1';
    const sheet = workbook.addWorksheet(sheetName);

    sheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'English', key: 'prompt_en', width: 28 },
      { header: 'French', key: 'prompt_fr', width: 28 },
      { header: 'Answer', key: 'answer', width: 10 },
    ];
    for (let i = 0; i < array.length; ++i) {
      const level = underscoreAmount(array[i].id);
      if (level === 0) {
        const row = { id: array[i].id.replaceAll('_', '.'), ...array[i] };
        sheet.addRow(row).commit();
      } else {
        const row = [];

        row[0 + level * 4 + 1] = array[i].id.replaceAll('_', '.');
        row[1 + level * 4 + 1] = array[i].prompt_en;
        row[2 + level * 4 + 1] = array[i].prompt_fr;
        row[3 + level * 4 + 1] = array[i].answer;
        sheet.addRow(row).commit();
      }
      sheet['_rows'][i + 1]['_outlineLevel'] = level;
    }
    sheet.getColumn('B').width = 28;
    sheet.getColumn('C').width = 28;
    sheet.getColumn('F').width = 28;
    sheet.getColumn('G').width = 28;
    sheet.getColumn('J').width = 28;
    sheet.getColumn('K').width = 28;
    sheet.getColumn('D').width = 10;
    sheet.getColumn('H').width = 10;
    sheet.getColumn('L').width = 10;
    sheet.getColumn('D').font = {
      name: 'Calibri',
      color: { argb: 'FF702BF5' },
      size: 12,
    };
    sheet.getColumn('H').font = {
      name: 'Calibri',
      color: { argb: 'FF702BF5' },
      size: 12,
    };
    sheet.getColumn('L').font = {
      name: 'Calibri',
      color: { argb: 'FF702BF5' },
      size: 12,
    };
    sheet.getColumn('A').font = {
      name: 'Calibri',
      color: { argb: 'FFFF0000' },
      size: 12,
    };
    sheet.getColumn('B').font = {
      name: 'Calibri',
      color: { argb: 'FFFF0000' },
      size: 12,
    };
    sheet.getColumn('C').font = {
      name: 'Calibri',
      color: { argb: 'FFFF0000' },
      size: 12,
    };
    sheet.getColumn('E').font = {
      name: 'Calibri',
      color: { argb: 'FF008E00' },
      size: 12,
    };
    sheet.getColumn('F').font = {
      name: 'Calibri',
      color: { argb: 'FF008E00' },
      size: 12,
    };
    sheet.getColumn('G').font = {
      name: 'Calibri',
      color: { argb: 'FF008E00' },
      size: 12,
    };
    sheet.getColumn('I').font = {
      color: { argb: 'FF1B2BF5' },
      size: 12,
    };

    sheet.getColumn('J').font = {
      color: { argb: 'FF1B2BF5' },
      size: 12,
    };

    sheet.getColumn('K').font = {
      color: { argb: 'FF1B2BF5' },
      size: 12,
    };
    for (let i = 1; i <= array.length; i++) {
      const row = sheet['_rows'][i];
      const r = i + 1;
      if (row) {
        const outlineLevel = row['_outlineLevel'];
        if (outlineLevel === 0) {
          sheet.getCell('A' + r).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFF0' },
            bgColor: { argb: 'FFEFEFF0' },
          };

          sheet.getCell('B' + r).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFF0' },
            bgColor: { argb: 'FFEFEFF0' },
          };
          sheet.getCell('C' + r).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFF0' },
            bgColor: { argb: 'FFEFEFF0' },
          };
        } else if (outlineLevel === 1) {
          sheet.getCell('E' + r).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFF0' },
            bgColor: { argb: 'FFEFEFF0' },
          };
          sheet.getCell('F' + r).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFF0' },
            bgColor: { argb: 'FFEFEFF0' },
          };
          sheet.getCell('G' + r).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFF0' },
            bgColor: { argb: 'FFEFEFF0' },
          };
        } else if (outlineLevel === 2) {
          sheet.getCell('I' + r).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFF0' },
            bgColor: { argb: 'FFEFEFF0' },
          };
          sheet.getCell('J' + r).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFF0' },
            bgColor: { argb: 'FFEFEFF0' },
          };
          sheet.getCell('K' + r).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFF0' },
            bgColor: { argb: 'FFEFEFF0' },
          };
        }
      }
    }

    // workbook.xlsx.writeFile('./data.xlsx');
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'data.xlsx');
    });
  };

  return (
    <button className="btn btn-outline-dark mr-3" onClick={generateExcel}>
      {t('departmentReportDisplayDownloadExcel')}
    </button>
  );
};
