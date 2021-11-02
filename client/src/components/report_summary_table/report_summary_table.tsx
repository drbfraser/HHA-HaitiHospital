import React, {useEffect, useState} from 'react';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import ReportSummaryRow from 'components/report_summary_row/report_summary_row';
import { Ticks } from 'components/report_summary_table/ticks';
import UtilityButtons from 'components/report_summary_table/display_utility_buttons';

interface ReportSummaryTableProps extends ElementStyleProps {
  reports :ReportProps[], 
};

const ReportSummaryTable = (props : ReportSummaryTableProps) => {
  
  const [isReportTicked, setIsReportTicked] = useState<Ticks>(new Ticks(props.reports.length));

  function getIdxByReportId( rid : string) : number {
    let reportWithId: ReportProps | undefined = props.reports.find(report => report._id as string === rid);
    if (reportWithId === undefined) 
      throw new ReferenceError("Invalid Ticked ReportId");

    let idxToReport: number = props.reports.indexOf(reportWithId, 0);
    return idxToReport;
  }

  function trackTicks(tickedRow : {reportId: string, isChecked: boolean}): void {
   
    let idxToReport: number = getIdxByReportId(tickedRow.reportId);
    if (idxToReport  < 0)
      throw new RangeError("Invalid Index To Array");

    setIsReportTicked(
      isReportTicked.setTickAtIndex(tickedRow.isChecked, idxToReport)
    );
  }


  function getClassName(): string {
    if (props.classes === undefined) 
      return "table";
    else 
      return `table ${props.classes} `
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
              {/* <th scope='col'></th> */}
              <th scope='col'>
                <div className="form-check">
                  <input className="form-check-input" 
                    type="checkbox" 
                    id='tick-all'
                  />
                  <label className="form-check-label" htmlFor="tick-all">
                  </label>
                </div>  
              </th>
            </tr>
          </thead>

          <tbody>
            {props.reports.map(
              (report, index)=> 
              (<ReportSummaryRow 
                key={index}
                reportId={report._id as string} 
                lastUpdatedOn={report.lastUpdatedOn as string}
                lastUpdatedBy={report.lastUpdatedByUserId as number}
                notifyTick={trackTicks}/>)
            )}
          </tbody>
        </table>
      </div>
      
      <UtilityButtons ticks={isReportTicked}/>

    </section>
  )
}

export default ReportSummaryTable;