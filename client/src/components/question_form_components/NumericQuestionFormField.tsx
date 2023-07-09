import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect } from 'react';

import FormField from './FormField';
import { NumericQuestion } from '@hha/common';

interface NumericQuestionFormFieldProps {
  applyReportChanges: () => void;
  question: NumericQuestion<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  readOnly?: boolean;
}

const NumericQuestionFormField = ({
  applyReportChanges,
  question,
  setErrorSet,
  suffixName,
  readOnly,
}: NumericQuestionFormFieldProps): JSX.Element => {
  // inputState has a value of true if the input is valid or
  // if it is of type "ValidationResult<ErrorType>" when the input is invalid
  const inputState = question.getValidationResults();
  const nameId = `${question.getId()}${suffixName}`;

  const updateErrorSetFromSelf = useCallback(
    () =>
      setErrorSet((prevErrorSet: Set<ID>) => {
        const nextErrorSet = new Set(prevErrorSet);

        if (question.getValidationResults() !== true) {
          nextErrorSet.add(nameId);
        } else {
          nextErrorSet.delete(nameId);
        }

        return nextErrorSet;
      }),
    [nameId, question, setErrorSet],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    question.setAnswer(parseInt(newValue));

    updateErrorSetFromSelf();
    applyReportChanges();
  };

  // Disable the submit button the first time component loads if there are errors
  // This would be the case when nothing is selected and the question is required
  useEffect(() => {
    updateErrorSetFromSelf();

    return () => {
      setErrorSet((prevErrorSet: Set<ID>) => {
        const nextErrorSet = new Set(prevErrorSet);
        nextErrorSet.delete(nameId);
        return nextErrorSet;
      });
    };
  }, [nameId, setErrorSet, updateErrorSetFromSelf]);

  return (
    <FormField
      handleChange={handleChange}
      inputState={inputState}
      min={0}
      nameId={nameId}
      prompt={question.getPrompt()}
      type="number"
      value={question.getAnswer()}
      readOnly={readOnly}
    />
  );
};

export default NumericQuestionFormField;
