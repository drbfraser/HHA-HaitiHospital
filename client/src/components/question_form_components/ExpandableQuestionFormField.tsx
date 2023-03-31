import cn from 'classnames';
import { ChangeEvent, useState } from 'react';
import { ExpandableQuestion } from '@hha/common';
import { FormField } from './index';
import { QuestionFormFields } from "components/report/ReportForm";

const ExpandableQuestionFormField = ({
  applyReportChanges,
  question,
  setErrorSet,
  suffixName,
}: {
  applyReportChanges: () => void;
  question: ExpandableQuestion<ID, ErrorType>;
  setErrorSet: React.Dispatch<React.SetStateAction<Set<string>>>;
  suffixName: string;
}): JSX.Element => {
  const [openClosedStates, setOpenClosedStates] = useState<boolean[]>([]);
  const inputState = question.getValidationResults();
  const nameId = `${question.getId()}${suffixName}`;

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
      />
      <div className="accordion mb-3" id={nameId}>
        {question.map<JSX.Element>((questionGroup, index) => {
          const isOpen = openClosedStates[index];
          const itemId: string = `accordion-item-${nameId}_${index + 1}`;
          return (
            <div className="accordion-item" key={itemId}>
              <h6
                className="accordion-header container-fluid m-0 p-0 text-lg uppercase"
                id={`${itemId}-header`}
              >
                <div className="row p-0 m-0 align-items-center">
                  <button
                    className={cn('accordion-button col pl-3 pr-1 py-2', {
                      collapsed: !isOpen,
                    })}
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
                </div>
              </h6>
              <div
                id={itemId}
                className={cn('accordion-collapse collapse', { show: isOpen })}
                aria-labelledby={`${itemId}-header`}
              >
                <div className="accordion-body pb-0">
                  <QuestionFormFields
                    applyReportChanges={applyReportChanges}
                    questions={questionGroup}
                    setErrorSet={setErrorSet}
                    suffixName={`_${index + 1}`}
                  />
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
