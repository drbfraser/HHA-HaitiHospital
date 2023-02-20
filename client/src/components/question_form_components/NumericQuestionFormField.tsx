import { NumericQuestion, ValidationResult, ERROR_NOT_A_INTEGER, isNumber } from '@hha/common';
import FormField from './FormField';
import { ChangeEvent, useState } from 'react';

const NumericQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
}: {
  applyReportChanges: () => void;
  question: NumericQuestion<ID, ErrorType>;
  suffixName: string;
}): JSX.Element => {
  // inputState has a value of true if the input is valid or
  // if it is of type ValidationResult<string> when the input is invalid
  const [inputState, setInputState] = useState<ValidationResult<string>>(true);
  const nameId = `${question.getId()}${suffixName}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    question.setAnswer(parseInt(newValue));
    applyReportChanges();
    if (isNumber(newValue)) {
      setInputState(question.getValidationResults());
    } else {
      setInputState(ERROR_NOT_A_INTEGER);
    }
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
