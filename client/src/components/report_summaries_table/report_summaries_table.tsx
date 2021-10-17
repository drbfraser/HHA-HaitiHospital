import React from 'react';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import ReportSummaryRow from 'components/report_summary_row/report_summary_row';

interface ReportSummariesProps extends ElementStyleProps {
  reports :ReportProps[], 
};

const ReportSummariesTable = (props : ReportSummariesProps) => {
  return (
    <table className={'report-summaries-tables '+ (props.classes || '')}>
      <tr>
        <th>reportId</th>
        <th>lastUpdatedOn</th>
        <th>lastUpdatedByUserId</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      { props.reports.map(
          (report)=> (<ReportSummaryRow reportId={report.reportId as number} 
                                    lastUpdatedOn={report.lastUpdatedOn as string}
                                    lastUpdatedBy={report.lastUpdatedBy as number}/>)
      )}
    </table>
  )
}

export default ReportSummariesTable;