import React, {useState, useEffect} from 'react';
import Axios from 'axios';

import { ElementStyleProps } from 'constants/interfaces';
import { ReportProps } from 'constants/interfaces';
import TextHolder from 'components/text_holder/text_holder';
import ReportSummaryTable from 'components/report_summary_table/report_summary_table';


import './styles.css';
import Header from 'components/header/header';

interface DepartmentReportsProps extends ElementStyleProps {
  department: string;
};


const DepartmentReports = (props: DepartmentReportsProps) => {
  const [reports, setReports] = useState<ReportProps[]>([]);
  const dbUrlForNICUReports = "/api/report/view";

  // Fetch submitted reports when page loaded once

  const apiSource = Axios.CancelToken.source();
  useEffect(() => {
    let isMounted = true;
    const getReports = async() => {
      const reportsFromServer = await fetchReports();
      if (isMounted)
        setReports(reportsFromServer);
    }
    getReports();
    return function cleanup() {
      apiSource.cancel();
      isMounted = false;
    }
  });

  const fetchReports = async () => {
    try {
      const res = await Axios.get(dbUrlForNICUReports,
        {cancelToken: apiSource.token})
      return res.data;
    } catch (err) {
      if (Axios.isCancel(err)) {
        console.log(`Info: Subscription to ${dbUrlForNICUReports} is canceled`,err)
      }
      else 
        console.log(err);
      return [];
    }
  }

  return (
    <div className={'department-reports '+(props.classes || '')}>
      <Header/>
      <TextHolder text={props.department}></TextHolder>
      <div> Search Bar Here</div>
      <div className='container my-4'>
        {
          (reports === undefined || reports.length === 0) ? 
            <div>No submitted reports</div> : 
            <ReportSummaryTable 
              reports={reports}
              classes='text-dark bg-light'/>
        }
      </div>
    </div>
  );
}

export default DepartmentReports;