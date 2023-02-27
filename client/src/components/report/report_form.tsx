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

const ExpandableQuestion = ({ applyReportChanges, question, suffixName, setErrorSet }) =>
  ExpandableQuestionFormField({
    applyReportChanges,
    question,
    suffixName,
    buildQuestionFormField,
    setErrorSet,
  });

const buildQuestionFormField = ({
  applyReportChanges,
  questions,
  suffixName,
  setErrorSet,
  viewOnly,
}: {
  applyReportChanges: () => void;
  questions: QuestionGroup<ID, ErrorType>;
  suffixName: string;
  setErrorSet: React.Dispatch<React.SetStateAction<Set<string>>>;
  viewOnly?: boolean;
}): JSX.Element => {
  return (
    <>
      {questions
        .map<[QuestionNode<ID, ErrorType>, FunctionalComponent]>({
          compositionQuestion: (q) => [q, CompositionQuestionFormField],
          expandableQuestion: (q) => [q, ExpandableQuestion],
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
              key={`${question.getId()}${suffixName}`}
              question={question}
              suffixName={suffixName}
              setErrorSet={setErrorSet}
              viewOnly={viewOnly}
            />
          );
        })}
    </>
  );
};

export const ReportForm = ({
  applyReportChanges,
  reportData,
  formHandler,
  viewOnly,
}: {
  applyReportChanges: () => void;
  reportData: QuestionGroup<ID, ErrorType>;
  formHandler: (event: React.FormEvent<HTMLFormElement>) => void;
  viewOnly?: boolean;
}): JSX.Element => {
  const [errorSet, setErrorSet] = useState<Set<string>>(new Set());
  return (
    <div className="mt-3 p-3">
      <h2 className="mb-3">{reportData.getPrompt()}</h2>
      <form onSubmit={formHandler} noValidate>
        <input
          className="btn btn-outline-primary"
          type="submit"
          value="Submit Report"
          disabled={!(errorSet.size === 0)}
        />
        <Group>
          {buildQuestionFormField({
            applyReportChanges: applyReportChanges,
            questions: reportData,
            suffixName: '',
            setErrorSet: setErrorSet,
            viewOnly,
          })}
        </Group>
        <input className="btn btn-outline-primary" type="submit" value="Submit Report" />
      </form>
    </div>
  );
};
