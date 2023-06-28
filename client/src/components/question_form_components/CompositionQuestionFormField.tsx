import { CompositionQuestion, NumericQuestion } from '@hha/common';
import { FormField, Group, NumericQuestionFormField } from '.';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

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
  console.log('compositionQuestion promptValue1');
  const allSumUpInfo = question.getAllSumUpInfo();
  const inputState = question.getValidationResults();
  const nameId = `${question.getId()}${suffixName}`;
  const { t, i18n } = useTranslation();
  const prompt = question.getPrompt();
  const language = i18n.language;
  const promptValue = prompt && prompt[language] ? prompt[language] : '';
  console.log('compositionQuestion promptValue2', promptValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    question.setAnswer(parseInt(newValue));

    applyReportChanges();
    updateErrorSetFromSelf();
  };

  const updateErrorSetFromSelf = () => {
    setErrorSet((prevErrorSet: Set<ID>) => {
      const nextErrorSet = new Set(prevErrorSet);

      if (question.getValidationResults() !== true) {
        nextErrorSet.add(nameId);
      } else {
        nextErrorSet.delete(nameId);
      }

      return nextErrorSet;
    });
  };

  useEffect(() => {
    updateErrorSetFromSelf();

    return () => {
      setErrorSet((prevErrorSet: Set<ID>) => {
        const nextErrorSet = new Set(prevErrorSet);
        nextErrorSet.delete(nameId);
        return nextErrorSet;
      });
    };
  }, []);

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
              {`${groupId.replaceAll('_', '.')}. ${promptValue}`}
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
