import React from 'react';

import IProps from 'components/IProps/IProps';
import {Report} from 'constants/index';
import ReportRow from 'components/ReportRow/ReportRow';

interface ReportTableProps extends IProps {
  reports : Report[], 
};

const ReportTable = (props : ReportTableProps) => {
  return (
    <table>
      <tr>
        <th>ID</th>
        <th>Month/Year</th>
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