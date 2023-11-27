import {
  CompositionQuestionFormField,
  ExpandableQuestionFormField,
  Group,
  MultiSelectionQuestionFormField,
  NumericQuestionFormField,
  NumericTableFormField,
  SingleSelectionQuestionFormField,
  TextQuestionFormField,
} from '../question_form_components';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { QuestionGroup, QuestionNode } from '@hha/common';

import Pagination from 'components/pagination/Pagination';
import SubmitButton from './SubmitButton';
import { useTranslation } from 'react-i18next';

console.log('ReportForm.tsx');

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
          numericTableQuestion: (q) => [q, NumericTableFormField],
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

interface ReportStatus {
  page: number;
  completed: boolean;
}

interface ReportFormProps {
  applyReportChanges?: () => void;
  formHandler?: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  reportData: QuestionGroup<ID, ErrorType>;
  btnText?: string;
  readOnly?: boolean;
}

const ReportForm = ({
  applyReportChanges,
  formHandler,
  isSubmitting,
  reportData,
  btnText = 'Submit',
  readOnly,
}: ReportFormProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const numberOfPages = reportData.getPagination().length;
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfCompletedPages, setNumberOfCompletedPages] = useState(0);
  const [errorSet, setErrorSet] = useState<Set<ID>>(new Set());

  const pageSize = reportData
    .getPagination()
    .map((paginationIndices) => paginationIndices[1] - paginationIndices[0])
    .reduce((prev, curr) => (curr > prev ? curr : prev));

  const initialReportStatus: ReportStatus[] = Array.from({ length: numberOfPages }, (_, index) => ({
    page: index + 1,
    completed: false,
  }));

  const [reportStatus, setReportStatus] = useState<ReportStatus[]>(initialReportStatus);

  useEffect(() => {
    const updatedReportStatus = reportStatus.map((page, index) => {
      if (index === currentPage - 1) {
        return {
          ...page,
          completed: errorSet.size === 0,
        };
      }
      return page;
    });

    setReportStatus(updatedReportStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, errorSet.size]);

  useEffect(() => {
    console.log(reportStatus);
    const completedPagesCount = reportStatus.filter((page) => page.completed).length;
    setNumberOfCompletedPages(completedPagesCount);
  }, [reportStatus]);

  return (
    <div className="mt-3 p-3">
      <h2 className="mb-3">{reportData.getPrompt()[language]}</h2>
      <p>{errorSet.size}</p>
      <p>{numberOfCompletedPages}</p>
      <form onSubmit={formHandler} noValidate>
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
          buttonText={t(`button.${btnText.toLowerCase()}`)}
          disabled={
            (btnText === 'Submit'
              ? numberOfCompletedPages !== numberOfPages
              : errorSet.size !== 0) || isSubmitting
          }
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
console.log('ReportForm3.tsx');
export default ReportForm;
