import Header from 'components/header/header';
import Sidebar from 'components/side_bar/side_bar';

import { useCallback, useEffect, useState } from 'react';
import './report_view.css';
import Api from 'actions/Api';
import { ENDPOINT_REPORTS_GET_BY_ID } from 'constants/endpoints';
import { TOAST_REPORT_GET } from 'constants/toast_messages';
import { useHistory, useLocation } from 'react-router-dom';
import { useDepartmentData } from 'hooks';
import { ObjectSerializer, QuestionGroup, ReportMetaData } from '@hha/common';

type ID = string;
type ErrorType = string;

const ReportView = () => {
  const history = useHistory<History>();
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType>>(null);
  const [metaData, setMetaData] = useState<ReportMetaData>(null);
  const report_id = useLocation().pathname.split('/')[2];
  const { departmentIdKeyMap } = useDepartmentData();
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

  const getReport = useCallback(async () => {
    const fetchedReport: any = await Api.Get(
      ENDPOINT_REPORTS_GET_BY_ID(report_id),
      TOAST_REPORT_GET,
      history,
    );
    setReport(objectSerializer.deserialize(fetchedReport?.report));
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
          {!!report && (
            <>
              <header>
                <h1>Report ID: {metaData?._id}</h1>
                <h2>Department: {departmentIdKeyMap.get(metaData?.departmentId)}</h2>
              </header>
              <div>
                <pre>{JSON.stringify(report, null, 2)}</pre>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default ReportView;
