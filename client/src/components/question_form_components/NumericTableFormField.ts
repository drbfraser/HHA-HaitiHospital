import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { NumericTable, NumericQuestion } from '@hha/common';
import FormFieldCheck from './FormFieldCheck';
import FormField from './FormField';

// Add the required type definitions for ID and ErrorType
type ID = string; // Replace this with the appropriate type for ID
type ErrorType = string; // Replace this with the appropriate type for ErrorType

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

    const handleCellChange = (row: number, col: number, newValue: number) => {
        const question = numericTable.getQuestionAt(row, col);
        if (question) {
            question.setAnswer(newValue);
            updateErrorSetFromSelf(question.getId());
            applyReportChanges();
        }
    };

    useEffect(() => {
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
    //TODO: RETURN

    return
};



export default NumericTableFormField;