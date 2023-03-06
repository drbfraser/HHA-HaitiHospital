import { NumericQuestion, ValidationResult } from '@hha/common';
import FormField from './FormField';
import { ChangeEvent } from 'react';

const NumericQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
  readOnly,
}: {
  applyReportChanges: () => void;
  question: NumericQuestion<ID, ErrorType>;
  suffixName: string;
  readOnly?: boolean;
}): JSX.Element => {
  // inputState has a value of true if the input is valid or
  // if it is of type "ValidationResult<ErrorType>" when the input is invalid
  const inputState: ValidationResult<ErrorType> = question.getValidationResults();
  const nameId = `${question.getId()}${suffixName}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    question.setAnswer(parseInt(newValue));
    applyReportChanges();
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
      readOnly={readOnly}
    />
  );
};

export default NumericQuestionFormField;
