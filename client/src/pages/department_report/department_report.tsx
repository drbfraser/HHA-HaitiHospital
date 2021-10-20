import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Axios from 'axios';

import { ReportProps } from 'constants/interfaces';
import TextHolder from 'components/text_holder/text_holder';
import ReportDisplay from 'components/report_display/report_display';

import { ElementStyleProps } from 'constants/interfaces';
import './styles.css';
import Header from 'components/header/header';


interface DepartmentReportProps extends ElementStyleProps {
};

interface UrlParams {
  id: string;
};

const DepartmentReport = (props : DepartmentReportProps) => {
  const { id } = useParams<UrlParams>();
  const getReportApi = `/api/report/viewreport/${id}`;
  const [ report, setReport] = useState<ReportProps>({});
  const apiSource = Axios.CancelToken.source();
  // Get Report Id when Loaded
  useEffect(() => {
    let isMounted = true;
    async function getReport() {
      const reportFromServer = await fetchReport();
      if (isMounted)
        setReport(reportFromServer);
    };
    
    getReport();

    return function cleanUp() {
      isMounted = false;
      apiSource.cancel();
    }
  });

  async function fetchReport() {
    try {
      const res = await Axios.get(getReportApi, {
        cancelToken: apiSource.token
      });
      return res.data;
    } catch (err) {
      if (Axios.isCancel(err)) {
        console.log(`Info: Cancel subsciption to ${getReportApi} API`, err);
      }
      else { console.log(err); }
    }
    return {};
  }

  return (
    <div className={'department-report '+(props.classes||'')}>
      <Header/>
      {
        (Object.keys(report).length===0 ) ?
          <TextHolder text = 'No report found'/>:
          <ReportDisplay report = {report.formData as ReportProps}/>
      }  
    </div>
  )
}

export default DepartmentReport;