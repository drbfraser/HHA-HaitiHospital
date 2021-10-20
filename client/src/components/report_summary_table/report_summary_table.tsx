import React from 'react';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import ReportSummaryRow from 'components/report_summary_row/report_summary_row';

interface ReportSummaryTableProps extends ElementStyleProps {
  reports :ReportProps[], 
};

const ReportSummaryTable = (props : ReportSummaryTableProps) => {
  return (
    <table className={'report-summaries-tables '+ (props.classes || '')}>
      <thead>
        <tr>
          <th>reportId</th>
          <th>lastUpdatedOn</th>
          <th>lastUpdatedByUserId</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        { props.reports.map(
            (report, index)=> (<ReportSummaryRow key={index}
                                      reportId={report._id as string} 
                                      lastUpdatedOn={report.lastUpdatedOn as string}
                                      lastUpdatedBy={report.lastUpdatedByUserId as number}/>)
        )}
      </tbody>
    </table>
  )
}

export default ReportSummaryTable;