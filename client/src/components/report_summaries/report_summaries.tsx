import React from 'react';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import ReportSummary from 'components/report_summary/report_summary';

interface ReportSummariesProps extends ElementStyleProps {
  reports :ReportProps[], 
};

const ReportSummaries = (props : ReportSummariesProps) => {
  return (
    <table>
      <tr>
        <th>reportId</th>
        <th>lastUpdatedOn</th>
        <th>lastUpdatedByUserId</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      { props.reports.map(
          (report)=> (<ReportSummary reportId={report.reportId as number} 
                                    lastUpdatedOn={report.lastUpdatedOn as string}
                                    lastUpdatedBy={report.lastUpdatedBy as number}/>)
      )}
    </table>
  )
}

export default ReportSummaries;