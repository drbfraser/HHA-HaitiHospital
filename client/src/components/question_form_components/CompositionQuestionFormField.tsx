import { CompositionQuestion, ValidationResult, ERROR_DOES_NOT_SUM_UP } from '@hha/common';
import { FormField, Group, NumericQuestionFormField } from './index';
import { useState } from 'react';

const CompositionQuestionFormField = ({
  applyReportChanges,
  question,
  suffixName,
  setErrorSet,
}: {
  applyReportChanges: () => void;
  question: CompositionQuestion<ID, ErrorType>;
  suffixName: string;
  setErrorSet: React.Dispatch<React.SetStateAction<Set<string>>>;
}): JSX.Element => {
  const [inputState, setInputState] = useState<ValidationResult<string>>(true);
  const nameId = `${question.getId()}${suffixName}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    question.setAnswer(parseInt(event.target.value));
    applyReportChanges();
    if (question.allSumUp()) {
      setInputState(true);
      setErrorSet((prev) => {
        const newSet = new Set(prev);
        newSet.delete(question.getId());
        return newSet;
      });
    } else {
      setInputState(ERROR_DOES_NOT_SUM_UP);
      setErrorSet((prev) => {
        const newSet = new Set(prev);
        newSet.add(question.getId());
        return newSet;
      });
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
      {question.map<JSX.Element>((group) => {
        const groupId = `${group.getId()}${suffixName}`;

        return (
          <fieldset className="form-group mb-0 pl-3" key={groupId}>
            <legend className="fs-6 mb-3 mt-0 text-secondary">
              {groupId.replaceAll('_', '.')}. {group.getPrompt()}
            </legend>
            <Group>
              {group.map((elem) => (
                <NumericQuestionFormField
                  applyReportChanges={applyReportChanges}
                  key={`${elem.getId()}${suffixName}`}
                  question={elem}
                  suffixName={suffixName}
                  setErrorSet={setErrorSet}
                  allSumUp={() => question.allSumUp()}
                  setParentCompositionState={setInputState}
                  compositionParentId={question.getId()}
                />
              ))}
            </Group>
          </fieldset>
        );
      })}
    </>
  );
};

export default CompositionQuestionFormField;
