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
import { ChangeEvent, FormEvent, HTMLInputTypeAttribute, ReactNode, useState } from 'react';

type ErrorType = string;
type FunctionalComponent = (object: Object) => JSX.Element;
type ID = string;

type FormFieldProps = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputState: ValidationResult<string>;
  min?: number | string;
  nameId: string;
  prompt: string;
  type: HTMLInputTypeAttribute;
  value: number | string;
};
type FormFieldCheckProps = {
  children: ReactNode;
  nameId: string;
  prompt: string;
};
type GroupProps = {
  children: ReactNode;
};

const FormField = (props: FormFieldProps) => {
  return (
    <div className="form-group">
      <label className="fs-6 m-0 text-secondary" htmlFor={props.nameId}>
        {props.nameId.replaceAll('_', '.')}. {props.prompt}
      </label>
      <input
        className={`form-control w-50 ${props.inputState === true ? '' : 'is-invalid'}`}
        id={props.nameId}
        min={props.min}
        name={props.nameId}
        onChange={props.handleChange}
        type={props.type}
        value={props.value}
      />
      {props.inputState !== true && (
        <div className="invalid-feedback">{props.inputState.message}</div>
      )}
    </div>
  );
};
const FormFieldCheck = ({ children, nameId, prompt }: FormFieldCheckProps) => {
  return (
    <fieldset className="form-group">
      <legend className="fs-6 m-0 text-secondary">
        {nameId.replaceAll('_', '.')}. {prompt}
      </legend>
      {children}
    </fieldset>
  );
};
const Group = ({ children }: GroupProps): JSX.Element => <div className="pl-3">{children}</div>;

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

const CompositionQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
}: {
  applyReportChanges: () => void;
  question: CompositionQuestion<ID, ErrorType>;
  suffixName: string;
}): JSX.Element => {
  let inputState: ValidationResult<string> = true;
  const nameId = `${question.getId()}${suffixName}`;

  if (question.allSumUp()) {
    inputState = true;
  } else {
    inputState = ERROR_DOES_NOT_SUM_UP;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    question.setAnswer(parseInt(event.target.value));
    applyReportChanges();
  };

  return (
    <>
      <FormField
        handleChange={handleChange}
        inputState={inputState}
        min={0}
        nameId={nameId}
        prompt={question.getPrompt()}
        type="number"
        value={question.getAnswer()}
      />
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
  const [inputState] = useState<ValidationResult<string>>(true);
  const [openClosedStates, setOpenClosedStates] = useState((new Array<boolean>(question.getAnswer())).fill(false));
  const nameId = `${question.getId()}${suffixName}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // IF (the new value is valid):
    const value = parseInt(event.target.value);

    question.setAnswer(value);
    applyReportChanges();

    if (value > openClosedStates.length) {
      setOpenClosedStates(openClosedStates.concat((new Array<boolean>(value - openClosedStates.length)).fill(false)));
    }
    else if (value < openClosedStates.length) {
      setOpenClosedStates(openClosedStates.slice(0, value));
    }
    // ENDIF
  };

  return (
    <>
      <FormField
        handleChange={handleChange}
        inputState={inputState}
        min={0}
        nameId={nameId}
        prompt={question.getPrompt()}
        type="number"
        value={question.getAnswer()}
      />
      <div className="accordion mb-3" id={nameId}>
        {question.map<JSX.Element>((questionGroup, index) => {
          const isOpen = openClosedStates[index];
          const itemId: string = `accordion-item-${nameId}_${index + 1}`;

          return (
            <div className="accordion-item">
              <h6 className="accordion-header container-fluid m-0 p-0 text-lg uppercase" id={`${itemId}-header`}>
                <div className="row p-0 m-0 align-items-center">
                  <button
                    className={`accordion-button col pl-3 pr-1 py-2${isOpen ? "" : " collapsed"}`}
                    type="button"
                    onClick={() => {
                      openClosedStates[index] = !openClosedStates[index];
                      setOpenClosedStates([...openClosedStates]);
                    }}
                    data-bs-toggle="collapse"
                    data-bs-target={`#${itemId}`}
                    aria-expanded={isOpen}
                    aria-controls={itemId}
                  >
                    {`Patient ${index + 1}`}
                  </button>
                  <button
                    className="btn btn-outline-danger col-1 mr-2 p-0 rounded-circle"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      alignItems: "center",
                      display: "flex",
                      height: "1.5em",
                      justifyContent: "center",
                      width: "1.5em"
                    }}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>
              </h6>
              <div
                id={itemId}
                className={`accordion-collapse collapse${isOpen ? " show" : ""}`}
                aria-labelledby={`${itemId}-header`}
              >
                <div className="accordion-body pb-0">
                  {buildQuestionFormField({
                    applyReportChanges: applyReportChanges,
                    questions: questionGroup,
                    suffixName: `_${index + 1}`,
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
    <FormFieldCheck nameId={nameId} prompt={question.getPrompt()}>
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
    </FormFieldCheck>
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
    <FormFieldCheck nameId={nameId} prompt={question.getPrompt()}>
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
    </FormFieldCheck>
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

export const ReportForm = ({
  applyReportChanges,
  reportData,
  formHandler,
}: {
  applyReportChanges: () => void;
  reportData: QuestionGroup<ID, ErrorType>;
  formHandler: (event: FormEvent<HTMLFormElement>) => void;
}): JSX.Element => {
  return (
    <div className="mt-3 p-3">
      <h2 className="mb-3">{reportData.getPrompt()}</h2>
      <form onSubmit={formHandler} noValidate>
        <input className="btn btn-outline-primary" type="submit" value="Submit Report" />
        <Group>
          {buildQuestionFormField({
            applyReportChanges: applyReportChanges,
            questions: reportData,
            suffixName: '',
          })}
        </Group>
        <input className="btn btn-outline-primary" type="submit" value="Submit Report" />
      </form>
    </div>
  );
};
