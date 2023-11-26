import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { ImmutableChoice, MultipleSelectionQuestion } from '@hha/common';

import FormFieldCheck from './FormFieldCheck';
import { useTranslation } from 'react-i18next';

interface MultiSelectionQuestionFormFieldProps {
  applyReportChanges: () => void;
  question: MultipleSelectionQuestion<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  readOnly?: boolean;
}

const MultiSelectionQuestionFormField = ({
  applyReportChanges,
  question,
  setErrorSet,
  suffixName,
  readOnly,
}: MultiSelectionQuestionFormFieldProps) => {
  const { i18n } = useTranslation();
  const language = i18n.language;
  const nameId = `${question.getId()}${suffixName}`;
  const inputState = question.getValidationResults();

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
  }, [nameId, question, setErrorSet]);

  const getChangeHandler = (choice: ImmutableChoice, index: number) => () => {
    question.setAnswer(
      choice.wasChosen()
        ? question.getAnswer().filter((choiceIndex) => choiceIndex !== index)
        : question.getAnswer()?.concat(index) ?? [index],
    );
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
    <FormFieldCheck nameId={nameId} prompt={question.getPrompt()}>
      <div>
        {inputState !== true && <div className="text-danger">{inputState.message[language]}</div>}
        {question.getChoices().map((choice: ImmutableChoice, index) => (
          <div className="form-check" key={`${nameId}_${index}`}>
            <input
              checked={choice.wasChosen()}
              className="form-check-input"
              id={`${nameId}_${index}`}
              name={`${nameId}_${index}`}
              onChange={getChangeHandler(choice, index)}
              type="checkbox"
              disabled={readOnly}
            />
            <label className="form-check-label" htmlFor={`${nameId}_${index}`}>
              {choice.getDescription()[language]}
            </label>
          </div>
        ))}
      </div>
    </FormFieldCheck>
  );
};

export default MultiSelectionQuestionFormField;
