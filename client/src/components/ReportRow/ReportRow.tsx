import React from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/Button/Button';
import TextHolder from 'components/TextHolder/TextHolder';
// import {ReportSummary} from 'constants/report_summary';
import {Report} from 'constants/report';

import {DETAILED_REPORT_ROUTE} from 'constants/routing';

import ElementStyleProps from 'components/IProps/IProps';

interface ReportRowProps extends ElementStyleProps {
  report: Report;
}

const ReportRow = (props: ReportRowProps) => {

  return (
    <tr>
      <td>
        <Link to={DETAILED_REPORT_ROUTE + props.report.id}>
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