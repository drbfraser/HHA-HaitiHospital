import React, {useState, useEffect} from 'react';
import Axios from 'axios';

import { ElementStyleProps } from 'constants/interfaces';
import { ReportProps } from 'constants/interfaces';
import ReportSummaryTable from 'components/department_reports/report_summary_table/report_summary_table';
import {TickList, TickListData} from 'components/department_reports/report_summary_table/tick_list'

import './styles.css';

interface DepartmentReportsProps extends ElementStyleProps {
  department: string;
};


const DepartmentReports = (props: DepartmentReportsProps) => {
  let [reports, setReports] = useState<ReportProps[]>([]);
  let [ticks, setTicks] = useState<{[rid: string]: boolean}>({});

  let [tickModel, setModel] = useState<TickList>(new TickList(0, {}));

  function getTickModelData(reports: ReportProps[]): TickListData {
    let tickListDataInPairs = reports.map((report)=>[report._id , false])
    let tickListData = Object.fromEntries(tickListDataInPairs) as TickListData;
    return tickListData;
  }

  function updateRowTicks(update :{[rid: string]: boolean}) {
    console.log("updateRowTicks()", update);

    //   setRowTicks(rowsTickList);
    // let tickListData = tickModel.getRecords();
    // for (const rid of Object.keys(update))
    //     tickListData[rid] = update[rid];
    // setTickModel(new TickList(reports.length, tickListData));
    let newTicks = ticks;
    // console.log("Current Ticks", newTicks);
    for (let rid of Object.keys(update))
        newTicks[rid] = update[rid];

    tickModel.update(newTicks);
    console.log(newTicks);
    setTicks(newTicks);
    // ticks = newTicks;
    // console.log("New TickModel", tickModel);
  }

  const dbUrlForNICUReports = "/api/report/view";
  const apiSource = Axios.CancelToken.source();

//   useEffect(() => {
//     console.log("ticks changed ");
//     tickModel.update(ticks);
//   }, [ticks])

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
  }, []);

  useEffect(() => {
    console.log(reports);
    setTicks(getTickModelData(reports));
  },[reports])

 

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
      <div className='container my-4'>
        {
          (reports === undefined || reports.length === 0) ? 
            <div className="lead">No submitted reports</div> : 
            <ReportSummaryTable 
              reports={reports}
              tickModel = {tickModel}
              updateTickList = {updateRowTicks}
              classes='text-dark bg-light'/>
        }
      </div>
    </div>
  );
}

export default DepartmentReports;
