import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
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
  const language = i18n.resolvedLanguage;
  const greyMask = question.getGreyMask();
  const calculationMask = question.getCalculationMask();
  const [calculatedCellsUpdated, setCalculatedCellsUpdated] = useState(false);

  const updateErrorSetFromSelf = useCallback(
    (questionId: string, rowIndex: number, colIndex: number) =>
      setErrorSet((prevErrorSet: Set<ID>) => {
        const nextErrorSet = new Set(prevErrorSet);
        const question_cell = question.getQuestionAt(rowIndex, colIndex);
        const cellIndices = calculationMask && calculationMask[rowIndex]?.[colIndex];
        const isCalculatedCell = cellIndices && cellIndices.length > 0;
        const isUneditableCell = greyMask[rowIndex][colIndex] || isCalculatedCell;

        if (question_cell?.getValidationResults() !== true && !isUneditableCell) {
          nextErrorSet.add(`${questionId}${suffixName}`);
        } else {
          nextErrorSet.delete(`${questionId}${suffixName}`);
        }
        return nextErrorSet;
      }),
    [calculationMask, greyMask, question, setErrorSet, suffixName],
  );

  useEffect(() => {
    const updateCalculatedCells = () => {
      let calculatedUpdated = false;
      question.getRowHeaders().forEach((_, rowIndex) => {
        question.getColumnHeaders().forEach((_, colIndex) => {
          const cellIndices = calculationMask?.[rowIndex]?.[colIndex];
          if (cellIndices && cellIndices.length > 0) {
            const sumValue = calculateSum(cellIndices, question);
            const sub_question = question.getQuestionAt(rowIndex, colIndex);
            if (sub_question && sub_question.getAnswer() !== sumValue) {
              sub_question.setAnswer(sumValue);
              calculatedUpdated = true;
            }
          }
        });
      });
      return calculatedUpdated;
    };

    // Update calculated cells and error sets
    const calculatedUpdated = updateCalculatedCells();
    setCalculatedCellsUpdated(calculatedUpdated);
    const numRows = question.getRowHeaders().length;
    const numCols = question.getColumnHeaders().length;
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const sub_question = question.getQuestionAt(row, col);
        if (sub_question) {
          updateErrorSetFromSelf(sub_question.getId(), row, col);
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
  }, [question, setErrorSet, suffixName, updateErrorSetFromSelf, calculationMask, greyMask]);

  interface Sums {
    [key: string]: number;
  }

  const memoizedSumCalculation = useMemo(() => {
    const sums: Sums = {};
    question.getRowHeaders().forEach((_, rowIndex) => {
      question.getColumnHeaders().forEach((_, colIndex) => {
        const cellIndices = calculationMask?.[rowIndex]?.[colIndex];
        if (cellIndices && cellIndices.length > 0) {
          sums[`${rowIndex}_${colIndex}`] = calculateSum(cellIndices, question);
        }
      });
    });
    return sums;
  }, [question, calculationMask]);

  return (
    <div style={tableWrapperStyle}>
      <h4>{t(question.getTableTitle()[language])}</h4>
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th></th>
            {question.getColumnHeaders().map((colHeader, colIndex) => (
              <th key={colIndex}>{t(colHeader[language])}</th> // Translate the column header
            ))}
          </tr>
        </thead>
        <tbody>
          {question.getRowHeaders().map((rowHeader, rowIndex) => (
            <tr key={rowIndex}>
              <th>{t(rowHeader[language])}</th>
              {question.getColumnHeaders().map((colHeader, colIndex) => {
                const sub_question = question.getQuestionAt(rowIndex, colIndex);

                // Calculate inputState for the current cell
                const inputState = sub_question ? sub_question.getValidationResults() : true;

                // Define handleChange for the current cell
                const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = parseFloat(event.target.value); // Assuming the input value is a number
                  if (sub_question) {
                    sub_question.setAnswer(newValue);
                    updateErrorSetFromSelf(sub_question.getId(), rowIndex, colIndex);
                    applyReportChanges();
                  }
                };

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
