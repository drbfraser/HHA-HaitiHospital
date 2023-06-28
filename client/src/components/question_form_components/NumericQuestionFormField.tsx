import { NumericQuestion } from '@hha/common';
import FormField from './FormField';
import { useEffect, ChangeEvent, Dispatch, SetStateAction, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const NumericQuestionFormField = ({
  applyReportChanges,
  question,
  setErrorSet,
  suffixName,
  readOnly,
}: {
  applyReportChanges: () => void;
  question: NumericQuestion<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  readOnly?: boolean;
}): JSX.Element => {
  console.log('NumericQuestionFormField');
  // inputState has a value of true if the input is valid or
  // if it is of type "ValidationResult<ErrorType>" when the input is invalid
  const inputState = question.getValidationResults();
  const nameId = `${question.getId()}${suffixName}`;
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  console.log('Numeric language', language);
  const prompt = question.getPrompt();
  console.log('prompt', prompt.en);
  console.log('get prompt', question.getPrompt());

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    question.setAnswer(parseInt(newValue));

    applyReportChanges();
    updateErrorSetFromSelf();
  };

  const updateErrorSetFromSelf = useCallback(() => {
    setErrorSet((prevErrorSet: Set<ID>) => {
      const nextErrorSet = new Set(prevErrorSet);
  
      if (question.getValidationResults() !== true) {
        nextErrorSet.add(nameId);
      } else {
        nextErrorSet.delete(nameId);
      }
  
      return nextErrorSet;
    });
  }, [question, nameId]);

  // Disable the submit button the first time component loads if there are errors
  // This would be the case when nothing is selected and the question is required
  useEffect(() => {
    updateErrorSetFromSelf();
    console.log('useEffect NumericQuestionFormField');

    return () => {
      setErrorSet((prevErrorSet: Set<ID>) => {
        const nextErrorSet = new Set(prevErrorSet);
        nextErrorSet.delete(nameId);
        return nextErrorSet;
      });
    };
  }, [nameId, updateErrorSetFromSelf]);

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
