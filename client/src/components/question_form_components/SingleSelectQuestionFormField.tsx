import { Dispatch, SetStateAction, useEffect } from 'react';
import { ImmutableChoice, SingleSelectionQuestion } from '@hha/common';

import { FormFieldCheck } from './index';

const SingleSelectionQuestionFormField = ({
  applyReportChanges,
  question,
  setErrorSet,
  suffixName,
  readOnly,
}: {
  applyReportChanges: () => void;
  question: SingleSelectionQuestion<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  readOnly?: boolean;
}) => {
  const updateErrorSetFromSelf = () => {
    setErrorSet((prevErrorSet: Set<ID>) => {
      const nextErrorSet = new Set(prevErrorSet);

      if (question.getValidationResults() !== true) {
        nextErrorSet.add(nameId);
      } else {
        nextErrorSet.delete(nameId);
      }

      return nextErrorSet;
    });
  };
  const getChangeHandler = (index: number) => () => {
    question.setAnswer(index);
    updateErrorSetFromSelf();
    applyReportChanges();
  };
  const nameId = `${question.getId()}${suffixName}`;
  const inputState = question.getValidationResults();

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
  }, []);

  return (
    <FormFieldCheck nameId={nameId} prompt={{
      en: question.getPrompt()
    }}>
      <div>
        {inputState !== true && <div className="text-danger">{inputState.message}</div>}
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
              {choice.getDescription()}
            </label>
          </div>
        ))}
      </div>
    </FormFieldCheck>
  );
};

export default SingleSelectionQuestionFormField;
