import Header from 'components/header/header';
import Sidebar from 'components/side_bar/side_bar';

import { useCallback, useEffect, useState, MouseEvent, useRef } from 'react';
import './report_view.css';
import { ENDPOINT_REPORTS_GET_BY_ID, ENDPOINT_REPORTS } from 'constants/endpoints';
import { TOAST_REPORT_GET } from 'constants/toastErrorMessages';
import { useHistory, useLocation } from 'react-router-dom';
import { useDepartmentData } from 'hooks';
import { ObjectSerializer, QuestionGroup, ReportMetaData } from '@hha/common';
import { ReportForm } from 'components/report/report_form';
import Api from 'actions/Api';
import { userLocale, dateOptions } from 'constants/date';
import { useTranslation } from 'react-i18next';
import { PDFExport } from '@progress/kendo-react-pdf';

const ReportView = () => {
  const history = useHistory<History>();
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType>>(null);
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

  const applyReportChanges = () => {
    setReport(objectSerializer.deserialize(objectSerializer.serialize(report)));
  };

  const handleExportWithComponent = () => {
    pdfExportComponent.current.save();
  };

  const btnHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setReadOnly((prev) => !prev);
  };

  const reportHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const serializedReport = objectSerializer.serialize(report);
    const editedReportObject = {
      id: report_id,
      serializedReport,
    };
    Api.Put(ENDPOINT_REPORTS, editedReportObject, () => {}, '', history);
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

  return (
    <>
      {!!report && (
        <div className="report-view">
          <Sidebar />
          <main>
            <Header />

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
                  <button className="btn btn-primary" onClick={btnHandler}>
                    {readOnly ? 'Edit Form' : 'View Form'}
                  </button>
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
                    formHandler={reportHandler}
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
