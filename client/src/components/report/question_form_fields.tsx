import {
  CompositionQuestion,
  ExpandableQuestion,
  ImmutableChoice,
  MultipleSelectionQuestion,
  NumericQuestion,
  QuestionGroup,
  QuestionNode,
  SingleSelectionQuestion,
  TextQuestion
} from '@hha/common';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import './styles.css';

type FunctionalComponent = (object: Object) => JSX.Element;

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

const NumericQuestionFormField = ({question, suffixName}: {question: NumericQuestion<ID, ErrorType>, suffixName: string}): JSX.Element => {
  const [nameId] = useState(`${question.getId()}${suffixName}`);

  return (
    <FormField>
      <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
      <input
        className="form-control w-fit"
        defaultValue={0}
        type="number"
        min="0"
        name={nameId}
      />
    </FormField>
  );
};

const TextQuestionFormField = ({question, suffixName}: {question: TextQuestion<ID, ErrorType>, suffixName: string}): JSX.Element => {
  const [nameId] = useState(`${question.getId()}${suffixName}`);

  return (
    <FormField>
      <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
      <input
        className="form-control w-fit"
        defaultValue={0}
        name={nameId}
        type="text"
      />
    </FormField>
  );
};

const CompositionQuestionFormField = ({question, suffixName}: {question: CompositionQuestion<ID, ErrorType>, suffixName: string}): JSX.Element => {
  const [nameId] = useState(`${question.getId()}${suffixName}`);

  return (
    <>
      <FormField>
        <FormFieldLabel id={nameId} prompt={question.getPrompt()}/>
        <input
          className="col-sm form-control w-fit"
          type="number"
          min="0"
          name={nameId}
        />
      </FormField>
      {question.map<JSX.Element>((group) => {
        return (<div key={group.getId()}>
          <FormField>
            <FormFieldLabel id={group.getId()} prompt={group.getPrompt()}/>
          </FormField>
          {group.map((elem) => {
            return (<FormField key={elem.getId()}>
              <FormFieldLabel id={elem.getId()} prompt={elem.getPrompt()}/>
              <input
                className="col-sm form-control w-fit"
                type="number"
                min="0"
                onChange={(e) => {}}
              />
            </FormField>);
          })}
        </div>);
      })}
    </>
  );
};

const ExpandableQuestionFormField = ({question, suffixName}: {question: ExpandableQuestion<ID, ErrorType>, suffixName: string}): JSX.Element => {
  const [elements, setElements] = useState([]);
  const [nameId] = useState(`${question.getId()}${suffixName}`);

  return (
    <>
      <FormField>
        <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
        <input
          className="col-sm form-control w-fit"
          type="number"
          min="0"
          name={nameId}
          onChange={(e) => {
            question.setAnswer(parseInt(e.target.value));
            setElements(
              question.map<JSX.Element>((questions) => {
                const itemId: string = `e${uuid()}`;

                return (
                  <div className="accordion-item" key={itemId}>
                    <h6 className="uppercase text-lg accordion-header" id={`${itemId}-header`}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${itemId}`}
                        aria-expanded="false"
                        aria-controls={itemId}
                      >
                        Patient {itemId}
                      </button>
                    </h6>
                    <div
                      id={itemId}
                      className="accordion-collapse collapse"
                      aria-labelledby={`${itemId}-header`}
                    >
                      <div className="accordion-body">
                        <fieldset className="mt-3">
                          {buildQuestionFormField(questions, `-${itemId}`)}
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
      <div className="mt-3 mb-3 accordion" id={nameId}>
        {elements}
      </div>
    </>
  );
};

const SingleSelectionQuestionFormField = ({question, suffixName}: {question: SingleSelectionQuestion<ID, ErrorType>, suffixName: string}) => {
  const [choices, setChoices] = useState(question.getChoices());
  const [nameId] = useState(`${question.getId()}-${uuid()}${suffixName}`);

  return (
    <FormField>
      <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
      {choices.map((choice: ImmutableChoice, index) => {
        return (
          <div key={`${nameId}-${index}`}>
            <input
              id={`${nameId}-${index}`}
              className="form-check-input"
              name={nameId}
              type="radio"
              checked={choice.wasChosen()}
              onChange={() => {
                question.setAnswer(index);
                setChoices(question.getChoices());
              }}
            />
            &nbsp;<label htmlFor={`${nameId}-${index}`}>{choice.getDescription()}</label>
          </div>
        );
      })}
    </FormField>
  );
};

const MultiSelectionQuestionFormField = ({question, suffixName}: {question: MultipleSelectionQuestion<ID, ErrorType>, suffixName: string}) => {
  const [nameId] = useState(`${question.getId()}-${uuid()}${suffixName}`);

  return (
    <FormField>
      <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
      {question.getChoices().map((choice: ImmutableChoice, index) => (
        <div key={`${nameId}-${index}`}>
          <input
            id={`${nameId}-${index}`}
            className="form-check-input"
            name={`${nameId}-${index}`}
            type="checkbox"
            checked={choice.wasChosen()}
            onChange={() => {
              question.setAnswer(choice.wasChosen() ? question.getAnswer().filter((choiceIndex) => choiceIndex !== index) : question.getAnswer().concat(index));
            }}
          />
          &nbsp;<label htmlFor={`${nameId}-${index}`}>{choice.getDescription()}</label>
        </div>
      ))}
    </FormField>
  );
};

const buildQuestionFormField = (questions: QuestionGroup<ID, ErrorType>, suffixName: string): JSX.Element => {
  return (
    <FormField>
      {' ' /* TODO: use better ways to add margins or pad components */}
      {questions
        .map<[QuestionNode<ID, ErrorType>, FunctionalComponent]>({
          textQuestion: (q) => [q, TextQuestionFormField],
          numericQuestion: (q) => [q, NumericQuestionFormField],
          singleSelectionQuestion: (q) => [q, SingleSelectionQuestionFormField],
          multipleSelectionQuestion: (q) => [q, MultiSelectionQuestionFormField],
          questionGroup: (q) => [q, buildQuestionFormField],
          compositionQuestion: (q) => [q, CompositionQuestionFormField],
          expandableQuestion: (q) => [q, ExpandableQuestionFormField],
        })
        .map((tuple: [QuestionNode<ID, ErrorType>, any]) => {
          const [question, FormFieldComponent] = tuple;
          return <FormFieldComponent key={question.getId()} question={question} suffixName={suffixName}/>;
        })}
      {' '}
    </FormField>
  );
};

interface ReportFormProps {
  reportTemplate: QuestionGroup<string, string>;
  submitReport: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const ReportForm = ({ reportTemplate, submitReport }: ReportFormProps): JSX.Element => {
  return (
    <div className="mt-3 report-form">
      <h2>{reportTemplate.prompt}</h2>
      <form className="col-md-6" onSubmit={submitReport}>
        <input type="submit" value="Submit"/>
        {buildQuestionFormField(reportTemplate, "")}
        <input type="submit" value="Submit"/>
      </form>
    </div>
  );
};
