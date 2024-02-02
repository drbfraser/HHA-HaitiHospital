import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { CompositionQuestion, NumericQuestion } from '@hha/common';
import { FormField, Group, NumericQuestionFormField } from '.';

import cn from 'classnames';
import { useTranslation } from 'react-i18next';

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
  const inputState = question.getValidationResults();
  const nameId = `${question.getId()}${suffixName}`;
  const { i18n } = useTranslation();
  const prompt = question.getPrompt();
  const language = i18n.language.substring(0, 2);
  const promptValue = prompt && prompt[language] ? prompt[language] : '';

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    question.setAnswer(parseInt(newValue));

    applyReportChanges();
    updateErrorSetFromSelf();
  };

  const updateErrorSetFromSelf = useCallback(() => {
    setErrorSet((prevErrorSet: Set<ID>) => {
      const nextErrorSet = new Set(prevErrorSet);

      if (question.getValidationResults() !== true) {
        nextErrorSet.add(nameId);
      } else {
        nextErrorSet.delete(nameId);
      }

      return nextErrorSet;
    });
  }, [nameId, question, setErrorSet]);

  useEffect(() => {
    updateErrorSetFromSelf();

    // cleanup function that removes this question from the errorSet when the question is removed or unmounted
    // e.g. when an expandable question shrinks or removes its child questions
    return () => {
      setErrorSet((prevErrorSet: Set<ID>) => {
        const nextErrorSet = new Set(prevErrorSet);
        nextErrorSet.delete(nameId);
        return nextErrorSet;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameId]);

  return (
    <>
      <FormField
        handleChange={handleChange}
        inputState={inputState}
        min={0}
        nameId={nameId}
        prompt={promptValue}
        type="number"
        value={question.getAnswer()}
        readOnly={readOnly}
      />
      {question.map<JSX.Element>((group, index) => {
        const groupId = `${group.getId()}${suffixName}`;
        const hasErrors = allSumUpInfo.invalidGroupsIndices.includes(index);

        return (
          <fieldset className="form-group mb-0 pl-3" key={groupId}>
            <legend
              className={cn('fs-6 mb-2 mt-0', {
                'text-danger': hasErrors,
                'text-secondary': !hasErrors,
              })}
            >
              {`${groupId.replaceAll('_', '.')}. ${group.getPrompt()[language]}`}
              {hasErrors && <i className="bi bi-exclamation-circle ms-2" />}
            </legend>
            <Group hasErrors={hasErrors}>
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
