import { CompositionQuestion, NumericQuestion, ValidationResult } from '@hha/common';
import { FormField, Group, NumericQuestionFormField } from '.';
import { ChangeEvent } from 'react';

const CompositionQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
  readOnly,
}: {
  applyReportChanges: () => void;
  question: CompositionQuestion<ID, ErrorType>;
  suffixName: string;
  readOnly?: boolean;
}): JSX.Element => {
  const inputState: ValidationResult<ErrorType> = question.getValidationResults();
  const nameId = `${question.getId()}${suffixName}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    question.setAnswer(parseInt(newValue));
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
        readOnly={readOnly}
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
                  return (
                    <CompositionQuestionFormField
                      applyReportChanges={applyReportChanges}
                      key={`${elem.getId()}${suffixName}`}
                      question={elem as CompositionQuestion<ID, ErrorType>}
                      readOnly={readOnly}
                      suffixName={suffixName}
                    />
                  );
                } else if (elem.constructor.name === NumericQuestion.name) {
                  return (
                    <NumericQuestionFormField
                      applyReportChanges={applyReportChanges}
                      key={`${elem.getId()}${suffixName}`}
                      question={elem as NumericQuestion<ID, ErrorType>}
                      readOnly={readOnly}
                      suffixName={suffixName}
                    />
                  );
                }
                return <div>Error: Undefined</div>;
              })}
            </Group>
          </fieldset>
        );
      })}
    </>
  );
};

export default CompositionQuestionFormField;
