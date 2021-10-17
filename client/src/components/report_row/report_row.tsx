import React from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/button/button';
import TextHolder from 'components/text-holder/text_holder';
import {ReportProps, ElementStyleProps} from 'constants/interfaces';

import {DETAILED_REPORT_ROUTE} from 'constants/routing';

interface ReportRowProps extends ElementStyleProps {
  report: ReportProps;
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