import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { ImmutableChoice, SingleSelectionQuestion } from '@hha/common';

import { FormFieldCheck } from './index';
import { useTranslation } from 'react-i18next';

interface SingleSelectionQuestionFormFieldProps {
  applyReportChanges: () => void;
  question: SingleSelectionQuestion<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  readOnly?: boolean;
}

const SingleSelectionQuestionFormField = ({
  applyReportChanges,
  question,
  setErrorSet,
  suffixName,
  readOnly,
}: SingleSelectionQuestionFormFieldProps) => {
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

  const getChangeHandler = (index: number) => () => {
    question.setAnswer(index);
    updateErrorSetFromSelf();
    applyReportChanges();
  };

  // Disable the submit button the first time component loads if there are errors
  // This would be the case when nothing is selected and the question is required
  useEffect(() => {
    updateErrorSetFromSelf();

    // cleanup function that removes this question from the errorSet when the question is removed or unmounted
    // e.g. when an expandable question shrinks or removes its child questions
    return () => {
      setErrorSet((prevErrorSet: Set<ID>) => {
        const nextErrorSet = new Set(prevErrorSet);
        nextErrorSet.delete(nameId);
        return nextErrorSet;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameId]);

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
              name={nameId}
              onChange={getChangeHandler(index)}
              type="radio"
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

export default SingleSelectionQuestionFormField;
