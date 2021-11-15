import React, {SyntheticEvent, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { ElementStyleProps} from 'constants/interfaces';

interface ReportSummaryProps extends ElementStyleProps {
  reportId: string;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
  isTicked: boolean;
  notifyTable (update : {[rid : string] : boolean}): void;
}

const ReportSummaryRow = (props: ReportSummaryProps) => {

  const [isTicked, setTicked] = useState<boolean>(props.isTicked);

  useEffect(() => {
    setTicked(props.isTicked);
  }, [props.isTicked]);

  return (
    <tr id={`rp-sum-row-${props.reportId}`}>
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
      <td>
        <div className="form-check">
          <input className="form-check-input" 
            type="checkbox" 
            value={props.reportId} 
            id={`tick-${props.reportId}`}
            checked = {isTicked}

            onClick = {(e: SyntheticEvent) => {
                const target = e.target as HTMLInputElement;
                let update = {};
                update[props.reportId] = target.checked;
                props.notifyTable(update);
            }}
          />

          <label className="form-check-label" htmlFor={`tick-${props.reportId}`}>
          </label>
        </div>
      </td>
    </tr>
  )
}

export default ReportSummaryRow;