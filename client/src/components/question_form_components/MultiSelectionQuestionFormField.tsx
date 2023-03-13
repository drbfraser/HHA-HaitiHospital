import FormFieldCheck from './FormFieldCheck';
import { ImmutableChoice, MultipleSelectionQuestion } from '@hha/common';

const MultiSelectionQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
  readOnly,
}: {
  applyReportChanges: () => void;
  question: MultipleSelectionQuestion<ID, ErrorType>;
  suffixName: string;
  readOnly?: boolean;
}) => {
  const getChangeHandler = (choice: ImmutableChoice, index: number) => () => {
    question.setAnswer(
      choice.wasChosen()
        ? question.getAnswer().filter((choiceIndex) => choiceIndex !== index)
        : question.getAnswer().concat(index),
    );
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
              name={`${nameId}_${index}`}
              onChange={getChangeHandler(choice, index)}
              type="checkbox"
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

export default MultiSelectionQuestionFormField;
