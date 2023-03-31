import Pagination from 'components/pagination/Pagination';
import SubmitButton from './SubmitButton';
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

export const QuestionFormFields = ({
  applyReportChanges,
  questions,
  setErrorSet,
  suffixName,
  currentPage,
  readOnly,
}: {
  applyReportChanges: () => void;
  questions: QuestionGroup<ID, ErrorType>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  currentPage?: number;
  readOnly?: boolean;
}) => {
  return (
    <>
      {questions
        .map<[QuestionNode<ID, ErrorType>, FunctionalComponent]>({
          compositionQuestion: (q) => [q, CompositionQuestionFormField],
          expandableQuestion: (q) => [q, ExpandableQuestionFormField],
          multipleSelectionQuestion: (q) => [q, MultiSelectionQuestionFormField],
          numericQuestion: (q) => [q, NumericQuestionFormField],
          questionGroup: (q) => [q, QuestionFormFields],
          singleSelectionQuestion: (q) => [q, SingleSelectionQuestionFormField],
          textQuestion: (q) => [q, TextQuestionFormField],
        })
        // TODO: Remove "any" type
        .map((tuple: [QuestionNode<ID, ErrorType>, any]) => {
          const [question, FormFieldComponent] = tuple;
          return (
            <FormFieldComponent
              applyReportChanges={applyReportChanges}
              key={`${question.getId()}${suffixName}`}
              question={question}
              setErrorSet={setErrorSet}
              readOnly={readOnly}
              suffixName={suffixName}
            />
          );
        })
        .slice(
          currentPage === undefined ? 0 : questions.getPagination()[currentPage - 1][0],
          currentPage === undefined
            ? questions.getSize()
            : questions.getPagination()[currentPage - 1][1],
        )}
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
  const pageSize = reportData
    .getPagination()
    .map((paginationIndices) => paginationIndices[1] - paginationIndices[0])
    .reduce((prev, curr) => (curr > prev ? curr : prev));

  return (
    <div className="mt-3 p-3">
      <h2 className="mb-3">{reportData.getPrompt()}</h2>
      <form onSubmit={formHandler} noValidate>
        <SubmitButton
          buttonText={`${btnText} Report`}
          disabled={!(errorSet.size === 0) || isSubmitting}
          readOnly={readOnly}
        />
        <Group isRootNode>
          <QuestionFormFields
            applyReportChanges={applyReportChanges}
            currentPage={currentPage}
            questions={reportData}
            readOnly={readOnly}
            setErrorSet={setErrorSet}
            suffixName=""
          />
        </Group>
        <SubmitButton
          buttonText={`${btnText} Report`}
          disabled={!(errorSet.size === 0) || isSubmitting}
          readOnly={readOnly}
        />
      </form>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        pageSize={pageSize}
        totalCount={reportData.getPagination().length * pageSize}
      />
    </div>
  );
};
