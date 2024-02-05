import { QuestionGroup, QuestionNode } from '@hha/common';
import { ExpandableQuestion, CompositionQuestion } from '@hha/common';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

export const CsvGenerator = ({questionItems}:{questionItems: QuestionGroup<ID, ErrorType>}) => {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType>>(null);

  const generateColumnNames = () => {

  }

  const handleComposite = (q:CompositionQuestion<string,string>) => {
    // parse composite
  }

  const handleExpandable = (q:ExpandableQuestion<string,string>) => {
  
  }
  
  const handleIndividualQuestion = (q:any) => {
  
  }

  const handleGenerateCsv = () => {
    const rows = questionItems
        .map<[QuestionNode<ID, ErrorType>, void]>({
          compositionQuestion: (q) => [q, handleComposite(q)],
          expandableQuestion: (q) => [q, handleExpandable(q)],
          multipleSelectionQuestion: (q) => [q, handleIndividualQuestion(q)],
          numericQuestion: (q) => [q, handleIndividualQuestion(q)],
          numericTableQuestion: (q) => [q, handleIndividualQuestion(q)],
          questionGroup: (q) => [q, handleIndividualQuestion(q)],
          singleSelectionQuestion: (q) => [q, handleIndividualQuestion(q)],
          textQuestion: (q) => [q, handleIndividualQuestion(q)],
        })
    // setCsvData(csvContent);
  };

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
