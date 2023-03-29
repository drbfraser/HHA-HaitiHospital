import { ExpandableQuestion } from '@hha/common';
import cn from 'classnames';

const ExpandableQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
  buildQuestionFormField,
  setErrorSet,
}: {
  applyReportChanges: () => void;
  question: ExpandableQuestion<ID, ErrorType>;
  suffixName: string;
  buildQuestionFormField: FunctionalComponent;
  setErrorSet: React.Dispatch<React.SetStateAction<Set<string>>>;
}): JSX.Element => {
  const nameId = `${question.getId()}${suffixName}`;

  return (
    <>
      <div className="accordion mb-3" id={nameId}>
        {question.map<JSX.Element>((questionGroup, index) => {
          const itemId: string = `accordion-item-${nameId}_${index + 1}`;
          return (
            <div className="accordion-item border-none" key={itemId}>
              <h6
                className="accordion-header container-fluid m-0 p-0 text-lg uppercase"
                id={`${itemId}-header`}
              >
                <div className="row p-0 m-0 align-items-center"></div>
              </h6>
              <div id={itemId} className={cn('show')} aria-labelledby={`${itemId}-header`}>
                <div className="accordion-body pb-0">
                  {buildQuestionFormField({
                    applyReportChanges: applyReportChanges,
                    questions: questionGroup,
                    suffixName: `_${index + 1}`,
                    setErrorSet: setErrorSet,
                    readOnly: true,
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
