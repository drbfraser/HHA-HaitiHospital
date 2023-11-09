import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { NumericTable } from '@hha/common';
import { FormField } from './index';
import { useTranslation } from 'react-i18next';

import './FormField.css';

const tableWrapperStyle = {
  width: 'fit-content',
  height: '100%',
  overflow: 'auto',
  marginBottom: '24px',
};

type Translation = Record<string, string>;

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
  const { t, i18n } = useTranslation(); // Use the hook to get the translation function and current language
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
      <h4>{t(question.getTableTitle()[i18n.language])}</h4>
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th></th>
            {question.getColumnHeaders().map((colHeader, colIndex) => (
              <th key={colIndex}>{t(colHeader[i18n.language])}</th> // Translate the column header
            ))}
          </tr>
        </thead>
        <tbody>
          {question.getRowHeaders().map((rowHeader, rowIndex) => (
            <tr key={rowIndex}>
              <th>{t(rowHeader[i18n.language])}</th>
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
                const greyMask = question.getGreyMask();
                const disabled = readOnly || greyMask[rowIndex][colIndex];

                return (
                  <td key={`${rowIndex}_${colIndex}`} className={disabled ? 'bg-light' : ''}>
                    {disabled ? (
                      <div style={{ minWidth: 'max-content' }}></div>
                    ) : (
                      <FormField
                        handleChange={handleChange}
                        inputState={inputState}
                        min={0}
                        nameId={`${sub_question?.getId() ?? ''}${suffixName}`}
                        prompt={colHeader}
                        type="number"
                        value={sub_question?.getAnswer() ?? ''}
                        readOnly={disabled}
                      />
                    )}
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
