import { NumericQuestion, ValidationResult, ERROR_NOT_A_INTEGER,ERROR_DOES_NOT_SUM_UP, isNumber } from '@hha/common';
import FormField from './FormField';
import { ChangeEvent, useState } from 'react';

const NumericQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
  setErrorSet,
  allSumUp,
  setParentCompositionState,
  compositionParentId,
}: {
  applyReportChanges: () => void;
  question: NumericQuestion<ID, ErrorType>;
  suffixName: string;
  setErrorSet: React.Dispatch<React.SetStateAction<Set<string>>>;
  allSumUp?: () => boolean;
  setParentCompositionState?: React.Dispatch<any>;
  compositionParentId?: any;
}): JSX.Element => {
  // inputState has a value of true if the input is valid or
  // if it is of type ValidationResult<string> when the input is invalid
  const [inputState, setInputState] = useState<ValidationResult<string>>(true);
  const nameId = `${question.getId()}${suffixName}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    question.setAnswer(parseInt(newValue));
    applyReportChanges();

    // If the input is not a number, then set the error and input state to ERROR_NOT_A_INTEGER
    let validationResults;
    if (!isNumber(newValue)) {
      setInputState(ERROR_NOT_A_INTEGER);
      setErrorSet((prev) => new Set(prev).add(question.getId()));
      return;
    }

    // If the input is a number, then set the error and input state to the validation results
    validationResults = question.getValidationResults();
    setInputState(validationResults);

    // If the validation results is not true, then set the error and input state to the validation results
    if (validationResults !== true) {
      setErrorSet((prev) => new Set(prev).add(question.getId()));
      return;
    }

    // Check if this numeric question is not part of a composition question and then remove if it previously had errors registerd to its id
    if (typeof allSumUp !== 'function') {
      setErrorSet((prev) => {
        const newSet = new Set(prev);
        newSet.delete(question.getId());
        return newSet;
      });
      return;
    }

    // If numeric question is part of the composition question, then check if the composition question is valid
    // and set the error and input state of the composition question
    if (allSumUp() === false) {
      setParentCompositionState(ERROR_DOES_NOT_SUM_UP);
      setErrorSet((prev) => new Set(prev).add(question.getId()));
      return;
    }

    // If the composition question is valid, then remove the errors related to composition question and input state of composition question to true
    setErrorSet(prev => {
      const newSet = new Set(prev);
      newSet.forEach(id => {
        if (id.toString().startsWith(compositionParentId.toString())) {
          newSet.delete(id);
        }
      });
      return newSet;
    });
    setParentCompositionState(true);
    
  };

  return (
    <FormField
    handleChange={handleChange}
    inputState={inputState}
    min={0}
    nameId={nameId}
    prompt={question.getPrompt()}
    type="number"
    value={question.getAnswer()}
      />
  );
};

export default NumericQuestionFormField;
