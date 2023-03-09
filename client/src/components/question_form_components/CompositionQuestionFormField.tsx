import { CompositionQuestion, NumericQuestion, ValidationResult } from '@hha/common';
import { FormField, Group, NumericQuestionFormField } from '.';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

const CompositionQuestionFormField = ({
  applyReportChanges,
  question,
  setErrorSet,
  suffixName,
  readOnly,
}: {
  applyReportChanges: () => void;
  question: CompositionQuestion<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  readOnly?: boolean;
}): JSX.Element => {
  const allSumUpInfo = question.getAllSumUpInfo();
  const inputState: ValidationResult<ErrorType> = question.getValidationResults();
  const nameId = `${question.getId()}${suffixName}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    question.setAnswer(parseInt(newValue));

    applyReportChanges();
    updateErrorSetFromSelf();
  };

  const updateErrorSetFromSelf = () => {
    setErrorSet((prevErrorSet: Set<ID>) => {
      const nextErrorSet = new Set(prevErrorSet);

      if (inputState !== true) {
        nextErrorSet.add(question.getId());
      } else {
        nextErrorSet.delete(question.getId());
      }

      return nextErrorSet;
    });
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
      {question.map<JSX.Element>((group, index) => {
        const groupId = `${group.getId()}${suffixName}`;

        return (
          <fieldset className="form-group mb-0 pl-3" key={groupId}>
            <legend className="fs-6 mb-3 mt-0 text-secondary">
              {groupId.replaceAll('_', '.')}. {group.getPrompt()}
            </legend>
            <Group hasErrors={allSumUpInfo.invalidGroupsIndices.includes(index)}>
              {group.map((elem) => {
                if (elem.constructor.name === CompositionQuestion.name) {
                  return (
                    <CompositionQuestionFormField
                      applyReportChanges={applyReportChanges}
                      key={`${elem.getId()}${suffixName}`}
                      question={elem as CompositionQuestion<ID, ErrorType>}
                      readOnly={readOnly}
                      setErrorSet={(value: SetStateAction<Set<ID>>) => {
                        updateErrorSetFromSelf();
                        setErrorSet(value);
                      }}
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
                      setErrorSet={(value: SetStateAction<Set<ID>>) => {
                        updateErrorSetFromSelf();
                        setErrorSet(value);
                      }}
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
