
import React, {SyntheticEvent, useEffect, useState} from 'react';
import Axios from 'axios';

import { ElementStyleProps, JsonArray, Json} from 'constants/interfaces';
import ReportSummaryRow from 'components/department_reports/report_summary_table/report_summary_row';
import AllTick from 'components/department_reports/report_summary_table/all_tick';
import UtilityButtons from 'components/department_reports/report_summary_table/utility_buttons';

interface ReportSummaryTableProps extends ElementStyleProps {
  reports :Json[], 
  refetchReports(): void,
};


const ReportSummaryTable = (props : ReportSummaryTableProps) => {
  const [tickTracker, setTracker] = useState<{[rid : string] : boolean}>({})
  
  useEffect(()=>{

    let trackerTemp : {[rid: string]: boolean} = {};

    props.reports.forEach((report) => {
        trackerTemp[report["_id"] as string] = false;
    })

    setTracker(trackerTemp);

  },[props.reports])

  function getClassName() {
        if (props.classes === undefined)
            return 'report-summary-table';
        else
            return props.classes + ' report-summary-table';
  }

  function tickRow(update : {[rid: string] : boolean}) {
    // console.log("Row ticked", update)
    const rids = Object.keys(tickTracker);
    let newTracker = {...tickTracker};

    Object.keys(update).forEach((rid) => {
        if (rids.includes(rid))
            newTracker[rid] = update[rid];
        else
            console.log("Tick non-existing report row");
    })
    setTracker(newTracker);
  }

  function tickAll(update : boolean) {
    const newTracker = {...tickTracker};
    const rids = Object.keys(tickTracker);

    Object.keys(newTracker).forEach((rid) => {
        newTracker[rid] = update;
    })

    setTracker(newTracker);
  }

  function delReportsHandler() {
      console.log("Table notified for delete");
      props.refetchReports();
  }

  return (
    <section>
      <div className="table-responsive-md">
        <table className={getClassName()}>
          <thead>
            <tr>
              <th scope='col'>ReportId</th>
              <th scope='col'>Last Updated On</th>
              <th scope='col'>Last Updated By UserId</th>
              <th scope='col'></th>
              <th scope='col'>
                <AllTick tickTracker={tickTracker}
                notifyTable = {tickAll}/>
              </th>
            </tr>
          </thead>

          <tbody>
            {props.reports.map((report, index) => (
                <ReportSummaryRow
                    key={index}
                    reportId = {report["_id"] as string}
                    lastUpdatedOn = {report["lastUpdatedOn"] as string}
                    lastUpdatedBy = {report["lastUpdatedBy"] as number}
                    isTicked = {tickTracker[report["_id"] as string]}
                    notifyTable = {tickRow}
                />))
            }   

          </tbody>
        </table>
      </div>
      
      <UtilityButtons 
        tickTracker={tickTracker}
        notifyTable={delReportsHandler}
     />

    </section>
  )
    
}

export default ReportSummaryTable;