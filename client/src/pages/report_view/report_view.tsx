import Header from 'components/header/header';
import Sidebar from 'components/side_bar/side_bar';

import { useCallback, useEffect, useState } from 'react';
import './report_view.css';
import Api from 'actions/Api';
import { ENDPOINT_REPORTS_GET_BY_ID } from 'constants/endpoints';
import { TOAST_REPORT_GET } from 'constants/toast_messages';
import { useHistory, useLocation } from 'react-router-dom';
import { useDepartmentData } from 'hooks';

const ReportView = () => {
  const history = useHistory<History>();
  const [report, setReport] = useState<any>(null);
  const report_id = useLocation().pathname.split('/')[2];
  const { departmentIdKeyMap } = useDepartmentData();

  const getReport = useCallback(async () => {
    const fetchedReport: any = await Api.Get(
      ENDPOINT_REPORTS_GET_BY_ID(report_id),
      TOAST_REPORT_GET,
      history,
    );
    setReport(fetchedReport?.report);
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
                <h1>Report ID: {report._id}</h1>
                <h2>Department: {departmentIdKeyMap.get(report.departmentId)}</h2>
              </header>
              <div>{JSON.stringify(report)}</div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default ReportView;
