import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import {DB_GET_ID_REPORT_URL} from 'constants/index';
// import { Json, JsonArray } from 'constants/json';
import { ReportEntry } from 'constants/report';
import TextHolder from 'components/TextHolder/TextHolder';
// import ReportTable from 'components/ReportTable/ReportTable';
import ReportDisplay from 'components/Report/Report';

import ElementStyleProps from 'components/IProps/IProps';
import './styles.css';


interface DetailedReportProps extends ElementStyleProps {
  id : number;
};

interface UrlParams {
  id: string;
};

const DetailedReport = (props : DetailedReportProps) => {
  const { id } = useParams<UrlParams>();

  const detailedReportUrl = DB_GET_ID_REPORT_URL + id;

  const [ report, setReport] = useState<object>({});
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
    <div className='container'>
      {
        (Object.keys(report).length===0 ) ?
          <TextHolder text = 'No report found'/>:
          <ReportDisplay report = {report as {[key : string] : ReportEntry}}/>
      }  
    </div>
  )
}

export default DetailedReport;