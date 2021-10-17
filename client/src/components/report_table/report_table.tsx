import React from 'react';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
// import {ReportSummary} from 'constants/report_summary';
import ReportRow from 'components/report_row/report_row';

interface ReportTableProps extends ElementStyleProps {
  reports :ReportProps[], 
};

const ReportTable = (props : ReportTableProps) => {
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
          (report)=> (<ReportRow report={report}/>)
      )}
    </table>
  )
}

export default ReportTable;