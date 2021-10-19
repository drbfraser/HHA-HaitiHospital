import React, {useState, useEffect} from 'react';
import Axios from 'axios';

import { ElementStyleProps } from 'constants/interfaces';
import { ReportProps } from 'constants/interfaces';
import TextHolder from 'components/text_holder/text_holder';
import ReportSummariesTable from 'components/report_summaries_table/report_summaries_table';


import './styles.css';
import Header from 'components/header/header';

interface DepartmentReportsProps extends ElementStyleProps {
  department: string;
};


const DepartmentReports = (props: DepartmentReportsProps) => {
  const [submittedReports, setSubbmitedReports] = useState<ReportProps[]>([]);
  const dbUrlForNICUReports = "/api/NicuPaeds/";

//   // Fetch submitted reports when page loaded
  useEffect(() => {
    const getReports = async() => {
      const reportsFromServer = await fetchReports();
      setSubbmitedReports(reportsFromServer);
    }
    getReports();
  });

  const fetchReports = async () => {
    // const res1 = await fetch(dbUrlForNICUReports);
    // const data1 = await res1.json();
    // return data1;
    try {
    const res = await Axios.get(dbUrlForNICUReports)
    return res.data;
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={'department-reports '+(props.classes || '')}>
      <Header/>
      <TextHolder text={props.department}></TextHolder>
      <div> Search Bar Here</div>
      <div className='report-board'>
        {
          (submittedReports === undefined || submittedReports.length === 0) ? 
            <div>No submitted reports</div> : 
            <ReportSummariesTable reports={submittedReports}/>
        }
      </div>
    </div>
  );
}

export default DepartmentReports;