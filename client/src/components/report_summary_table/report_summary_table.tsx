import React from 'react';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import ReportSummaryRow from 'components/report_summary_row/report_summary_row';

interface ReportSummaryTableProps extends ElementStyleProps {
  reports :ReportProps[], 
};

const ReportSummaryTable = (props : ReportSummaryTableProps) => {
  
  function getClassName() {
    if (props.classes === undefined) 
      return "table";
    else 
      return `table ${props.classes} `
  }

  return (
    <div className="table-responsive-md">
      <table className={getClassName()}>
        <thead>
          <tr>
            <th scope='col'>ReportId</th>
            <th scope='col'>Last Updated On</th>
            <th scope='col'>Last Updated By UserId</th>
            <th scope='col'></th>
            <th scope='col'></th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {props.reports.map(
            (report, index)=> 
            (<ReportSummaryRow 
              key={index}
              reportId={report._id as string} 
              lastUpdatedOn={report.lastUpdatedOn as string}
              lastUpdatedBy={report.lastUpdatedByUserId as number}/>)
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ReportSummaryTable;