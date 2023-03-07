import {
  CompositionQuestion,
  NumericQuestion,
  ValidationResult,
  ERROR_DOES_NOT_SUM_UP,
  ERROR_NOT_A_INTEGER,
  isNumber,
} from '@hha/common';
import { FormField, Group, NumericQuestionFormField } from '.';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

const CompositionQuestionFormField = ({
  applyReportChanges,
  question,
  setErrorSet,
  readOnly,
  suffixName,
  allSumUp,
  compositionParentId,
  setParentCompositionState,
}: {
  applyReportChanges: () => void;
  question: CompositionQuestion<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<string>>>;
  suffixName: string;
  allSumUp?: () => boolean;
  compositionParentId?: string;
  setParentCompositionState?: Dispatch<SetStateAction<ValidationResult<string>>>;
  readOnly?: boolean;
}): JSX.Element => {
  const [inputState, setInputState] = useState<ValidationResult<string>>(true);
  const nameId = `${question.getId()}${suffixName}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    question.setAnswer(parseInt(newValue));
    applyReportChanges();

    if (!isNumber(newValue)) {
      // If the input is not a number, then set the error and input state to ERROR_NOT_A_INTEGER
      setInputState(ERROR_NOT_A_INTEGER);
      setErrorSet((prev) => new Set(prev).add(question.getId()));
    } else if (question.allSumUp()) {
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

    // Check if this composition question is not part of a composition question and
    // then remove if it previously had errors registered to its ID
    if (typeof allSumUp !== 'function') {
      isNumber(newValue) &&
        question.allSumUp() &&
        setErrorSet((prev) => {
          const newSet = new Set(prev);
          newSet.delete(question.getId());
          return newSet;
        });
      return;
    }

    // If this composition question is part of a composition question,
    // then check if that parent composition question is valid and
    // set the error and input state of the parent composition question
    if (!allSumUp()) {
      setParentCompositionState(ERROR_DOES_NOT_SUM_UP);
      setErrorSet((prev) => new Set(prev).add(question.getId()));
      return;
    }

    // If the parent composition question is valid,
    // then remove the errors related to the parent composition question and
    // set the input state of the parent composition question to true
    setErrorSet((prev) => {
      const newSet = new Set(prev);
      newSet.forEach((id) => {
        if (id === question.getId()) {
          isNumber(newValue) && question.allSumUp() && newSet.delete(id);
        } else if (id.startsWith(compositionParentId)) {
          newSet.delete(id);
        }
      });
      return newSet;
    });
    setParentCompositionState(true);
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
                if (elem.getClassName() === 'CompositionQuestion') {
                  return (
                    <CompositionQuestionFormField
                      allSumUp={() => question.allSumUp()}
                      applyReportChanges={applyReportChanges}
                      compositionParentId={question.getId()}
                      key={`${elem.getId()}${suffixName}`}
                      question={elem as CompositionQuestion<ID, ErrorType>}
                      setErrorSet={setErrorSet}
                      setParentCompositionState={setInputState}
                      suffixName={suffixName}
                      readOnly={readOnly}
                    />
                  );
                } else if (elem.getClassName() === 'NumericQuestion') {
                  return (
                    <NumericQuestionFormField
                      allSumUp={() => question.allSumUp()}
                      applyReportChanges={applyReportChanges}
                      compositionParentId={question.getId()}
                      key={`${elem.getId()}${suffixName}`}
                      question={elem as NumericQuestion<ID, ErrorType>}
                      setErrorSet={setErrorSet}
                      setParentCompositionState={setInputState}
                      suffixName={suffixName}
                      readOnly={readOnly}
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
