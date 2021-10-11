import React from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/Button/Button';
import TextHolder from 'components/TextHolder/TextHolder';
import {ReportSummary} from 'constants/report_summary';
import IProps from 'components/IProps/IProps';

interface ReportRowProps extends IProps {
  report: ReportSummary;
}

const ReportRow = (props: ReportRowProps) => {
  return (
    <tr>
      <td>
        <Link to={'./detailedreport/${props.report.id}'}>
          {props.report.lastUpdatedOn}
        </Link>
      </td>
      <td>{props.report.lastUpdatedByUserId}</td>
      <td><Button value='edit'/></td>
      <td><Button value='del'/></td>
      <td><TextHolder text='tick'/></td>
    </tr>
  );
};

export default ReportRow;