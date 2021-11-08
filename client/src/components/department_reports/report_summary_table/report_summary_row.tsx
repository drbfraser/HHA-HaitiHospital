import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { ElementStyleProps} from 'constants/interfaces';
import {TickList, TickObserver} from 'components/department_reports/report_summary_table/tick_list'
import temp_checklist from '../temp_checklist';

interface ReportSummaryProps extends ElementStyleProps {
  reportId: string;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
//   notifyTable(update: {[rid : string] : boolean}): void;
  tickModel: TickList;
//   isTicked: boolean;
}

const ReportSummaryRow = (props: ReportSummaryProps) => {
  
//   const [isTicked, setTick] = useState<boolean>(props.tickList.isTickedRid(props.reportId));

//   useEffect(() => {
//     // console.log("Register row");
//     const tickListObserver: TickObserver = (tickList: TickList)=> {
//         let isReportTicked = tickList.isTickedRid(props.reportId);
//         // console.log(`Row notified: ${isReportTicked}`);
//         if (isReportTicked != props.isTicked) {
//             let update = {};
//             update[props.reportId] = isReportTicked;
//             props.notifyTable(update);
//             // setTick(isReportTicked);
//         }
//     }

//     props.tickModel.registerObserver(tickListObserver);

//     return function unregObserver() {
//       props.tickModel.unregisterObserver(tickListObserver);
//     }
//   }, [])



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
            // checked = {props.isTicked}
            
            // onChange = {(e: React.SyntheticEvent) => {
            //   let target: HTMLInputElement = e.target as HTMLInputElement;

            //   let update: {[rid: string]: boolean} = {}
            //   update[target.value] = target.checked;
            //   if (target.checked !== props.isTicked) {
            //     props.notifyTable(
            //        update
            //     );
            //   }
              
            // }}
            onClick = {() => temp_checklist.push(props.reportId)}
          />
          <label className="form-check-label" htmlFor={`tick-${props.reportId}`}>
          </label>
        </div>
      </td>
    </tr>
  )
}

export default ReportSummaryRow;