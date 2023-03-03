import { QuestionGroup, QuestionNode } from '@hha/common';
import {
  CompositionQuestionFormField,
  ExpandableQuestionFormField,
  MultiSelectionQuestionFormField,
  SingleSelectionQuestionFormField,
  NumericQuestionFormField,
  Group,
  TextQuestionFormField,
} from '../question_form_components';
import { useState } from 'react';

const buildQuestionFormField = ({
  applyReportChanges,
  questions,
  suffixName,
  setErrorSet,
  readOnly,
}: {
  applyReportChanges: () => void;
  questions: QuestionGroup<ID, ErrorType>;
  suffixName: string;
  setErrorSet: React.Dispatch<React.SetStateAction<Set<string>>>;
  readOnly?: boolean;
}): JSX.Element => {
  return (
    <>
      {questions
        .map<[QuestionNode<ID, ErrorType>, FunctionalComponent]>({
          compositionQuestion: (q) => [q, CompositionQuestionFormField],
          expandableQuestion: (q) => [q, ExpandableQuestionFormField],
          multipleSelectionQuestion: (q) => [q, MultiSelectionQuestionFormField],
          numericQuestion: (q) => [q, NumericQuestionFormField],
          questionGroup: (q) => [q, buildQuestionFormField],
          singleSelectionQuestion: (q) => [q, SingleSelectionQuestionFormField],
          textQuestion: (q) => [q, TextQuestionFormField],
        })
        .map((tuple: [QuestionNode<ID, ErrorType>, any]) => {
          const [question, FormFieldComponent] = tuple;
          return (
            <FormFieldComponent
              applyReportChanges={applyReportChanges}
              buildQuestionFormField={buildQuestionFormField}
              key={`${question.getId()}${suffixName}`}
              question={question}
              setErrorSet={setErrorSet}
              readOnly={readOnly}
              suffixName={suffixName}
            />
          );
        })}
    </>
  );
};

export const ReportForm = ({
  applyReportChanges,
  formHandler,
  isSubmitting,
  reportData,
  btnText = 'Submit',
  readOnly,
}: {
  applyReportChanges: () => void;
  formHandler: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  reportData: QuestionGroup<ID, ErrorType>;
  btnText?: string;
  readOnly?: boolean;
}): JSX.Element => {
  const [errorSet, setErrorSet] = useState<Set<string>>(new Set());

  return (
    <div className="mt-3 p-3">
      <h2 className="mb-3">{reportData.getPrompt()}</h2>
      <form onSubmit={formHandler} noValidate>
        {!readOnly && (
          <input
            className="btn btn-outline-primary"
            type="submit"
            value={`${btnText} Report`}
            disabled={!(errorSet.size === 0)}
          />
        )}

        <Group isRootNode>
          {buildQuestionFormField({
            applyReportChanges: applyReportChanges,
            questions: reportData,
            suffixName: '',
            setErrorSet: setErrorSet,
            readOnly,
          })}
        </Group>
        {!readOnly && (
          <input className="btn btn-outline-primary" type="submit" value={`${btnText} Report`} />
        )}
      </form>
    </div>
  );
};
