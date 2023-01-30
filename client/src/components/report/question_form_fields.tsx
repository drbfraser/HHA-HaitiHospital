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
} from '@hha/common';
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
      {orderedLabel}.{prompt}
    </label>
  );
};

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    question.setAnswer(parseInt(e.target.value));
    applyReportChanges();
  };
  const nameId = `${question.getId()}${suffixName}`;

  return (
    <FormField>
      <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
      <input
        className="form-control w-fit"
        min="0"
        name={nameId}
        onChange={handleChange}
        type="number"
        value={question.getAnswer()}
      />
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    question.setAnswer(e.target.value);
    applyReportChanges();
  };
  const nameId = `${question.getId()}${suffixName}`;

  return (
    <FormField>
      <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
      <input
        className="form-control w-fit"
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    question.setAnswer(parseInt(e.target.value));
    applyReportChanges();
  };
  const nameId = `${question.getId()}${suffixName}`;

  return (
    <>
      <FormField>
        <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
        <input
          className="col-sm form-control w-fit"
          min="0"
          name={nameId}
          onChange={handleChange}
          type="number"
          value={question.getAnswer()}
        />
      </FormField>
      {question.map<JSX.Element>((group) => {
        const groupId = `${group.getId()}${suffixName}`;

        return (
          <div key={groupId}>
            <FormField>
              <FormFieldLabel id={groupId} prompt={group.getPrompt()} />
            </FormField>
            {group.map((elem) => (
              <NumericQuestionFormField
                applyReportChanges={applyReportChanges}
                key={`${elem.getId()}${suffixName}`}
                question={elem}
                suffixName={suffixName}
              />
            ))}
          </div>
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    question.setAnswer(parseInt(e.target.value));
    applyReportChanges();
  };
  const nameId = `${question.getId()}${suffixName}`;

  return (
    <>
      <FormField>
        <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
        <input
          className="col-sm form-control w-fit"
          min="0"
          name={nameId}
          onChange={handleChange}
          type="number"
          value={question.getAnswer()}
        />
      </FormField>
      <div className="mt-3 mb-3 accordion" id={nameId}>
        {question.map<JSX.Element>((questionGroup, index) => {
          const itemId: string = `_${index}`;

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
                  Patient {itemId}
                </button>
              </h6>
              <div
                id={itemId}
                className="accordion-collapse collapse show"
                aria-labelledby={`${itemId}-header`}
              >
                <div className="accordion-body">
                  <fieldset className="mt-3">
                    {buildQuestionFormField({
                      applyReportChanges: applyReportChanges,
                      questions: questionGroup,
                      suffixName: itemId,
                    })}
                  </fieldset>
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
    <FormField>
      <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
      {question.getChoices().map((choice: ImmutableChoice, index) => {
        return (
          <div key={`${nameId}_${index}`}>
            <input
              checked={choice.wasChosen()}
              className="form-check-input"
              id={`${nameId}_${index}`}
              name={nameId}
              onChange={getChangeHandler(index)}
              type="radio"
            />
            &nbsp;
            <label htmlFor={`${nameId}_${index}`}>{choice.getDescription()}</label>
          </div>
        );
      })}
    </FormField>
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
    <FormField>
      <FormFieldLabel id={nameId} prompt={question.getPrompt()} />
      {question.getChoices().map((choice: ImmutableChoice, index) => (
        <div key={`${nameId}_${index}`}>
          <input
            checked={choice.wasChosen()}
            className="form-check-input"
            id={`${nameId}_${index}`}
            name={`${nameId}_${index}`}
            onChange={getChangeHandler(choice, index)}
            type="checkbox"
          />
          &nbsp;
          <label htmlFor={`${nameId}_${index}`}>{choice.getDescription()}</label>
        </div>
      ))}
    </FormField>
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
          return (
            <FormFieldComponent
              applyReportChanges={applyReportChanges}
              key={`${question.getId()}${suffixName}`}
              question={question}
              suffixName={suffixName}
            />
          );
        })}{' '}
    </FormField>
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
    <div className="mt-3 report-form">
      <h2>{reportData.getPrompt()}</h2>
      <form className="col-md-6" onSubmit={submitReport}>
        <input type="submit" value="Submit" />
        {buildQuestionFormField({
          applyReportChanges: applyReportChanges,
          questions: reportData,
          suffixName: '',
        })}
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};
