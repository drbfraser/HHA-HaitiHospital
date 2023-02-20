import { TextQuestion, ValidationResult } from '@hha/common';
import { ChangeEvent, useState } from 'react';
import FormField from './FormField';

const TextQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
}: {
  applyReportChanges: () => void;
  question: TextQuestion<ID, ErrorType>;
  suffixName: string;
}): JSX.Element => {
  const [inputState] = useState<ValidationResult<string>>(true);
  const nameId = `${question.getId()}${suffixName}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    question.setAnswer(event.target.value);
    applyReportChanges();
  };

  return (
    <FormField
      handleChange={handleChange}
      inputState={inputState}
      nameId={nameId}
      prompt={question.getPrompt()}
      type="text"
      value={question.getAnswer()}
    />
  );
};

export default TextQuestionFormField;
