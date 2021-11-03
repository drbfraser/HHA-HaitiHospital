import React, {SyntheticEvent, useEffect, useState} from 'react';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import ReportSummaryRow from 'components/report_summary_row/report_summary_row';
import { TickList, TickListData, TickObserver } from 'components/report_summary_table/ticks';
import UtilityButtons from 'components/report_summary_table/display_utility_buttons';

interface ReportSummaryTableProps extends ElementStyleProps {
  reports :ReportProps[], 
};

const ReportSummaryTable = (props : ReportSummaryTableProps) => {
  
  function convertReportsToTickListData(reports: ReportProps[]): TickListData {
    let tickListDataInPairs = props.reports.map((report)=>[report._id , false])
    let tickListData = Object.fromEntries(tickListDataInPairs) as TickListData;
    return tickListData;
  }

  const [isReportTicked, setIsReportTicked] = useState<TickList>(new TickList(props.reports.length, convertReportsToTickListData(props.reports)));
  const [allTick, setAllTick] = useState<boolean>(false);

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
      isReportTicked.setTickAtIndex(tickedRow.isChecked, idxToReport)
    );

    if (isReportTicked.isAllTicked() === true)
      setAllTick(true);
    else 
      setAllTick(false);

  }

  function getClassName(): string {
    if (props.classes === undefined) 
      return "table";
    else 
      return `table ${props.classes} `
  }

  function setAllTickWhenTickListChange(tickList: TickList) {

    let tickListState = tickList.isAllTicked();
    if (tickListState !== allTick)
      setAllTick(tickListState);

  }

  const tickListObserver : TickObserver = (tickList: TickList) => {
    setAllTickWhenTickListChange(tickList);
  }

  useEffect(() => {
    isReportTicked.registerObserver(tickListObserver);

    return function unregObserver() {
      isReportTicked.unregisterObserver(tickListObserver);
    }
  }, [isReportTicked, allTick])
  
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
                {AllTick()}  
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
                tickList={isReportTicked}/>)
            )}
          </tbody>
        </table>
      </div>
      
      <UtilityButtons ticks={isReportTicked}/>

    </section>
  )

    function AllTick() {
        return <div className="form-check">
            <input className="form-check-input"
                type="checkbox"
                id='tick-all'
                checked={allTick}

                onClick={(e: SyntheticEvent) => {
                    let target: HTMLInputElement = e.target as HTMLInputElement;
                    if (target.checked === true)
                        isReportTicked.tickAll();

                    else
                        isReportTicked.untickAll();
                } }

                onChange={(e: SyntheticEvent) => {
                    let target: HTMLInputElement = e.target as HTMLInputElement;

                    if (allTick !== target.checked)
                        setAllTick(target.checked);
                } } />

            <label className="form-check-label" htmlFor="tick-all">
            </label>
        </div>;
    }
}

export default ReportSummaryTable;