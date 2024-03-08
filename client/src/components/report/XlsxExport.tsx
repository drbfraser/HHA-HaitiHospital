import * as ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { QuestionRow } from 'constants/interfaces';
import { underscoreAmount } from './utils';
import { useTranslation } from 'react-i18next';
import { processCompositionOrSpecializedQuestion, processTableQuestion } from './QuestionRows';

export const processSingleSelectionQuestion = (
  singleSelectionItem,
  language: string,
): QuestionRow => {
  const element: QuestionRow = {
    id: singleSelectionItem.id,
    prompt: singleSelectionItem.prompt[language],
    answer: singleSelectionItem.choices[singleSelectionItem.answer].description[language],
  };
  return element;
};

export const processMultiSelectionQuestion = (
  multiSelectionItem,
  language: string,
): QuestionRow => {
  const element: QuestionRow = {
    id: multiSelectionItem.id,
    prompt: multiSelectionItem.prompt[language],
    answer: JSON.stringify(
      multiSelectionItem.answer.map((index: number) => multiSelectionItem.choices[index]),
    ),
  };
  return element;
};

export const processExpandableQuestion = (expandableItem, language: string): QuestionRow[] => {
  let array: QuestionRow[] = [];
  for (const questionGroup of expandableItem.questionGroups) {
    for (let questionItem of questionGroup.questionItems) {
      if (questionItem.__class__ === 'SingleSelectionQuestion') {
        const element = processSingleSelectionQuestion(questionItem, language);
        array.push(element);
      } else if (questionItem.__class__ === 'MultiSelectionQuestion') {
        const element = processMultiSelectionQuestion(questionItem, language);
        array.push(element);
      } else {
        const element: QuestionRow = {
          id: questionItem.id,
          prompt: questionItem.prompt[language],
          answer: questionItem?.answer,
        };
        array.push(element);
      }
    }
  }

  return array;
};

const sheetRowStyle = (sheet: ExcelJS.Worksheet, cells: string[], style: any) => {
  for (const cell of cells) {
    sheet.getCell(cell).style = style;
  }
};

export const XlsxGenerator = ({ questionItems }: { questionItems: any[] }) => {
  const { t } = useTranslation();
  const generateQuestionRows = (language: string): QuestionRow[] => {
    let array: QuestionRow[] = [];
    for (let questionItem of questionItems) {
      const element: QuestionRow = {
        id: questionItem.id,
        prompt: questionItem.prompt[language],
        answer: questionItem?.answer,
      };
      array.push(element);
      if (questionItem.__class__ === 'CompositionQuestion') {
        for (let nestedQuestionItem of questionItem.compositionGroups) {
          const subArray = processCompositionOrSpecializedQuestion(nestedQuestionItem, language);
          array = array.concat(subArray);
        }
      }
      if (questionItem.__class__ === 'SpecializedGroup') {
        for (let nestedQuestionItem of questionItem.questions) {
          const subArray = processCompositionOrSpecializedQuestion(nestedQuestionItem, language);
          array = array.concat(subArray);
        }
      }
      if (questionItem.__class__ === 'NumericTable') {
        const subArray = processTableQuestion(questionItem, language);
        array = array.concat(subArray);
      }
      if (questionItem.__class__ === 'ExpandableQuestion') {
        const subArray = processExpandableQuestion(questionItem, language);
        array = array.concat(subArray);
      }
    }
    return array;
  };

  const generateExcel = () => {
    // Create a new Excel Workbook
    const workbook = new ExcelJS.Workbook();
    const languages = ['en', 'fr'];
    for (const language of languages) {
      const worksheet = workbook.addWorksheet(language);
      const array = generateQuestionRows(language);
      worksheet.columns = [
        { header: 'Id', key: 'id', width: 10 },
        { header: 'Prompt', key: 'prompt', width: 28 },
        { header: 'Answer', key: 'answer', width: 10 },
      ];
      for (let i = 0; i < array.length; ++i) {
        const level = underscoreAmount(array[i].id);
        // if (level === 0) {
        const row = {
          id: array[i].id.replaceAll('_', '.'),
          prompt: array[i].prompt,
          answer: array[i].answer,
        };
        worksheet.addRow(row).commit();
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
      for (let i = 1; i <= array.length; i++) {
        const row = worksheet['_rows'][i];
        const r = i + 1;

        if (row) {
          const outlineLevel = row['_outlineLevel'];
          sheetRowStyle(worksheet, ['A' + r, 'B' + r, 'C' + r], {
            font: rowFontStyles[outlineLevel],
          });
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
