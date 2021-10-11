import React from 'react';

import Button from 'components/Button/Button';
import TextHolder from 'components/TextHolder/TextHolder';
import {Report} from 'constants/index';
import IProps from 'components/IProps/IProps';

interface ReportRowProps extends IProps {
  report: Report;
}

const ReportRow = (props: ReportRowProps) => {
  return (
    <tr>
      <td>props.report.id</td>
      <td>props.report.monthYear</td>
      <td><Button value='edit'/></td>
      <td><Button value='del'/></td>
      <td><TextHolder text='tick'/></td>
    </tr>
  );
};

export default ReportRow;