import { CompositionQuestion, NumericQuestion, ValidationResult, ERROR_DOES_NOT_SUM_UP } from '@hha/common';
import { FormField, Group, NumericQuestionFormField } from '.';

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
              {group.map((elem) => {
                if (elem.constructor.name === CompositionQuestion.name) {
                  return <CompositionQuestionFormField
                    applyReportChanges={applyReportChanges}
                    key={`${elem.getId()}${suffixName}`}
                    question={elem as CompositionQuestion<ID, ErrorType>}
                    suffixName={suffixName}
                  />;
                }
                else if (elem.constructor.name === NumericQuestion.name) {
                  return <NumericQuestionFormField
                    applyReportChanges={applyReportChanges}
                    key={`${elem.getId()}${suffixName}`}
                    question={elem as NumericQuestion<ID, ErrorType>}
                    suffixName={suffixName}
                  />;
                }
                return <div>Error: Undefined</div>
              })}
            </Group>
          </fieldset>
        );
      })}
    </>
  );
};

export default CompositionQuestionFormField;
