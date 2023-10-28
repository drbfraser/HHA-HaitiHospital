import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { NumericTable } from '@hha/common';
import { FormField } from './index';
import './FormField.css';

const tableWrapperStyle = {
  width: 'fit-content', // or any specific width you want
  height: '100%', // or any specific height you want
  overflow: 'auto', // Makes it scrollable
};

interface NumericTableFormFieldProps {
  applyReportChanges: () => void;
  // question: NumericTable
  // Prop name is set to question for dynamic mapping purpose in ReportForm.tsx
  question: NumericTable<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  readOnly?: boolean;
}

const NumericTableFormField = ({
  applyReportChanges,
  question,
  setErrorSet,
  suffixName,
  readOnly,
}: NumericTableFormFieldProps): JSX.Element => {
  const updateErrorSetFromSelf = useCallback(
    (questionId: string) =>
      setErrorSet((prevErrorSet: Set<ID>) => {
        const nextErrorSet = new Set(prevErrorSet);
        if (question.getQuestionAt(0, 0)?.getValidationResults() !== true) {
          nextErrorSet.add(`${questionId}${suffixName}`);
        } else {
          nextErrorSet.delete(`${questionId}${suffixName}`);
        }
        return nextErrorSet;
      }),
    [question, setErrorSet, suffixName],
  );

  useEffect(() => {
    const numRows = question.getRowHeaders().length;
    const numCols = question.getColumnHeaders().length;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const sub_question = question.getQuestionAt(row, col);
        if (sub_question) {
          updateErrorSetFromSelf(sub_question.getId());
        }
      }
    }

    return () => {
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const sub_question = question.getQuestionAt(row, col);
          if (sub_question) {
            setErrorSet((prevErrorSet: Set<ID>) => {
              const nextErrorSet = new Set(prevErrorSet);
              nextErrorSet.delete(`${sub_question.getId()}${suffixName}`);
              return nextErrorSet;
            });
          }
        }
      }
    };
  }, [question, setErrorSet, suffixName, updateErrorSetFromSelf]);
  return (
    <div style={tableWrapperStyle}>
      <table>
        <thead>
          <tr>
            <th></th>
            {question.getColumnHeaders().map((colHeader, colIndex) => (
              <th key={colIndex}>{colHeader}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {question.getRowHeaders().map((rowHeader, rowIndex) => (
            <tr key={rowIndex}>
              <th>{rowHeader}</th>
              {question.getColumnHeaders().map((colHeader, colIndex) => {
                const sub_question = question.getQuestionAt(rowIndex, colIndex);

                // Calculate inputState for the current cell
                const inputState = sub_question ? sub_question.getValidationResults() : true;

                // Define handleChange for the current cell
                const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = parseFloat(event.target.value); // Assuming the input value is a number
                  if (sub_question) {
                    sub_question.setAnswer(newValue);
                    updateErrorSetFromSelf(sub_question.getId());
                    applyReportChanges();
                  }
                };

                return (
                  <td key={`${rowIndex}_${colIndex}`}>
                    <FormField
                      handleChange={handleChange}
                      inputState={inputState}
                      min={0}
                      nameId={`${sub_question?.getId() ?? ''}${suffixName}`}
                      prompt={colHeader}
                      type="number"
                      value={sub_question?.getAnswer() ?? ''}
                      readOnly={readOnly}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NumericTableFormField;
