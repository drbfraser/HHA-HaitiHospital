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
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { QuestionGroup, QuestionNode } from '@hha/common';
import Pagination from 'components/pagination/Pagination';
import SubmitButton from './SubmitButton';
import { useTranslation } from 'react-i18next';

const getCurrentPageQuestions = (reportData: QuestionGroup<ID, ErrorType>, currentPage: number) => {
  return reportData
    .getQuestionItems()
    .slice(
      currentPage === undefined ? 0 : reportData.getPagination()[currentPage - 1][0],
      currentPage === undefined
        ? reportData.getSize()
        : reportData.getPagination()[currentPage - 1][1],
    );
};

// converts q_1_1_0 to 1
const getQuestionFromQuestionId = (questionId: string) => {
  return parseInt(
    questionId
      .trim()
      .replace(/^[A-Za-z]+/, '')
      .split('_')[0],
  );
};

export const QuestionFormFields = ({
  applyReportChanges,
  questions,
  errorSet,
  setErrorSet,
  suffixName,
  currentPage,
  readOnly,
}: {
  applyReportChanges: () => void;
  questions: QuestionGroup<ID, ErrorType>;
  errorSet: Set<ID>;
  setErrorSet: Dispatch<SetStateAction<Set<ID>>>;
  suffixName: string;
  currentPage?: number;
  readOnly?: boolean;
}) => {
  return (
    <>
      {questions
        .map<[QuestionNode<ID, ErrorType>, any]>({
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
              errorSet={errorSet}
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
  applyReportChanges: () => void;
  formHandler: (event: React.FormEvent<HTMLFormElement>, isDraft: boolean) => void;
  isSubmitting: boolean;
  reportData: QuestionGroup<ID, ErrorType>;
  reportMonth?: string;
  btnText?: string;
  readOnly: boolean;
}

const ReportForm = ({
  applyReportChanges,
  formHandler,
  isSubmitting,
  reportData,
  reportMonth,
  btnText = 'Submit',
  readOnly = false,
}: ReportFormProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage;
  const numberOfPages = reportData.getPagination().length;
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfCompletedPages, setNumberOfCompletedPages] = useState(0);
  const [incompletePages, setIncompletePages] = useState<number[]>([]);
  const [errorSet, setErrorSet] = useState<Set<ID>>(new Set());
  const [submitTooltipText, setSubmitTooltipText] = useState<string>();
  const isNewReport = btnText === 'Submit';

  // Update the tooltip text for the submit button upon changes to form status or language
  const updateSubmitTooltipText = (incompletePages: number[]) => {
    if (incompletePages.length !== 0) {
      setSubmitTooltipText(t('departmentReportDisplaySubmitTooltip') + incompletePages);
    } else {
      setSubmitTooltipText('');
    }
  };

  const pageSize = reportData
    .getPagination()
    .map((paginationIndices) => paginationIndices[1] - paginationIndices[0])
    .reduce((prev, curr) => (curr > prev ? curr : prev));

  /*
   * Initialize the report status array with the number of pages
   * Each page is initialized with a boolean status of completed or not completed
   * New reports are not completed by default, existing reports are completed by default
   */
  const initialReportStatus: ReportStatus[] = Array.from({ length: numberOfPages }, (_, index) => ({
    page: index + 1,
    completed: isNewReport ? false : true,
  }));

  // states responsible for form validation across pages
  const [reportStatus, setReportStatus] = useState<ReportStatus[]>(initialReportStatus);
  const [currentPageQuestionRange, setCurrentPageQuestionRange] = useState<Set<number>>(new Set());
  const [currentPageErrorsExist, setCurrentPageErrorsExist] = useState(false);

  /*
    Sets the question ids for the current page to be used for validation.
    The error set is compared against the current page question ids to determine if any errors exist for the current page.
  */
  useEffect(() => {
    const currentPageQuestions = getCurrentPageQuestions(reportData, currentPage);
    setCurrentPageQuestionRange(
      new Set(currentPageQuestions.map((question) => getQuestionFromQuestionId(question.getId()))),
    );
  }, [currentPage, reportData]);

  /*
    Checks if any errors exist for the current page
  */
  useEffect(() => {
    const currentPageErrors = [...errorSet].some((error) => {
      const questionId = getQuestionFromQuestionId(error);
      return currentPageQuestionRange.has(questionId);
    });
    setCurrentPageErrorsExist(currentPageErrors);
    // console.log(errorSet);
    console.log('Current page has error: ' + currentPageErrors);
  }, [errorSet, currentPageQuestionRange]);

  /*
    Updates the report status for the current page.
    If there are no errors for the current page, the current page is marked as completed.
  */
  useEffect(() => {
    setReportStatus((prev) => {
      const updatedReportStatus = prev.map((status) => {
        if (status.page === currentPage) {
          return {
            ...status,
            completed: currentPageErrorsExist === false,
          };
        }
        return status;
      });
      return updatedReportStatus;
    });
  }, [currentPage, currentPageErrorsExist]);

  /*
    Updates the count for the number of completed pages.
    If all pages are completed, the submit button is enabled.
  */
  useEffect(() => {
    // uncomment to view the validity of each page
    console.log(reportStatus);
    const completedPagesCount = reportStatus.filter((page) => page.completed).length;
    setNumberOfCompletedPages(completedPagesCount);
    const pagesNotComplete = reportStatus
      .filter((page) => !page.completed)
      .map((reportPage) => reportPage.page);
    updateSubmitTooltipText(pagesNotComplete);
    setIncompletePages(pagesNotComplete);
  }, [reportStatus]);

  useEffect(() => {
    updateSubmitTooltipText(incompletePages);
  }, [language]);

  const formHandlerWrapper = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clickedButton = event.currentTarget.querySelector(
      'input[type="submit"]:focus',
    ) as Element;
    const isDraft = clickedButton.getAttribute('name') === 'save';
    formHandler(event, isDraft);
  };

  return (
    <div className="mt-3 p-3">
      <h2 className="mb-3">
        {reportData.getPrompt()[language]} - {reportMonth}
      </h2>
      <form onSubmit={formHandlerWrapper} noValidate>
        <Group isRootNode>
          <QuestionFormFields
            applyReportChanges={applyReportChanges}
            currentPage={currentPage}
            questions={reportData}
            readOnly={readOnly}
            errorSet={errorSet}
            setErrorSet={setErrorSet}
            suffixName=""
          />
        </Group>
        <div className="d-flex gap-2">
          <SubmitButton
            buttonText={t(`button.${btnText.toLowerCase()}`)}
            disabled={numberOfCompletedPages !== numberOfPages || isSubmitting}
            readOnly={readOnly}
            showTooltip={true}
            tooltipText={submitTooltipText}
          />
          <div className="position-sticky bottom-0 py-3">
            <input
              className="btn btn-secondary"
              name="save"
              type="submit"
              value={t('reportSaveAsDraft')}
            />
          </div>
        </div>
        <div className="text-danger">
          <p>{submitTooltipText}</p>
        </div>
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

export default ReportForm;
