import { ExpandableQuestion, ValidationResult } from '@hha/common';
import { ChangeEvent, useState } from 'react';
import { FormField } from './index';
import cn from 'classnames';

const ExpandableQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
  buildQuestionFormField,
  setErrorSet,
  readOnly,
}: {
  applyReportChanges: () => void;
  question: ExpandableQuestion<ID, ErrorType>;
  suffixName: string;
  buildQuestionFormField: FunctionalComponent;
  setErrorSet: React.Dispatch<React.SetStateAction<Set<string>>>;
  readOnly?: boolean;
}): JSX.Element => {
  const [inputState] = useState<ValidationResult<string>>(true);
  const nameId = `${question.getId()}${suffixName}`;
  const [openClosedStates, setOpenClosedStates] = useState(
    new Array<boolean>(question.getAnswer()).fill(false),
  );
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);

    question.setAnswer(value);
    applyReportChanges();

    if (value > openClosedStates.length) {
      setOpenClosedStates(
        openClosedStates.concat(new Array<boolean>(value - openClosedStates.length).fill(false)),
      );
    } else if (value < openClosedStates.length) {
      setOpenClosedStates(openClosedStates.slice(0, value));
    }
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
        readOnly={readOnly}
      />
      <div className="accordion mb-3" id={nameId}>
        {question.map<JSX.Element>((questionGroup, index) => {
          const isOpen = openClosedStates[index] || readOnly;
          const itemId: string = `accordion-item-${nameId}_${index + 1}`;
          return (
            <div
              className="accordion-item"
              key={itemId}
              {...(readOnly && { style: { border: 'none' } })}
            >
              <h6
                className="accordion-header container-fluid m-0 p-0 text-lg uppercase"
                id={`${itemId}-header`}
              >
                <div className="row p-0 m-0 align-items-center">
                  {!readOnly && (
                    <>
                      <button
                        className={cn('accordion-button col pl-3 pr-1 py-2', { collapsed: isOpen })}
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
                          alignItems: 'center',
                          display: 'flex',
                          height: '1.5em',
                          justifyContent: 'center',
                          width: '1.5em',
                        }}
                      >
                        <i className="fa fa-close"></i>
                      </button>
                    </>
                  )}
                </div>
              </h6>
              <div
                id={itemId}
                className={cn('accordion-collapse collapse', { show: isOpen })}
                aria-labelledby={`${itemId}-header`}
              >
                <div className="accordion-body pb-0">
                  {buildQuestionFormField({
                    applyReportChanges: applyReportChanges,
                    questions: questionGroup,
                    suffixName: `_${index + 1}`,
                    setErrorSet: setErrorSet,
                    readOnly: readOnly,
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

export default ExpandableQuestionFormField;
