import Pagination from 'components/pagination/Pagination';
import { QuestionGroup, QuestionNode, ReportMetaData } from '@hha/common';
import {
  CompositionQuestionFormField,
  ExpandableQuestionViewField,
  Group,
  MultiSelectionQuestionFormField,
  NumericQuestionFormField,
  SingleSelectionQuestionFormField,
  TextQuestionFormField,
} from '../question_form_components';
import { useState } from 'react';
import { createImportSpecifier } from 'typescript';

export const QuestionFormFields = ({
  applyReportChanges,
  questions,
  suffixName,
  currentPage,
  isTemplate = false,
}: {
  applyReportChanges: () => void;
  questions: QuestionGroup<ID, ErrorType>;
  suffixName: string;
  currentPage?: number;
  isTemplate?: boolean;
}) => {
  return (
    <>
      {questions
        .map<[QuestionNode<ID, ErrorType>, FunctionalComponent]>({
          compositionQuestion: (q) => [q, CompositionQuestionFormField],
          expandableQuestion: (q) => [q, ExpandableQuestionViewField],
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
              setErrorSet={() => {}}
              readOnly
              suffixName={suffixName}
              isTemplate={isTemplate}
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

const ReadonlyReportForm = ({
  applyReportChanges,
  formHandler,
  reportData,
  isTemplate = false,
  isUsingPagination = true,
  date,
  author,
}: {
  applyReportChanges?: () => void;
  formHandler?: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  reportData: QuestionGroup<ID, ErrorType>;
  btnText?: string;
  isTemplate?: boolean;
  isUsingPagination?: boolean;
  date?: string;
  author?: string;
}): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = reportData
    .getPagination()
    .map((paginationIndices) => paginationIndices[1] - paginationIndices[0])
    .reduce((prev, curr) => (curr > prev ? curr : prev));
  const totalCount = reportData.getPagination().length * pageSize;

  return (
    <div className="mt-3 p-3">
      <h2 className="mb-3">{reportData.getPrompt()}</h2>
      <p>Author: {author}</p>
      <p>Date: {date}</p>
      <form onSubmit={formHandler} noValidate>
        <Group isRootNode>
          <QuestionFormFields
            applyReportChanges={applyReportChanges}
            currentPage={isUsingPagination ? currentPage : undefined}
            isTemplate={isTemplate}
            questions={reportData}
            suffixName=""
          />
        </Group>
      </form>
      {isUsingPagination && (
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      )}
    </div>
  );
};

export default ReadonlyReportForm;
