import React, {SyntheticEvent, useEffect, useState} from 'react';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import ReportSummaryRow from 'components/report_summary_row/report_summary_row';
import { TickList, TickListData, TickObserver } from 'components/report_summary_table/tick_list';
import AllTick from 'components/report_summary_table/all_tick';
import UtilityButtons from 'components/report_summary_table/utility_buttons';

interface ReportSummaryTableProps extends ElementStyleProps {
  reports :ReportProps[], 
};

const ReportSummaryTable = (props : ReportSummaryTableProps) => {
  
  function convertReportsToTickListData(reports: ReportProps[]): TickListData {
    let tickListDataInPairs = reports.map((report)=>[report._id , false])
    let tickListData = Object.fromEntries(tickListDataInPairs) as TickListData;
    return tickListData;
  }
  const [RowsTickList, setIsReportTicked] = useState<TickList>(new TickList(props.reports.length, convertReportsToTickListData(props.reports)));

  function getIdxByReportId( rid : string) : number {
    let reportWithId: ReportProps | undefined = props.reports.find(report => report._id as string === rid);
    if (reportWithId === undefined) 
      throw new ReferenceError("Invalid Ticked ReportId");

    let idxToReport: number = props.reports.indexOf(reportWithId, 0);
    return idxToReport;
  }

  function trackRowTick(tickedRow : {reportId: string, isChecked: boolean}): void {
   
    let idxToReport: number = getIdxByReportId(tickedRow.reportId);
    if (idxToReport  < 0)
      throw new RangeError("Invalid Index To Array");

    setIsReportTicked(
      RowsTickList.setTickAtIndex(tickedRow.isChecked, idxToReport)
    );
  }

  function trackAllTick(isTicked : boolean) {
    if (isTicked === true)
      RowsTickList.tickAll();
    else
      RowsTickList.untickAll();
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
              <th scope='col'>
                {<AllTick tickList={RowsTickList}
                    notifyTable={trackAllTick}/>}  
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
                notifyTable={trackRowTick}
                tickList={RowsTickList}/>)
            )}
          </tbody>
        </table>
      </div>
      
      <UtilityButtons ticks={RowsTickList}/>

    </section>
  )
    
}

export default ReportSummaryTable;