import Header from 'components/header/header';
import Sidebar from 'components/side_bar/side_bar';

import { useCallback, useEffect, useState, MouseEvent } from 'react';
import './report_view.css';
import { ENDPOINT_REPORTS_GET_BY_ID, ENDPOINT_REPORTS } from 'constants/endpoints';
import { TOAST_REPORT_GET } from 'constants/toastErrorMessages';
import { useHistory, useLocation } from 'react-router-dom';
import { useDepartmentData } from 'hooks';
import { ObjectSerializer, QuestionGroup, ReportMetaData } from '@hha/common';
import { ReportForm } from 'components/report/report_form';
import Api from 'actions/Api';

const ReportView = () => {
  const history = useHistory<History>();
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType>>(null);
  const [metaData, setMetaData] = useState<ReportMetaData>(null);
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const report_id = useLocation().pathname.split('/')[2];
  const { departmentIdKeyMap } = useDepartmentData();
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

  const applyReportChanges = () => {
    setReport(objectSerializer.deserialize(objectSerializer.serialize(report)));
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
    const fetchedReport: any = await Api.Get(
      ENDPOINT_REPORTS_GET_BY_ID(report_id),
      TOAST_REPORT_GET,
      history,
    );
    setReport(objectSerializer.deserialize(fetchedReport?.report?.reportObject));

    setMetaData({
      _id: fetchedReport?.report?._id,
      departmentId: fetchedReport?.report?.departmentId,
      reportMonth: fetchedReport?.report?.reportMonth,
    });
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
            <>
              <header>
                <h1>Report ID: {metaData?._id}</h1>
                <h2>Department: {departmentIdKeyMap.get(metaData?.departmentId)}</h2>
                <button className="btn btn-primary" onClick={btnHandler}>
                  {readOnly ? 'Edit Form' : 'View Form'}
                </button>
              </header>
              <div>
                <ReportForm
                  applyReportChanges={applyReportChanges}
                  reportData={report}
                  formHandler={reportHandler}
                  readOnly={readOnly}
                />
              </div>
            </>
          </main>
        </div>
      )}
    </>
  );
};

export default ReportView;
