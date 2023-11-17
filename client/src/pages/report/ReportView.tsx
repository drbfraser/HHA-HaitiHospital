import { ENDPOINT_REPORTS, ENDPOINT_REPORT_GET_BY_ID } from 'constants/endpoints';
import { FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { NavigationInfo, navigate } from 'components/report/utils';
import { ObjectSerializer, QuestionGroup, ReportMetaData } from '@hha/common';
import { Prompt, useHistory, useLocation } from 'react-router-dom';
import { dateOptions, userLocale } from 'constants/date';

import Api from 'actions/Api';
import ConfirmationModal from 'components/popup_modal/ConfirmationModal';
import { History } from 'history';
import Layout from 'components/layout';
import { PDFExport } from '@progress/kendo-react-pdf';
import ReadonlyReportForm from 'components/report/ReadonlyReportForm';
import ReportForm from 'components/report/ReportForm';
import { ResponseMessage } from 'utils/response_message';
import { useAuthState } from 'contexts';
import { useDepartmentData } from 'hooks';
import { Trans, useTranslation } from 'react-i18next';
import { Role } from 'constants/interfaces';

const ReportView = () => {
  const user = useAuthState();
  const [areChangesMade, setAreChangesMade] = useState(false);
  const [isShowingNavigationModal, setIsShowingNavigationModal] = useState(false);
  const [isUsingPagination, setIsUsingPagination] = useState(true);
  const [isUsingTable, setIsUsingTable] = useState(true);
  const [metaData, setMetaData] = useState<ReportMetaData>(null);
  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo>(null);
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType>>(null);
  const [questionItems, setQuestionItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const { departmentIdKeyMap } = useDepartmentData();
  const department = departmentIdKeyMap.get(metaData?.departmentId);

  const [showViewEditBtn, setShowViewEditBtn] = useState(true);

  const { t } = useTranslation();
  const history: History = useHistory<History>();
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
  const pdfExportComponent = useRef(null);
  const report_id = useLocation().pathname.split('/')[2];
  const submittedDate = new Date(metaData?.submittedDate).toLocaleDateString(
    userLocale,
    dateOptions,
  );

  const confirmEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowEditModal(true);
  };

  const applyReportChanges = () => {
    setAreChangesMade(true);
    setReport(objectSerializer.deserialize(objectSerializer.serialize(report)));
  };

  const handleExportWithComponent = () => {
    pdfExportComponent.current.save();
  };

  const btnHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setReadOnly((prev) => !prev);
  };

  const reportHandler = () => {
    const serializedReport = objectSerializer.serialize(report);
    const editedReportObject = {
      id: report_id,
      serializedReport,
      submittedBy: user?.userDetails?.name,
    };

    setAreChangesMade(false);
    setShowEditModal(false);

    Api.Put(
      ENDPOINT_REPORTS,
      editedReportObject,
      () => {
        setReadOnly((prev) => !prev);
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

    setReport(objectSerializer.deserialize(fetchedReport?.report?.reportObject));

    setQuestionItems(fetchedReport?.report?.reportObject?.questionItems);
    setMetaData({
      _id: fetchedReport?.report?._id,
      departmentId: fetchedReport?.report?.departmentId,
      reportMonth: fetchedReport?.report?.reportMonth,
      submittedDate: fetchedReport?.report?.submittedDate,
      submittedBy: fetchedReport?.report?.submittedBy,
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  useEffect(() => {
    getReport();
  }, [getReport]);

  useEffect(() => {
    if (areChangesMade && !readOnly) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }

    return () => {
      window.onbeforeunload = undefined;
    };
  }, [areChangesMade, readOnly]);

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
                  user.userDetails.department.name === department)) && (
                <button className="btn btn-primary mr-3" onClick={btnHandler}>
                  {readOnly
                    ? t('departmentReportDisplayEditForm')
                    : t('departmentReportDisplayViewForm')}
                </button>
              )}
              {readOnly && (
                <button className="btn btn-outline-dark mr-3" onClick={handleExportWithComponent}>
                  {t('departmentReportDisplayGeneratePDF')}
                </button>
              )}
              {readOnly && (
                <button className="btn btn-outline-dark" onClick={toggleTable}>
                  {isUsingTable
                    ? t('departmentReportDisplayHideTable')
                    : t('departmentReportDisplayShowTable')}
                </button>
              )}

              {readOnly && !isUsingTable && (
                <button className="btn btn-outline-dark ml-3" onClick={togglePagination}>
                  {isUsingPagination
                    ? t('departmentReportDisplayHidePagination')
                    : t('departmentReportDisplayShowPagination')}
                </button>
              )}
            </div>
          </header>

          {readOnly && (
            <div className="visually-hidden">
              <PDFExport
                fileName={`${department}_${new Date(
                  metaData?.submittedDate,
                ).toLocaleDateString()}__${metaData?.submittedBy}`}
                paperSize="A4"
                ref={pdfExportComponent}
                scale={0.75}
              >
                <ReadonlyReportForm
                  applyReportChanges={applyReportChanges}
                  formHandler={() => {}}
                  isSubmitting={false}
                  isUsingPagination={false}
                  isUsingTable={true}
                  reportData={report}
                  date={submittedDate}
                  author={metaData?.submittedBy}
                  questionItems={questionItems}
                />
              </PDFExport>
            </div>
          )}

          {readOnly ? (
            <ReadonlyReportForm
              applyReportChanges={applyReportChanges}
              btnText="Edit"
              formHandler={confirmEdit}
              isSubmitting={false}
              isUsingPagination={isUsingPagination}
              isUsingTable={isUsingTable}
              reportData={report}
              date={submittedDate}
              author={metaData?.submittedBy}
              questionItems={questionItems}
            />
          ) : (
            <ReportForm
              applyReportChanges={applyReportChanges}
              btnText="Update"
              formHandler={confirmEdit}
              isSubmitting={false}
              reportData={report}
            />
          )}
        </Layout>
      )}
    </>
  );
};

export default ReportView;
