import React from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/Button/Button';
import TextHolder from 'components/TextHolder/TextHolder';
// import {ReportSummary} from 'constants/report_summary';
import {Report} from 'constants/report';

import {PATH_TO_DETAILED_REPORT} from 'constants/routing';

import IProps from 'components/IProps/IProps';

interface ReportRowProps extends IProps {
  report: Report;
}

const ReportRow = (props: ReportRowProps) => {

  return (
    <tr>
      <td>
        <Link to={PATH_TO_DETAILED_REPORT + props.report.id}>
          {props.report.id}
        </Link>
      </td>
      <td> { props.report.lastUpdatedOn } </td>
      <td>{props.report.lastUpdatedByUserId}</td>
      <td><Button value='edit'/></td>
      <td><Button value='del'/></td>
      <td><TextHolder text='tick'/></td>
    </tr>
  );
};

export default ReportRow;