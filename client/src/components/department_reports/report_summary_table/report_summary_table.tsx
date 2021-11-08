import React, {SyntheticEvent, useEffect, useState} from 'react';
import Axios from 'axios';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import ReportSummaryRow from 'components/department_reports/report_summary_table/report_summary_row';
import { TickList, TickListData, TickObserver } from 'components/department_reports/report_summary_table/tick_list';
import AllTick from 'components/department_reports/report_summary_table/all_tick';
import UtilityButtons from 'components/department_reports/report_summary_table/utility_buttons';

interface ReportSummaryTableProps extends ElementStyleProps {
  reports :ReportProps[], 
  tickModel: TickList,
  updateTickList: (update : {[rid: string] : boolean}) => void, 
};

const ReportSummaryTable = (props : ReportSummaryTableProps) => {
  
  function trackRowTick(tickedRow : {[rid: string] : boolean}): void {
    props.updateTickList(tickedRow);
  }

  function trackAllTick(isTicked : boolean) {
    let updateData = {};

    if (isTicked === true)
        props.reports.forEach((report) => updateData[report._id as string] = true)
    else
        props.reports.forEach((report) => updateData[report._id as string] = false)

    props.updateTickList(updateData);
  }

  function getClassName(): string {
    if (props.classes === undefined) 
      return "table";
    else 
      return `table ${props.classes} `
  }

  function delReports() {
    props.tickModel.getTickedRids().forEach((rid) => {
        try {
            console.log('Delete rid :', rid);
            delTickedReportFromDb(rid);
        }
        catch (err) {
            console.log(err);
        }
    })

    props.tickModel.getTickedRids().forEach((rid) => {
        props.tickModel.delTickedReportByRid(rid);
    })

    //update state
    // props.updateTickList(props.rowsTickList);

  }

  async function delTickedReportFromDb(rid: string) {
    let dbApiToDelRid = `/api/report/delete/${rid}`;
    const res = await Axios.delete(dbApiToDelRid);
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
                {<AllTick tickList={props.tickModel}
                    notifyTable={trackAllTick}/>}  
              </th>
            </tr>
          </thead>

          <tbody>
            {props.reports.map(
              (report, index)=> 
              (<ReportSummaryRow 
                key={report._id as string} 
                reportId={report._id as string} 
                lastUpdatedOn={report.lastUpdatedOn as string}
                lastUpdatedBy={report.lastUpdatedByUserId as number}
                notifyTable={trackRowTick}
                tickList={props.tickModel}/>)
            )}
          </tbody>
        </table>
      </div>
      
      <UtilityButtons 
        ticks={props.tickModel} 
        reports={props.reports}
        notifyTable={delReports}
     />

    </section>
  )
    
}

export default ReportSummaryTable;