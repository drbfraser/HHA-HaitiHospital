import Header from 'components/header/header';
import Sidebar from 'components/side_bar/side_bar';

import { useCallback, useEffect, useState } from 'react';
import './report_view.css';
import Api from 'actions/Api';
import { ENDPOINT_REPORTS_GET_BY_ID } from 'constants/endpoints';
import { TOAST_REPORT_GET } from 'constants/toast_messages';
import { JsonReportDescriptor } from '@hha/common';
import { useHistory, useLocation } from 'react-router-dom';
const ReportView = () => {
  const history = useHistory<History>();
  const [report, setReport] = useState<JsonReportDescriptor>(null);
  const report_id = useLocation().pathname.split('/')[2];

  const getReport = useCallback(async () => {
    const fetchedReport: JsonReportDescriptor = await Api.Get(
      ENDPOINT_REPORTS_GET_BY_ID(report_id),
      TOAST_REPORT_GET,
      history,
    );
    setReport(fetchedReport);
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

          {/* this is just a skeleton, showing the raw json at the moment, as suggested by Dr. Fraser */}
          <div>{JSON.stringify(report)}</div>
        </main>
      </div>
    </>
  );
};

export default ReportView;
