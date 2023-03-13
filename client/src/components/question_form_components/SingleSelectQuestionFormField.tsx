import { ImmutableChoice, SingleSelectionQuestion } from '@hha/common';
import { FormFieldCheck } from './index';
import cn from 'classnames';

const SingleSelectionQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
  readOnly,
}: {
  applyReportChanges: () => void;
  question: SingleSelectionQuestion<ID, ErrorType>;
  suffixName: string;
  readOnly?: boolean;
}) => {
  const getChangeHandler = (index: number) => () => {
    question.setAnswer(index);
    applyReportChanges();
  };
  const nameId = `${question.getId()}${suffixName}`;
  const inputState = question.getValidationResults();

  return (
    <FormFieldCheck nameId={nameId} prompt={question.getPrompt()}>
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
