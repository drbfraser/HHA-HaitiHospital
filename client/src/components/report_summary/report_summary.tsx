import {useState, useEffect} from 'react';
import Axios from 'axios';

import { JsonArray, DepartmentName, getDepartmentId } from 'constants/interfaces';
import ReportSummaryTable from 'components/report_summary/report_summary_table/report_summary_table';
import { DayRange } from 'react-modern-calendar-datepicker';
import './styles.css';
import DbErrorHandler from 'actions/http_error_handler';
import { useHistory } from 'react-router-dom';

interface DepartmentReportsProps {
  department?: DepartmentName;
  dateRange?: DayRange;
}

const ReportSummary = (props: DepartmentReportsProps) => {
  let [reports, setReports] = useState<JsonArray>([]);
  let [refetch, setRefetch] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    // To fetch data from db
    const apiSource = Axios.CancelToken.source();
    let isMounted = true;

    async function fetchReports() {
        let apiForReports = '';
        
        try {
            apiForReports = buildApiRoute(props.dateRange, props.department);
            let res = await Axios.get(apiForReports, {
                cancelToken: apiSource.token
            });
            return res.data;

        } catch (err) {
            if (Axios.isCancel(err)) {
            console.log(`Info: Subscription to ${apiForReports} is canceled`,err)
            }
            else 
            DbErrorHandler(err, history);
            return [];
        }
    }
    
    async function getReports() {
      const reportsFromServer = await fetchReports();
      if (isMounted) setReports(reportsFromServer);
    };
    getReports();
    return () => {
      apiSource.cancel();
      isMounted = false;
    }
  }, [refetch, props.department, props.dateRange, history]);


  
  function refetchReportsHandler() {
    // console.log("Refetch reports");
    setRefetch(!refetch);
  };

  return (
    <div className={"deparment-reports"}>
      <div className='my-4'>
        {
          (reports === undefined || reports.length === 0) ? 
            <div className="lead">No submitted reports</div> : 
            <ReportSummaryTable 
              reports={reports}
              refetchReports={refetchReportsHandler}/>
        }
      </div>
    </div>
  );
};

export default ReportSummary;

//  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> HELPERS >>>>>>>>>>>>>>>>>>>>>>>>>

const buildApiRoute = (dateRange: DayRange, department: DepartmentName): string => {
  const prefix = '/api/report';
  const fromParam = 'from';
  const toParam = 'to';
  const departmentParam = 'departmentId';

  let returnApi = prefix;

  let params = {};
  if (isDateRangeValid(dateRange) === true) {
    const fromValue = formatDateToStr(dateRange.from);
    const toValue = formatDateToStr(dateRange.to);

    params[fromParam] = fromValue;
    params[toParam] = toValue;
  }

  if (department !== undefined) {
    const deptId = getDepartmentId(department);
    params[departmentParam] = deptId;
  }

  returnApi = concatParamsToRoute(prefix, params);
  return returnApi;
};

const isDateRangeValid = (dateRange: DayRange): boolean => {
  return dateRange !== undefined && dateRange.from !== null && dateRange.to !== null;
};

const formatDateToStr = (date: { year: Number; month: Number; day: Number }): String => {
  return `${date.year}-${date.month}-${date.day}`;
};

const concatParamsToRoute = (prefix: string, params: { [paramName: string]: string }): string => {
  let returnRoute = prefix;
  let nParams = Object.keys(params).length;

  if (nParams > 0) {
    returnRoute += '?';
  }

  Object.keys(params).forEach((paramName, idx) => {
    returnRoute += `${paramName}=${params[paramName]}`;

    if (idx < nParams - 1) returnRoute += '&';
  });
  return returnRoute;
};

//  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HELPERS <<<<<<<<<<<<<<<<<<<<<<<<<<
