import React from 'react';
import { Link } from 'react-router-dom';

import { ElementStyleProps} from 'constants/interfaces';

interface ReportSummaryProps extends ElementStyleProps {
  // report: ReportProps;
  reportId: string;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
  notifyTick(data:{reportId: string, isChecked: boolean}): void;
}

const ReportSummaryRow = (props: ReportSummaryProps) => {

  function notifyParentWhenTicked(event: React.SyntheticEvent): void {
    let target = event.target as HTMLInputElement;
    props.notifyTick({reportId: target.value, isChecked: target.checked});
  }

  return (
    <tr>
      <th scope='row'>
        <Link to={`/Department1NICU/detailed_report/view/${props.reportId}`}>
          { props.reportId }
        </Link>
      </th>
      <td>{ props.lastUpdatedOn }</td>
      <td>{ props.lastUpdatedBy }</td>
      <td>
        <Link to={`/Department1NICU/detailed_report/edit/${props.reportId}`}>
          <button className="btn btn-small btn-primary">Edit</button>
        </Link>
      </td>
      {/* <td><button className="btn btn-small btn-primary">Delete</button></td> */}
      <td>
        <div className="form-check">
          <input className="form-check-input" 
            type="checkbox" 
            value={props.reportId} 
            id={`tick-${props.reportId}`}
            onClick = {notifyParentWhenTicked}
          />
          <label className="form-check-label" htmlFor={`tick-${props.reportId}`}>
          </label>
        </div>
      </td>
    </tr>
  )
}

export default ReportSummaryRow;