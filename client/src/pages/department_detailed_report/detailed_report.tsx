import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Axios from 'axios';

import {DB_GET_ID_REPORT_URL} from 'constants/routing';
import { ReportProps } from 'constants/interfaces';
import TextHolder from 'components/text-holder/text_holder';
import ReportDisplay from 'components/report/report';

import { ElementStyleProps } from 'constants/interfaces';
import './styles.css';
import Header from 'components/header/header';


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
    try {
      const res = await Axios.get(detailedReportUrl)
      return res.data;
      }
      catch (err) {
        console.log(err);
      }
  }

  return (
    <div className={'detailed-report '+(props.classes||'')}>
      <Header/>
      {
        (Object.keys(report).length===0 ) ?
          <TextHolder text = 'No report found'/>:
          <ReportDisplay report = {report as ReportProps}/>
      }  
    </div>
  )
}

export default DetailedReport;