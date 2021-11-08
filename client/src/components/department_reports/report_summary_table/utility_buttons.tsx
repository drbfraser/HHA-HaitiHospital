import React, {useState, useEffect} from 'react';

import { TickObserver, TickList } from 'components/department_reports/report_summary_table/tick_list';

import {ElementStyleProps, ReportProps} from 'constants/interfaces';

interface UtilityButtonsProps extends ElementStyleProps {
  ticks: TickList;
  reports: ReportProps[];
  notifyTable: () => void;
}



const UtilityButtons = (props: UtilityButtonsProps) => {
  
  const [showButtons, setShowButtons] = useState<boolean>(false);

  let tickObserver: TickObserver = (tickList: TickList) => {
    console.log("Del button notified ", tickList.isNoTicked());

    if (tickList.isNoTicked() === true)
      setShowButtons(false);
    else
      setShowButtons(true);  
  };

  useEffect(() => {
    props.ticks.registerObserver(tickObserver);
    console.log("delete button registered");

    return function unregisterObserver() {
      props.ticks.unregisterObserver(tickObserver);
    }

  }, []) 

  return (
    <div>
      {/* {(showButtons === true)? */}
      {/* {(props.ticks.isNoTicked() === false) ? */}
        <div className="row justify-content-end">
            <div className="col-auto">
            <button 
            className=""
            onClick = {() => {
                props.notifyTable()
                // console.log(props.ticks);
            }}
            >
                Delete
            </button>
            </div>

            <div className="col-auto">
            <button className="">Accumulate</button>
            </div>
        </div>
        :
        <div>

        </div>
      {/* } */}
    </div>
  );
}

export default UtilityButtons;