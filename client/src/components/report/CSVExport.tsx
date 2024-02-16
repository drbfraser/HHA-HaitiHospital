import { QuestionRow } from 'constants/interfaces';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { underscoreAmount } from './utils';

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

export const CsvGenerator = ({questionItems}:{questionItems: any[]}) => {
  const [csvData, setCsvData] = useState<string | null>(null);
  const handleGenerateCsv = () => { 
    const generateCsv = () => {
      let array: QuestionRow[] = []
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

        let csvString = "";
        let separator = ",";
        for (const row of array) {
          csvString += separator.repeat(underscoreAmount(row.id)*3);
          csvString += row.id.replaceAll('_', '.');
          csvString += separator;
          csvString += row.prompt_fr;
          csvString += separator;
          csvString += row.prompt_en;
          csvString += separator;
          csvString += row.answer || "";
          csvString += '\n';
        }
        return csvString;
    };
    setCsvData(generateCsv());
  }

  const handleDownloadCsv = () => {
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'output.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <Button onClick={handleGenerateCsv}>Generate CSV</Button>
      <Button onClick={handleDownloadCsv} disabled={!csvData}>
        Download CSV
      </Button>
    </div>
  );
};

export default CsvGenerator;
