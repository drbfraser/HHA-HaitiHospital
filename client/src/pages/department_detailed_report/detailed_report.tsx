import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import {DB_GET_ID_REPORT_URL} from 'constants/routing';
import { ReportProps } from 'constants/interfaces';
import TextHolder from 'components/text-holder/text_holder';
import ReportDisplay from 'components/report/report';

import { ElementStyleProps } from 'constants/interfaces';
import './styles.css';


interface DetailedReportProps extends ElementStyleProps {
};

interface UrlParams {
  id: string;
};

const DetailedReport = (props : DetailedReportProps) => {
  const { id } = useParams<UrlParams>();

  const detailedReportUrl = DB_GET_ID_REPORT_URL + id;

  const [ report, setReport] = useState<ReportProps>({});
  useEffect(() => {
    const getReport = async() => {
      const reportFromServer = await fetchReport();
      setReport(reportFromServer);
    }

    getReport();
  });

  const fetchReport = async () => {
    const res = await fetch(detailedReportUrl);
    const report = await res.json();
    
    return report;
  }

  return (
    <div className='page-container'>
      {
        (Object.keys(report).length===0 ) ?
          <TextHolder text = 'No report found'/>:
          <ReportDisplay report = {report as ReportProps}/>
      }  
    </div>
  )
}

export default DetailedReport;