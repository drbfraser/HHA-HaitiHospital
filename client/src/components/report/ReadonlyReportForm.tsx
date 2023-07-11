import Pagination from 'components/pagination/Pagination';
import { QuestionGroup, QuestionNode, ReportMetaData } from '@hha/common';
import {
  CompositionQuestionFormField,
  ExpandableQuestionViewField,
  FormField,
  Group,
  MultiSelectionQuestionFormField,
  NumericQuestionFormField,
  SingleSelectionQuestionFormField,
  TextQuestionFormField,
} from '../question_form_components';
import QuestionRows from './QuestionRows';
import { useEffect, useState } from 'react';
import { createImportSpecifier } from 'typescript';
import HoverableTableHead from 'components/table/HoverableTableHead';
import { Form } from 'react-bootstrap/lib/Navbar';
import { QuestionRow } from 'constants/interfaces';

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
  isUsingTable = true,
  date,
  author,
  questionItems = [],
}: {
  applyReportChanges?: () => void;
  formHandler?: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  reportData: QuestionGroup<ID, ErrorType>;
  btnText?: string;
  isTemplate?: boolean;
  isUsingPagination?: boolean;
  isUsingTable?: boolean;
  date?: string;
  author?: string;
  questionItems: any[];
}): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  console.log(reportData);
  const pageSize = reportData
    .getPagination()
    .map((paginationIndices) => paginationIndices[1] - paginationIndices[0])
    .reduce((prev, curr) => (curr > prev ? curr : prev));
  const totalCount = reportData.getPagination().length * pageSize;

  return (
    <div className="mt-3 p-3">
      <h3 className="mb-3">
        {reportData.getPrompt()} - {author} - {date}{' '}
      </h3>
      <form onSubmit={formHandler} noValidate>
        {isUsingTable ? (
          <div className="table-responsive">
            <table className="table table-responsive-sm w-auto mt-2">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Question</th>
                  <th scope="col">Answer</th>
                </tr>
              </thead>
              <tbody>
                <QuestionRows questionItems={questionItems} />
              </tbody>
            </table>
          </div>
        ) : (
          <Group isRootNode>
            <QuestionFormFields
              applyReportChanges={applyReportChanges}
              currentPage={isUsingPagination ? currentPage : undefined}
              isTemplate={isTemplate}
              questions={reportData}
              suffixName=""
            />
          </Group>
        )}
      </form>
      {!isUsingTable && isUsingPagination && (
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
