import cn from 'classnames';
import { ExpandableQuestion } from '@hha/common';
import { FormField } from './index';
import { QuestionFormFields } from 'components/report/ReadonlyReportForm';

const ExpandableQuestionViewField = ({
  applyReportChanges,
  question,
  suffixName,
  isTemplate = false,
}: {
  applyReportChanges: () => void;
  question: ExpandableQuestion<ID, ErrorType>;
  suffixName: string;
  isTemplate?: boolean;
}): JSX.Element => {
  const inputState = question.getValidationResults();
  const nameId = `${question.getId()}${suffixName}`;

  if (isTemplate) {
    question.setAnswer(1);
  }

  return (
    <>
      <FormField
        handleChange={() => {}}
        inputState={inputState}
        min={0}
        nameId={nameId}
        prompt={question.getPrompt()}
        type="number"
        value={question.getAnswer()}
        readOnly
      />
      <div className="accordion mb-3 bg-light" id={nameId}>
        {question.map<JSX.Element>((questionGroup, index) => {
          const itemId: string = `accordion-item-${nameId}_${index + 1}`;
          return (
            <div className="accordion-item border-0 bg-light" key={itemId}>
              <h6
                className="accordion-header container-fluid m-0 text-lg uppercase pt-4 pl-3"
                id={`${itemId}-header`}
              >
                <div className="row p-0 m-0 align-items-center">{`Patient ${index + 1}`}</div>
              </h6>
              <div
                id={itemId}
                className={cn('accordion-collapse collapse show')}
                aria-labelledby={`${itemId}-header`}
              >
                <div className="accordion-body pb-0">
                  <QuestionFormFields
                    applyReportChanges={applyReportChanges}
                    questions={questionGroup}
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

export default ExpandableQuestionViewField;
