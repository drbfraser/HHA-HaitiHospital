import React from 'react';

import IProps from 'components/IProps/IProps';
// import {ReportSummary} from 'constants/report_summary';
import ReportRow from 'components/ReportRow/ReportRow';
import {Report} from 'constants/report';

interface ReportTableProps extends IProps {
  reports :Report[], 
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