import Header from 'components/header/header';
import Sidebar from 'components/side_bar/side_bar';
import PopupModalConfirmation from 'components/popup_modal/PopupModalConfirmation';

import { useCallback, useEffect, useState, MouseEvent, useRef } from 'react';
import './report_view.css';
import { ENDPOINT_REPORTS_GET_BY_ID, ENDPOINT_REPORTS } from 'constants/endpoints';
import { TOAST_REPORT_GET } from 'constants/toastErrorMessages';
import { useHistory, useLocation, Prompt } from 'react-router-dom';
import { useDepartmentData } from 'hooks';
import { History } from 'history';
import { ObjectSerializer, QuestionGroup, ReportMetaData } from '@hha/common';
import { ReportForm } from 'components/report/report_form';
import Api from 'actions/Api';
import { userLocale, dateOptions } from 'constants/date';
import { useTranslation } from 'react-i18next';
import { PDFExport } from '@progress/kendo-react-pdf';
import { useAuthState } from 'contexts';
import { UNSAVED_CHANGES_MSG } from 'constants/modal_messages';
import { NavigationInfo } from 'pages/report/Report';

const ReportView = () => {
  const history: History = useHistory<History>();
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType>>(null);
  const [areChangesMade, setAreChangesMade] = useState(false);
  const [isShowingNavigationModal, setIsShowingNavigationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewEditBtn, setShowViewEditBtn] = useState(true);
  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo>(null);
  const [metaData, setMetaData] = useState<ReportMetaData>(null);
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const report_id = useLocation().pathname.split('/')[2];
  const { departmentIdKeyMap } = useDepartmentData();
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
  const { t } = useTranslation();
  const pdfExportComponent = useRef(null);
  const department = departmentIdKeyMap.get(metaData?.departmentId);
  const submittedDate = new Date(metaData?.submittedDate).toLocaleDateString(
    userLocale,
    dateOptions,
  );
  const user = useAuthState();

  const confirmEdit = (event: React.FormEvent<HTMLFormElement>) => {
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
    setShowViewEditBtn(false);
  };

  const reportHandler = () => {
    const serializedReport = objectSerializer.serialize(report);
    const editedReportObject = {
      id: report_id,
      serializedReport,
      submittedBy: user?.userDetails?.name,
    };
    Api.Put(ENDPOINT_REPORTS, editedReportObject, () => {}, '', history);
    setShowEditModal(false);
    setReadOnly((prev) => !prev);
    setShowViewEditBtn(true);
  };

  const getReport = useCallback(async () => {
    const controller = new AbortController();
    const fetchedReport: any = await Api.Get(
      ENDPOINT_REPORTS_GET_BY_ID(report_id),
      TOAST_REPORT_GET,
      history,
      controller.signal,
    );
    setReport(objectSerializer.deserialize(fetchedReport?.report?.reportObject));

    setMetaData({
      _id: fetchedReport?.report?._id,
      departmentId: fetchedReport?.report?.departmentId,
      reportMonth: fetchedReport?.report?.reportMonth,
      submittedDate: fetchedReport?.report?.submittedDate,
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
        <div className="report-view">
          <Sidebar />
          <main>
            <Header />
            <PopupModalConfirmation
              messages={[
                <>
                  Please click <strong>Confirm</strong> to proceed with Edit.
                </>,
                <>
                  If you've made a mistake, please click <strong>Cancel</strong> instead.
                </>,
              ]}
              onModalCancel={() => setShowEditModal(false)}
              onModalProceed={reportHandler}
              show={showEditModal}
              title={'Confirm Edit'}
            />
            <PopupModalConfirmation
              messages={[UNSAVED_CHANGES_MSG]}
              onModalCancel={() => {
                setIsShowingNavigationModal(false);
                setNavigationInfo(null);
              }}
              onModalProceed={() => {
                setIsShowingNavigationModal(false);
                if (!navigationInfo) {
                  setAreChangesMade(false);
                }
                // Proceed with the normal navigation
                else if (navigationInfo?.action === 'POP') {
                  history.goBack();
                } else if (navigationInfo?.action === 'PUSH') {
                  history.push(navigationInfo.location);
                } else if (navigationInfo?.action === 'REPLACE') {
                  history.replace(navigationInfo.location);
                }
              }}
              show={isShowingNavigationModal}
              title={'Discard Edit?'}
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
            <div className="mb-3 d-flex justify-content-start">
              <button className="btn btn-outline-dark" onClick={history.goBack}>
                {t('reportViewBack')}
              </button>
            </div>

            <div>
              <header>
                <h1>Department: {department}</h1>
                <h2>Date: {metaData?.submittedDate && submittedDate}</h2>
                <div>
                  {showViewEditBtn && (
                    <button className="btn btn-primary" onClick={btnHandler}>
                      {readOnly ? 'Edit Form' : 'View Form'}
                    </button>
                  )}
                  {readOnly && (
                    <button
                      className="btn btn-outline-dark ml-3"
                      onClick={handleExportWithComponent}
                    >
                      {t('departmentReportDisplayGeneratePDF')}
                    </button>
                  )}
                </div>
              </header>
              <div>
                <PDFExport
                  ref={pdfExportComponent}
                  paperSize="A4"
                  fileName={`${submittedDate}_${department}`}
                >
                  <ReportForm
                    applyReportChanges={applyReportChanges}
                    formHandler={confirmEdit}
                    isSubmitting={false}
                    reportData={report}
                    btnText="Edit"
                    readOnly={readOnly}
                  />
                </PDFExport>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default ReportView;
