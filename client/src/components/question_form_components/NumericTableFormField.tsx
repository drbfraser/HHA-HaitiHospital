import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { NumericTable } from '@hha/common';
import { FormField, FormFieldCheck } from './index';

interface NumericTableFormFieldProps {
  applyReportChanges: () => void;
  numericTable: NumericTable<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  readOnly?: boolean;
}

const NumericTableFormField = ({
  applyReportChanges,
  numericTable,
  setErrorSet,
  suffixName,
  readOnly,
}: NumericTableFormFieldProps): JSX.Element => {
  console.log('NumericTableFormField');

  const updateErrorSetFromSelf = useCallback(
    (questionId: string) =>
      setErrorSet((prevErrorSet: Set<ID>) => {
        const nextErrorSet = new Set(prevErrorSet);
        if (numericTable.getQuestionAt(0, 0)?.getValidationResults() !== true) {
          nextErrorSet.add(`${questionId}${suffixName}`);
        } else {
          nextErrorSet.delete(`${questionId}${suffixName}`);
        }
        return nextErrorSet;
      }),
    [numericTable, setErrorSet, suffixName],
  );

  useEffect(() => {
    console.log('Numeric table form field useEffect');
    const numRows = numericTable.getRowHeaders().length;
    const numCols = numericTable.getColumnHeaders().length;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const question = numericTable.getQuestionAt(row, col);
        if (question) {
          updateErrorSetFromSelf(question.getId());
        }
      }
    }

    return () => {
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const question = numericTable.getQuestionAt(row, col);
          if (question) {
            setErrorSet((prevErrorSet: Set<ID>) => {
              const nextErrorSet = new Set(prevErrorSet);
              nextErrorSet.delete(`${question.getId()}${suffixName}`);
              return nextErrorSet;
            });
          }
        }
      }
    };
  }, [numericTable, setErrorSet, suffixName, updateErrorSetFromSelf]);

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {numericTable.getColumnHeaders().map((colHeader, colIndex) => (
            <th key={colIndex}>{colHeader}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {numericTable.getRowHeaders().map((rowHeader, rowIndex) => (
          <tr key={rowIndex}>
            <th>{rowHeader}</th>
            {numericTable.getColumnHeaders().map((colHeader, colIndex) => {
              const question = numericTable.getQuestionAt(rowIndex, colIndex);

              // Calculate inputState for the current cell
              const inputState = question ? question.getValidationResults() : true;

              // Define handleChange for the current cell
              const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = parseFloat(event.target.value); // Assuming the input value is a number
                if (question) {
                  question.setAnswer(newValue);
                  updateErrorSetFromSelf(question.getId());
                  applyReportChanges();
                }
              };

              return (
                <td key={`${rowIndex}_${colIndex}`}>
                  <FormField
                    handleChange={handleChange}
                    inputState={inputState}
                    min={0}
                    nameId={`${question?.getId() ?? ''}${suffixName}`}
                    prompt={colHeader}
                    type="number"
                    value={question?.getAnswer() ?? ''}
                    readOnly={readOnly}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NumericTableFormField;
