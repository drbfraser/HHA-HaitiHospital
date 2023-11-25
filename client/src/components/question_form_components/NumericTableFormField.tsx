import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react';
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
// A tuple representing a row and column index
type CellIndex = [number, number];
// An array of such tuples'
type CellIndices = Array<CellIndex>;

interface NumericTableFormFieldProps {
  applyReportChanges: () => void;
  // question: NumericTable
  // Prop name is set to question for dynamic mapping purpose in ReportForm.tsx
  question: NumericTable<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  readOnly?: boolean;
}

const calculateSum = (cellIndices: CellIndices, question: NumericTable<ID, ErrorType>): number => {
  let sum = 0;
  cellIndices.forEach(([row, col]) => {
    const subQuestion = question.getQuestionAt(row, col);
    const answer = subQuestion?.getAnswer();
    if (answer !== undefined && !isNaN(answer)) {
      sum += answer;
    }
  });
  return sum;
};

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

  const memoizedSumCalculation = useMemo(() => {
    const sums = {};
    question.getRowHeaders().forEach((_, rowIndex) => {
      question.getColumnHeaders().forEach((_, colIndex) => {
        const cellIndices = question.getCalculationMask()?.[rowIndex]?.[colIndex];
        if (cellIndices && cellIndices.length > 0) {
          sums[`${rowIndex}_${colIndex}`] = calculateSum(cellIndices, question);
        }
      });
    });
    return sums;
  }, [question, question.getCalculationMask()]); // Including calculationMask in dependencies

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
                const calculationMask = question.getCalculationMask();
                const cellIndices = calculationMask && calculationMask[rowIndex]?.[colIndex];
                const isCalculatedCell = cellIndices && cellIndices.length > 0;
                const sumValue = memoizedSumCalculation[`${rowIndex}_${colIndex}`];
                const disabled = greyMask[rowIndex][colIndex];

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
                        value={isCalculatedCell ? sumValue : sub_question?.getAnswer() ?? ''}
                        readOnly={readOnly || isCalculatedCell}
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
