import {
  CompositionQuestion,
  ExpandableQuestion,
  ImmutableChoice,
  MultipleSelectionQuestion,
  NumericQuestion,
  QuestionGroup,
  QuestionNode,
  SingleSelectionQuestion,
  TextQuestion,
  ValidationResult,
  ERROR_NOT_A_INTEGER,
  ERROR_DOES_NOT_SUM_UP,
  isNumber,
} from '@hha/common';
import { useState } from 'react';

type ErrorType = string;
type FunctionalComponent = (object: Object) => JSX.Element;
type ID = string;

const FormField = ({ children }): JSX.Element => <div className="form-group">{children}</div>;
const FormFieldLabel = ({ id, prompt }): JSX.Element => {
  const orderedLabel = id.replaceAll('_', '.');

  return (
    <label className="fs-6 m-0 text-secondary" htmlFor={id}>
      {orderedLabel}. {prompt}
    </label>
  );
};
const Group = ({ children }): JSX.Element => <div className="pl-3">{children}</div>;

// TODO: Refactor the below components since they're all similar
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <FormField>
      <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
      <input
        className={`form-control w-50 ${inputState === true ? '' : 'is-invalid'}`}
        id={nameId}
        min="0"
        name={nameId}
        onChange={handleChange}
        type="number"
        value={question.getAnswer()}
      />
      {inputState !== true && <div className="invalid-feedback">{inputState.message}</div>}
    </FormField>
  );
};

const TextQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
}: {
  applyReportChanges: () => void;
  question: TextQuestion<ID, ErrorType>;
  suffixName: string;
}): JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    question.setAnswer(event.target.value);
    applyReportChanges();
  };
  const nameId = `${question.getId()}${suffixName}`;

  return (
    <FormField>
      <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
      <input
        className="form-control w-50"
        id={nameId}
        name={nameId}
        onChange={handleChange}
        type="text"
        value={question.getAnswer()}
      />
    </FormField>
  );
};

const CompositionQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
}: {
  applyReportChanges: () => void;
  question: CompositionQuestion<ID, ErrorType>;
  suffixName: string;
}): JSX.Element => {
  let inputState: true | ValidationResult = true;
  const nameId = `${question.getId()}${suffixName}`;
  if (question.allSumUp()) {
    inputState = true;
  } else {
    inputState = ERROR_DOES_NOT_SUM_UP;
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    question.setAnswer(parseInt(event.target.value));
    applyReportChanges();
  };

  return (
    <>
      <FormField>
        <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
        <input
          className={`form-control w-50 ${inputState === true ? '' : 'is-invalid'}`}
          id={nameId}
          min="0"
          name={nameId}
          onChange={handleChange}
          type="number"
          value={question.getAnswer()}
        />

        {inputState !== true && <div className="invalid-feedback">{inputState.message}</div>}
      </FormField>
      {question.map<JSX.Element>((group) => {
        const groupId = `${group.getId()}${suffixName}`;

        return (
          <fieldset className="form-group mb-0 pl-3" key={groupId}>
            <legend className="fs-6 mb-3 mt-0 text-secondary">
              {groupId.replaceAll('_', '.')}. {group.getPrompt()}
            </legend>
            <Group>
              {group.map((elem) => (
                <NumericQuestionFormField
                  applyReportChanges={applyReportChanges}
                  key={`${elem.getId()}${suffixName}`}
                  question={elem}
                  suffixName={suffixName}
                />
              ))}
            </Group>
          </fieldset>
        );
      })}
    </>
  );
};

const ExpandableQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
}: {
  applyReportChanges: () => void;
  question: ExpandableQuestion<ID, ErrorType>;
  suffixName: string;
}): JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    question.setAnswer(parseInt(event.target.value));
    applyReportChanges();
  };
  const nameId = `${question.getId()}${suffixName}`;

  return (
    <>
      <FormField>
        <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
        <input
          className="form-control w-50"
          id={nameId}
          min="0"
          name={nameId}
          onChange={handleChange}
          type="number"
          value={question.getAnswer()}
        />
      </FormField>
      <div className="accordion mb-3" id={nameId}>
        {question.map<JSX.Element>((questionGroup, index) => {
          const itemId: string = `_${index + 1}`;

          return (
            <div className="accordion-item" key={itemId}>
              <h6 className="uppercase text-lg accordion-header" id={`${itemId}-header`}>
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${itemId}`}
                  aria-expanded={true}
                  aria-controls={itemId}
                >
                  {`Patient ${index + 1}`}
                </button>
              </h6>
              <div
                id={itemId}
                className="accordion-collapse collapse show"
                aria-labelledby={`${itemId}-header`}
              >
                <div className="accordion-body pb-0">
                  {buildQuestionFormField({
                    applyReportChanges: applyReportChanges,
                    questions: questionGroup,
                    suffixName: itemId,
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const SingleSelectionQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
}: {
  applyReportChanges: () => void;
  question: SingleSelectionQuestion<ID, ErrorType>;
  suffixName: string;
}) => {
  const getChangeHandler = (index: number) => () => {
    question.setAnswer(index);
    applyReportChanges();
  };
  const nameId = `${question.getId()}${suffixName}`;

  return (
    <fieldset className="form-group">
      <legend className="fs-6 m-0 text-secondary">
        {nameId.replaceAll('_', '.')}. {question.getPrompt()}
      </legend>
      {question.getChoices().map((choice: ImmutableChoice, index) => (
        <div className="form-check" key={`${nameId}_${index}`}>
          <input
            checked={choice.wasChosen()}
            className="form-check-input"
            id={`${nameId}_${index}`}
            name={nameId}
            onChange={getChangeHandler(index)}
            type="radio"
          />
          <label className="form-check-label" htmlFor={`${nameId}_${index}`}>
            {choice.getDescription()}
          </label>
        </div>
      ))}
    </fieldset>
  );
};

const MultiSelectionQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
}: {
  applyReportChanges: () => void;
  question: MultipleSelectionQuestion<ID, ErrorType>;
  suffixName: string;
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

  return (
    <fieldset className="form-group">
      <legend className="fs-6 m-0 text-secondary">
        {`${nameId.replaceAll('_', '.')}. ${question.getPrompt()}`}
      </legend>
      {question.getChoices().map((choice: ImmutableChoice, index) => (
        <div className="form-check" key={`${nameId}_${index}`}>
          <input
            checked={choice.wasChosen()}
            className="form-check-input"
            id={`${nameId}_${index}`}
            name={`${nameId}_${index}`}
            onChange={getChangeHandler(choice, index)}
            type="checkbox"
          />
          <label className="form-check-label" htmlFor={`${nameId}_${index}`}>
            {choice.getDescription()}
          </label>
        </div>
      ))}
    </fieldset>
  );
};

const buildQuestionFormField = ({
  applyReportChanges,
  questions,
  suffixName,
}: {
  applyReportChanges: () => void;
  questions: QuestionGroup<ID, ErrorType>;
  suffixName: string;
}): JSX.Element => {
  return (
    <>
      {questions
        .map<[QuestionNode<ID, ErrorType>, FunctionalComponent]>({
          compositionQuestion: (q) => [q, CompositionQuestionFormField],
          expandableQuestion: (q) => [q, ExpandableQuestionFormField],
          multipleSelectionQuestion: (q) => [q, MultiSelectionQuestionFormField],
          numericQuestion: (q) => [q, NumericQuestionFormField],
          questionGroup: (q) => [q, buildQuestionFormField],
          singleSelectionQuestion: (q) => [q, SingleSelectionQuestionFormField],
          textQuestion: (q) => [q, TextQuestionFormField],
        })
        .map((tuple: [QuestionNode<ID, ErrorType>, any]) => {
          const [question, FormFieldComponent] = tuple;
          return (
            <FormFieldComponent
              applyReportChanges={applyReportChanges}
              key={`${question.getId()}${suffixName}`}
              question={question}
              suffixName={suffixName}
            />
          );
        })}
    </>
  );
};

interface ReportFormProps {
  applyReportChanges: () => void;
  reportData: QuestionGroup<string, string>;
  submitReport: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const ReportForm = ({
  applyReportChanges,
  reportData,
  submitReport,
}: ReportFormProps): JSX.Element => {
  return (
    <div className="mt-3 p-3">
      <h2 className="mb-3">{reportData.getPrompt()}</h2>
      <form onSubmit={submitReport} noValidate>
        <input className="btn btn-outline-primary mb-3" type="submit" value="Submit" />
        <Group>
          {buildQuestionFormField({
            applyReportChanges: applyReportChanges,
            questions: reportData,
            suffixName: '',
          })}
        </Group>
        <input className="btn btn-outline-primary" type="submit" value="Submit" />
      </form>
    </div>
  );
};
