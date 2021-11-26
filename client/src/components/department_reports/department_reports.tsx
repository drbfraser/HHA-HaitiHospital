import React, {useState, useEffect} from 'react';
import Axios from 'axios';

import { ElementStyleProps } from 'constants/interfaces';
import { JsonArray } from 'constants/interfaces';
import ReportSummaryTable from 'components/department_reports/report_summary_table/report_summary_table';

import './styles.css';

interface DepartmentReportsProps extends ElementStyleProps {
  department?: string;
  dateRange?: {from: {}, to: {}};
};


const DepartmentReports = (props: DepartmentReportsProps) => {
  let [reports, setReports] = useState<JsonArray>([]);
  let [refetch, setRefetch] = useState<boolean>(false);

  const apiSource = Axios.CancelToken.source();
  useEffect(() => {
    // To fetch data from db
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
  }, [refetch, props.dateRange]);


  const fetchReports = async () => {
    let apiForReports = '';
    
    try {
        let res;
        let dateRange = props.dateRange;
        if (props.dateRange.from === null || props.dateRange.to === null)
            dateRange = undefined;

        apiForReports = 'api/report';
        let postData = {
            departmentId: props.department,
            dateRange: dateRange,
        }

        res = await Axios.post(apiForReports, postData, {
            cancelToken: apiSource.token
        });
        if (res.status != 200)
            return [];

        return res.data;
    } catch (err) {
      if (Axios.isCancel(err)) {
        console.log(`Info: Subscription to ${apiForReports} is canceled`,err)
      }
      else 
        console.log(err);
      return [];
    }
  }

  function refetchReportsHandler() {
    // console.log("Refetch reports");
    setRefetch(!refetch);
  }

  function getClassName(className: string|undefined) {
    if (className === undefined) {
        return "department-reports";
    }
    else {
        return `department-reports ${className}`
    }
  }
  
  return (
    <div className={getClassName(props.classes)}>
      {/*<div className='container my-4'>*/}
      <div className='my-4'>
        {
          (reports === undefined || reports.length === 0) ? 
            <div className="lead">No submitted reports</div> : 
            <ReportSummaryTable 
              reports={reports}
              classes='text-dark bg-light'
              refetchReports={refetchReportsHandler}/>
        }
      </div>
    </div>
  );
}

export default DepartmentReports;
