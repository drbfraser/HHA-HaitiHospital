import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { ElementStyleProps} from 'constants/interfaces';
import {TickList, TickObserver} from 'components/report_summary_table/tick_list'

interface ReportSummaryProps extends ElementStyleProps {
  reportId: string;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
  notifyTable(data:{reportId: string, isChecked: boolean}): void;
  tickList: TickList;
}

const ReportSummaryRow = (props: ReportSummaryProps) => {
  
  const [isTicked, setTick] = useState<boolean>(false);

  useEffect(() => {
    const tickListObserver: TickObserver = (tickList: TickList)=> {
      let isReportTicked = tickList.isTickedRid(props.reportId);
      console.log(`Row notified: ${isReportTicked}`);
      if (isReportTicked != isTicked)
        setTick(isReportTicked);
    }

    props.tickList.registerObserver(tickListObserver);

    return function unregObserver() {
      props.tickList.unregisterObserver(tickListObserver);
    }
  }, [isTicked])



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
      <td>
        <div className="form-check">
          <input className="form-check-input" 
            type="checkbox" 
            value={props.reportId} 
            id={`tick-${props.reportId}`}
            checked = {isTicked}
            onChange = {(e: React.SyntheticEvent) => {
              let target: HTMLInputElement = e.target as HTMLInputElement;
              if (target.checked !== isTicked) {
                props.notifyTable({reportId: target.value, 
                    isChecked: target.checked});
                setTick(target.checked);
              }
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