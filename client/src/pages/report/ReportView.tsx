import { ENDPOINT_REPORTS, ENDPOINT_REPORT_GET_BY_ID } from 'constants/endpoints';
import { FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { NavigationInfo, navigate } from 'components/report/utils';
import { ObjectSerializer, QuestionGroup, ReportMetaData, Role } from '@hha/common';
import { Prompt, useHistory, useLocation } from 'react-router-dom';
import { monthYearOptions, userLocale } from 'constants/date';

import Api from 'actions/Api';
import ConfirmationModal from 'components/popup_modal/ConfirmationModal';
import { History } from 'history';
import Layout from 'components/layout';
import { PDFExport } from '@progress/kendo-react-pdf';
import ReadonlyReportForm from 'components/report/ReadonlyReportForm';
import ReportForm from 'components/report/ReportForm';
import ReportMonthForm from 'components/report/ReportMonthForm';
import { ResponseMessage } from 'utils/response_message';
import { useAuthState } from 'contexts';
import { useDepartmentData } from 'hooks';
import { Trans, useTranslation } from 'react-i18next';
import { XlsxGenerator } from 'components/report/XlsxExport';

const ReportView = () => {
  const user = useAuthState();
  const [areChangesMade, setAreChangesMade] = useState(false);
  const [isShowingNavigationModal, setIsShowingNavigationModal] = useState(false);
  const [isUsingPagination, setIsUsingPagination] = useState(true);
  const [isUsingTable, setIsUsingTable] = useState(true);
  const [metaData, setMetaData] = useState<ReportMetaData | null>(null);
  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo>(null);
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType> | null>(null);
  const [questionItems, setQuestionItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDraft, setIsDraft] = useState<boolean>(true);
  const { departmentIdKeyMap } = useDepartmentData();

  const department = metaData?.departmentId ? departmentIdKeyMap.get(metaData.departmentId) : null;
  const [editMonth, setEditMonth] = useState(false);
  const [reportMonth, setReportMonth] = useState<Date>();
  const [showViewEditBtn, setShowViewEditBtn] = useState(true);

  const { t } = useTranslation();
  const history: History = useHistory<History>();
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
  const pdfExportComponent = useRef<PDFExport | null>(null);
  const report_id = useLocation().pathname.split('/')[2];

  const getReportMonthString = () =>
    reportMonth?.toLocaleDateString(userLocale, monthYearOptions) || '';

  const confirmEdit = (event: FormEvent<HTMLFormElement>, isDraft?: boolean) => {
    event.preventDefault();
    if (typeof isDraft === 'boolean') {
      setIsDraft(isDraft);
    }
    setShowEditModal(true);
  };

  const applyReportChanges = () => {
    setAreChangesMade(true);
    setReport(objectSerializer.deserialize(objectSerializer.serialize(report as Object)));
  };

  const applyMonthChanges = (reportMonth: Date) => {
    setAreChangesMade(true);
    setReportMonth(reportMonth);
    setMetaData((prev) => ({ ...prev!, reportMonth: reportMonth }));
  };

  const handleExportWithComponent = () => {
    pdfExportComponent.current?.save();
  };

  const editBtnHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setReadOnly((prev) => !prev);
  };

  const editMonthBtnHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditMonth((prev) => !prev);
  };

  const reportHandler = () => {
    const serializedReport = objectSerializer.serialize(report as Object);
    const editedReportObject = {
      id: report_id,
      serializedReport,
      submittedBy: user?.userDetails?.name,
      reportMonth: reportMonth,
      isDraft: isDraft,
    };

    setAreChangesMade(false);
    setShowEditModal(false);

    Api.Put(
      ENDPOINT_REPORTS,
      editedReportObject,
      () => {
        if (!readOnly) {
          setReadOnly((prev) => !prev);
        } else {
          setEditMonth((prev) => !prev);
        }
        setShowViewEditBtn(true);
      },
      history,
      ResponseMessage.getMsgUpdateReportFailed(),
      ResponseMessage.getMsgUpdateReportPending(),
      ResponseMessage.getMsgUpdateReportOk(),
    );
  };

  const togglePagination = () => setIsUsingPagination(!isUsingPagination);

  const toggleTable = () => setIsUsingTable((isUsingTable) => !isUsingTable);

  const getReport = useCallback(async () => {
    const controller = new AbortController();
    const fetchedReport: any = await Api.Get(
      ENDPOINT_REPORT_GET_BY_ID(report_id),
      ResponseMessage.getMsgFetchReportFailed(),
      history,
      controller.signal,
    );

    if (Object.keys(fetchedReport).length === 0) {
      return;
    }

    setReport(objectSerializer.deserialize(fetchedReport?.report?.reportObject));
    const reportDate = new Date(fetchedReport?.report?.reportMonth);
    setReportMonth(reportDate);
    setQuestionItems(fetchedReport?.report?.reportObject?.questionItems);
    setMetaData({
      _id: fetchedReport?.report?._id,
      departmentId: fetchedReport?.report?.departmentId,
      reportMonth: reportDate,
      submittedDate: new Date(fetchedReport?.report?.submittedDate),
      submittedBy: fetchedReport?.report?.submittedBy,
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, readOnly]);

  useEffect(() => {
    getReport();
    setIsLoading(false);
  }, [getReport]);

  useEffect(() => {
    if (areChangesMade && !readOnly) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = () => false;
    }

    return () => {
      window.onbeforeunload = () => false;
    };
  }, [areChangesMade, readOnly]);
  if (!isLoading && !report)
    return (
      <Layout showBackButton>
        <h1>{t('reportNotFound')}</h1>
      </Layout>
    );
  return (
    <>
      {!!report && (
        <Layout showBackButton>
          <ConfirmationModal
            messages={[
              <Trans i18nKey="reportConfirmationModal.editReportConfirmBody" />,
              <Trans i18nKey="reportConfirmationModal.editReportCancelBody" />,
            ]}
            onModalCancel={() => setShowEditModal(false)}
            onModalProceed={reportHandler}
            show={showEditModal}
            title={t('reportConfirmationModal.editReportHeader')}
          />
          <ConfirmationModal
            messages={[t('reportConfirmationModal.LeaveWithUnsavedChanges')]}
            onModalCancel={() => {
              setIsShowingNavigationModal(false);
              setNavigationInfo(null);
            }}
            onModalProceed={() => {
              setIsShowingNavigationModal(false);
              navigate(history, navigationInfo, () => {});
            }}
            show={isShowingNavigationModal}
            title={t('reportConfirmationModal.discardEditReportHeader')}
          />
          <Prompt
            message={(location, action) => {
              if (!navigationInfo && areChangesMade) {
                setIsShowingNavigationModal(true);
                setNavigationInfo({ action, location });
                return false;
              }
              return true;
            }}
            when={areChangesMade}
          />

          <header>
            <div>
              {(user.userDetails.role === Role.Admin ||
                user.userDetails.role === Role.MedicalDirector ||
                (user.userDetails.role === Role.HeadOfDepartment &&
                  user.userDetails.department.name === department)) &&
                !editMonth && (
                  <button className="btn btn-primary mr-3" onClick={editBtnHandler}>
                    {readOnly
                      ? t('departmentReportDisplayEditForm')
                      : t('departmentReportDisplayViewForm')}
                  </button>
                )}
              {(user.userDetails.role === Role.Admin ||
                user.userDetails.role === Role.MedicalDirector ||
                (user.userDetails.role === Role.HeadOfDepartment &&
                  user.userDetails.department.name === department)) &&
                readOnly && (
                  <button className="btn btn-primary mr-3" onClick={editMonthBtnHandler}>
                    {readOnly && !editMonth
                      ? t('departmentReportDisplayEditMonth')
                      : t('departmentReportDisplayViewForm')}
                  </button>
                )}
              {/* Other buttons */}
              {readOnly && !editMonth && (
                <span>
                  <button className="btn btn-outline-dark mr-3" onClick={handleExportWithComponent}>
                    {t('departmentReportDisplayGeneratePDF')}
                  </button>
                  <XlsxGenerator questionItems={questionItems} metaData={metaData} />
                </span>
              )}
              {readOnly && !editMonth && (
                <button className="btn bgtn-outline-dark" onClick={toggleTable}>
                  {isUsingTable
                    ? t('departmentReportDisplayHideTable')
                    : t('departmentReportDisplayShowTable')}
                </button>
              )}
              {readOnly && !editMonth && !isUsingTable && (
                <button className="btn btn-outline-dark ml-3" onClick={togglePagination}>
                  {isUsingPagination
                    ? t('departmentReportDisplayHidePagination')
                    : t('departmentReportDisplayShowPagination')}
                </button>
              )}
            </div>
          </header>

          {readOnly && !editMonth && (
            <div className="visually-hidden">
              <PDFExport
                fileName={`${department}_${getReportMonthString().replace(/\s/g, '')}__${metaData?.submittedBy}`}
                paperSize="A4"
                ref={pdfExportComponent}
                scale={0.75}
              />
              <ReadonlyReportForm
                applyReportChanges={applyReportChanges}
                formHandler={() => {}}
                isSubmitting={false}
                isUsingPagination={false}
                isUsingTable={true}
                reportData={report}
                reportMonth={getReportMonthString()}
                author={metaData?.submittedBy}
                questionItems={questionItems}
              />
            </div>
          )}

          {readOnly && editMonth && (
            <ReportMonthForm
              reportMonth={reportMonth}
              applyMonthChanges={applyMonthChanges}
              formHandler={confirmEdit}
            />
          )}

          {readOnly && !editMonth ? (
            <div>
              <ReadonlyReportForm
                applyReportChanges={applyReportChanges}
                btnText="Edit"
                formHandler={confirmEdit}
                isSubmitting={false}
                isUsingPagination={isUsingPagination}
                isUsingTable={isUsingTable}
                reportData={report}
                reportMonth={getReportMonthString()}
                author={metaData?.submittedBy}
                questionItems={questionItems}
              />
            </div>
          ) : (
            !editMonth &&
            !readOnly && (
              <ReportForm
                applyReportChanges={applyReportChanges}
                btnText="Update"
                formHandler={confirmEdit}
                isSubmitting={false}
                reportData={report}
                reportMonth={getReportMonthString()}
                readOnly={false}
              />
            )
          )}
        </Layout>
      )}
    </>
  );
};

export default ReportView;
