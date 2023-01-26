import {
  QuestionNode,
  NumericQuestion,
  ExpandableQuestion,
  TextQuestion,
  CompositionQuestion,
  MultipleSelectionQuestion,
  SingleSelectionQuestion,
  QuestionGroup,
  ImmutableChoice,
  ValidationResult,
} from '@hha/common';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import './styles.css';

const useMountEffect = (fun) => useEffect(fun, [])
type FunctionalComponent = (object: Object) => JSX.Element;

const nonNegativeValidator: (answer?: number) => ValidationResult<ErrorType> = (answer) => {
  if (answer !== undefined && answer < 0) {
      return {isValid: false, error: 'NEGATIVE_NUMBER', message: 'Answer cannot be negative'}
  } else {
      return {isValid: true}
  }
};


// Temporary placeholders
// TODO: Decide on an appropriate types for those
type ID = string;
type ErrorType = string;

const FormField = ({ children }): JSX.Element => {
  return <fieldset className="mb-3">{children}</fieldset>;
};

const FormFieldLabel = ({ id, prompt }): JSX.Element => {
  const orderedLabel = id.replaceAll('_', '.');

  return (
      <label htmlFor={id} className="form-label">
        {orderedLabel}. {prompt}
      </label>
  );
};

const PlaceholderFormField = ({
  question,
}: {
  question: QuestionNode<ID, ErrorType>;
}): JSX.Element => {
  return (
    <FormField>
      <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
      <p>(WIP) Non-supported question type</p>
    </FormField>
  );
};

const NumericQuestionFormField = ({
  question,
}: {
  question: NumericQuestion<ID, ErrorType>;
}): JSX.Element => {
  useMountEffect(()=>{question.addValidator(nonNegativeValidator)})
  const [error, setError] = useState(!question.isValid());
  const [inputValue, setInputValue] = useState(question.getAnswer());

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    const {isValid}=nonNegativeValidator(newValue);
    setError(!isValid);
  };

  return (
    <FormField>
      <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
      <div className="col-md-6">
      <input
        className={error ? 'form-control w-fit is-invalid' : 'form-control w-fit'}
        type="number"
        min="0"
        id={question.getId()}
        value={inputValue}
        onChange={handleChange}
      />
      {error && <div className="invalid-feedback">Please input a non-negative number</div>}
      </div>
    </FormField>
  );
};

const TextQuestionFormField = ({
  question,
}: {
  question: TextQuestion<ID, ErrorType>;
}): JSX.Element => {
  return (
    <FormField>
      <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
      <input className="form-control w-fit" type="text" defaultValue={question.getAnswer()} />
    </FormField>
  );
};

const ExpandableQuestionFormField = ({
  question,
}: {
  question: ExpandableQuestion<ID, ErrorType>;
}): JSX.Element => {
  const [elements, setElements] = useState([]);

  return (
    <>
      <FormField>
        <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
        <input
          className="col-sm form-control w-fit"
          type="number"
          min="0"
          defaultValue={0}
          onChange={(e) => {
            question.setAnswer(parseInt(e.target.value));
            let index = 1;
            setElements(
              question.map<JSX.Element>((questions) => {
                const itemId: string = 'e' + uuid();

                return (
                  <div className="accordion-item">
                    <h6 className="uppercase text-lg accordion-header" id={`${itemId}-header`}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${itemId}`}
                        aria-expanded="false"
                        aria-controls={itemId}
                      >
                        Item {index++}
                      </button>
                    </h6>
                    <div
                      id={itemId}
                      className="accordion-collapse collapse"
                      aria-labelledby={`${itemId}-header`}
                    >
                      <div className="accordion-body">
                        <fieldset key={index} className="mt-3">
                          {buildQuestionFormField(questions)}
                        </fieldset>
                      </div>
                    </div>
                  </div>
                );
              }),
            );
          }}
        />
      </FormField>
      <div className="mt-3 mb-3 accordion" id={question.getId()}>
        {elements}
      </div>
    </>
  );
};

const SingleSelectionQuestionFormField = ({
  question,
}: {
  question: SingleSelectionQuestion<ID, ErrorType>;
}) => {
  const [choices, setChoices] = useState(question.getChoices());
  const [nameId, setNameId] = useState(`${uuid()}-${question.getPrompt()}`);

  return (
    <FormField>
      <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
      {choices.map((choice: ImmutableChoice, index) => {
        return (
          <div key={`${question.getId()}-${index}`}>
            <input
              id={`${question.getId()}-${index}`}
              className="form-check-input"
              name={nameId}
              type="radio"
              checked={choice.wasChosen()}
              onChange={() => {
                question.setAnswer(index);
                setChoices(question.getChoices());
              }}
            />
            &nbsp;<label htmlFor={`${question.getId()}-${index}`}>{choice.getDescription()}</label>
          </div>
        );
      })}
    </FormField>
  );
};

const MultiSelectionQuestionFormField = ({
  question,
}: {
  question: MultipleSelectionQuestion<ID, ErrorType>;
}) => {
  const [nameId, setNameId] = useState(`${uuid()}-${question.getPrompt()}`);

  return (
    <FormField>
      <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
      {question.getChoices().map((choice: ImmutableChoice, index) => (
        <div key={`${question.getId()}-${index}`}>
          <input
            id={`${question.getId()}-${index}`}
            className="form-check-input"
            name={nameId}
            type="checkbox"
            checked={choice.wasChosen()}
            onChange={() => {
              question.setAnswer(
                choice.wasChosen()
                  ? question.getAnswer().filter((choiceIndex) => choiceIndex !== index)
                  : question.getAnswer().concat(index),
              );
            }}
          />
          &nbsp;<label htmlFor={`${question.getId()}-${index}`}>{choice.getDescription()}</label>
        </div>
      ))}
    </FormField>
  );
};

const buildQuestionFormField = (questions: QuestionGroup<ID, ErrorType>): JSX.Element => {
  return (
    <FormField>
      {' '}
      {questions
        .map<[QuestionNode<ID, ErrorType>, FunctionalComponent]>({
          textQuestion: (q) => [q, TextQuestionFormField],
          numericQuestion: (q) => [q, NumericQuestionFormField],
          singleSelectionQuestion: (q) => [q, SingleSelectionQuestionFormField],
          multipleSelectionQuestion: (q) => [q, MultiSelectionQuestionFormField],
          questionGroup: (q) => [q, buildQuestionFormField],
          compositionQuestion: (q) => [q, PlaceholderFormField],
          expandableQuestion: (q) => [q, ExpandableQuestionFormField],
        })
        .map((tuple) => {
          const question: QuestionNode<ID, ErrorType> = tuple[0];
          const FormFieldComponent: any = tuple[1];

          return <FormFieldComponent key={question.getId()} question={question} />;
        })}{' '}
    </FormField>
  );
};

export const ReportForm = ({ reportTemplate }): JSX.Element => {
  return (
    <div className="mt-3 report-form">
      <h2>{reportTemplate.prompt}</h2>
      <form className="col-md-6" noValidate>
        {buildQuestionFormField(reportTemplate)}
      </form>
    </div>
  );
};
