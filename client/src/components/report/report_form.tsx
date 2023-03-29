import Pagination from 'components/pagination/Pagination';
import { QuestionGroup, QuestionNode } from '@hha/common';
import {
  CompositionQuestionFormField,
  ExpandableQuestionFormField,
  Group,
  MultiSelectionQuestionFormField,
  NumericQuestionFormField,
  SingleSelectionQuestionFormField,
  TextQuestionFormField,
} from '../question_form_components';
import { Dispatch, SetStateAction, useState } from 'react';

const PAGE_SIZE = 10;

const buildQuestionFormField = ({
  applyReportChanges,
  currentPage,
  questions,
  setErrorSet,
  suffixName,
  readOnly,
}: {
  applyReportChanges: () => void;
  currentPage: number;
  questions: QuestionGroup<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
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
        })
        .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
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
  applyReportChanges?: () => void;
  formHandler?: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  reportData: QuestionGroup<ID, ErrorType>;
  btnText?: string;
  readOnly?: boolean;
}): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const [errorSet, setErrorSet] = useState<Set<ID>>(new Set());

  const buildSubmitButton = () => {
    return (
      <>
        {!readOnly && (
          <input
            className="btn btn-outline-primary"
            disabled={!(errorSet.size === 0) || isSubmitting}
            type="submit"
            value={`${btnText} Report`}
          />
        )}
      </>
    );
  };

  return (
    <div className="mt-3 p-3">
      <h2 className="mb-3">{reportData.getPrompt()}</h2>
      <form onSubmit={formHandler} noValidate>
        {buildSubmitButton()}
        <Group isRootNode>
          {buildQuestionFormField({
            applyReportChanges: applyReportChanges,
            currentPage: currentPage,
            questions: reportData,
            setErrorSet: setErrorSet,
            suffixName: '',
            readOnly,
          })}
        </Group>
        {buildSubmitButton()}
      </form>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        pageSize={PAGE_SIZE}
        totalCount={reportData.getSize()}
      />
    </div>
  );
};
