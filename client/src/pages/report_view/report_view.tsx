import Header from 'components/header/header';
import Sidebar from 'components/side_bar/side_bar';

import { useCallback, useEffect, useState, MouseEvent } from 'react';
import './report_view.css';
import Api from 'actions/Api';
import { ENDPOINT_REPORTS_GET_BY_ID } from 'constants/endpoints';
import { TOAST_REPORT_GET } from 'constants/toast_messages';
import { useHistory, useLocation } from 'react-router-dom';
import { useDepartmentData } from 'hooks';
import { ObjectSerializer, QuestionGroup, ReportMetaData } from '@hha/common';
import { ReportForm } from 'components/report/question_form_fields';

type ID = string;
type ErrorType = string;

const ReportView = () => {
  const history = useHistory<History>();
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType>>(null);
  const [metaData, setMetaData] = useState<ReportMetaData>(null);
  const [editForm, setEditForm] = useState<boolean>(false);
  const report_id = useLocation().pathname.split('/')[2];
  const { departmentIdKeyMap } = useDepartmentData();
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

  const applyReportChanges = () => {
    setReport(objectSerializer.deserialize(objectSerializer.serialize(report)));
  };

  const btnHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditForm((prev) => !prev);
  };

  const formHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const getReport = useCallback(async () => {
    const fetchedReport: any = await Api.Get(
      ENDPOINT_REPORTS_GET_BY_ID(report_id),
      TOAST_REPORT_GET,
      history,
    );
    console.log(fetchedReport.report);
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
      <div className="report-view">
        <Sidebar />
        <main>
          <Header />
          <>
            <header>
              <h1>Report ID: {metaData?._id}</h1>
              <h2>Department: {departmentIdKeyMap.get(metaData?.departmentId)}</h2>
              <button className="btn btn-primary" onClick={btnHandler}>
                {editForm ? 'View Form' : 'Edit Form'}
              </button>
            </header>
            <div>
              {editForm ? (
                <ReportForm
                  applyReportChanges={applyReportChanges}
                  reportData={report}
                  formHandler={formHandler}
                />
              ) : (
                <pre>{JSON.stringify(report, null, 2)}</pre>
              )}
            </div>
          </>
        </main>
      </div>
    </>
  );
};

export default ReportView;
