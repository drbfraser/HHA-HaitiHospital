import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';

import {DB_GET_ID_REPORT_URL} from 'constants/index';
import { Json, JsonArray } from 'constants/json';
import { Report, ReportEntry } from 'constants/report';
import TextHolder from 'components/TextHolder/TextHolder';

import IProps from 'components/IProps/IProps';
import './styles.css';
import ReportTable from 'components/ReportTable/ReportTable';

interface DetailedReportProps extends IProps {
  id: number;
};

const DetailedReport = (props : DetailedReportProps) => {
  const detailedReportUrl = DB_GET_ID_REPORT_URL + props.id;

  const [ report, setReport] = useState<Json | undefined>();
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
        (report === undefined) ?
          <TextHolder text = 'No report found'/>:
          <ReportDisplay report = {report}/>
      }  
    </div>
  )
}