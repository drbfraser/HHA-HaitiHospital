import React, {useState, useEffect} from 'react';
import Axios from 'axios';

import { ElementStyleProps } from 'constants/interfaces';
import { JsonArray, DepartmentName, getDepartmentId } from 'constants/interfaces';
import ReportSummaryTable from 'components/department_reports/report_summary_table/report_summary_table';

import {DayRange} from 'react-modern-calendar-datepicker';
import './styles.css';

interface DepartmentReportsProps extends ElementStyleProps {
  department?: DepartmentName;
  dateRange?: DayRange;
};

const DepartmentReports = (props: DepartmentReportsProps) => {
  let [reports, setReports] = useState<JsonArray>([]);
  let [refetch, setRefetch] = useState<boolean>(false);

  const dbUrlForNICUReports = "/api/report/viewdepartment/1";
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
        apiForReports = buildApiRoute(props.dateRange, props.department);
       
        let res = await Axios.get(apiForReports, {
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

  return (
    <div className={"deparment-reports"}>
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

//  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>

function buildApiRoute(dateRange: DayRange, department: DepartmentName): string {
    const prefix = 'api/report';
    const fromParam = 'from';
    const toParam = 'to';
    const departmentParam = 'departmentId';

    let returnApi = prefix;

    let params = {};
    if (isDateRangeValid(dateRange) === true) {
        const fromValue= formatDateToStr(dateRange.from);
        const toValue= formatDateToStr(dateRange.to);

        params[fromParam] = fromValue;
        params[toParam] = toValue;
    }

    if (department !== undefined) {
        const deptId = getDepartmentId(department);
        params[departmentParam] = deptId;
    }

    returnApi = concatParamsToRoute(prefix, params);

    console.log("api : ", returnApi);
    return returnApi;
}

function isDateRangeValid(dateRange: DayRange): boolean {
    return (dateRange !== undefined && dateRange.from !== null && dateRange.to !== null);
}

function formatDateToStr(date: {year: Number, month: Number, day: Number}) : String {
    return `${date.year}-${date.month}-${date.day}`;
}

function concatParamsToRoute(prefix: string, params: {[paramName : string]: string}) : string {
    let returnRoute = prefix;
    let nParams = Object.keys(params).length;

    if (nParams > 0) {
        returnRoute += '?'
    }

    Object.keys(params).forEach((paramName, idx) => {
        returnRoute += `${paramName}=${params[paramName]}`;
        
        if (idx < nParams - 1)
            returnRoute += '&';
    })
    return returnRoute;
}

//  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<
