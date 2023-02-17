import { ExpandableQuestion, ValidationResult } from '@hha/common';
import { ChangeEvent, useState } from 'react';
import { FormField } from './index';

const ExpandableQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
  buildQuestionFormField,
}: {
  applyReportChanges: () => void;
  question: ExpandableQuestion<ID, ErrorType>;
  suffixName: string;
  buildQuestionFormField: FunctionalComponent;
}): JSX.Element => {
  const [inputState] = useState<ValidationResult<string>>(true);
  const nameId = `${question.getId()}${suffixName}`;

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
      <div className="accordion mb-3" id={nameId}>
        {question.map<JSX.Element>((questionGroup, index) => {
          const itemId: string = `accordion-${nameId}_${index + 1}`;

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

export default ExpandableQuestionFormField;
