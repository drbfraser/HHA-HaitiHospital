import React, {useState, useEffect} from 'react';

import { TickObserver, TickList } from 'components/report_summary_table/ticks';

import {ElementStyleProps} from 'constants/interfaces';

interface UtilityButtonsProps extends ElementStyleProps {
  ticks: TickList;
}


const UtilityButtons = (props: UtilityButtonsProps) => {
  
  const [showButtons, setShowButtons] = useState<boolean>(false);
  let tickObserver: TickObserver = (tickList: TickList) => {
    if (tickList.isNoTicked() === true)
      setShowButtons(false);
    else
      setShowButtons(true);  
  };

  useEffect(() => {
    props.ticks.registerObserver(tickObserver);

    return function unregisterObserver() {
      props.ticks.unregisterObserver(tickObserver);
    }

  }, []) 

  return (
    <section>
      {(showButtons === true)?
        <div className="row justify-content-end">
            <div className="col-auto">
            <button className="">Delete</button>
            </div>

            <div className="col-auto">
            <button className="">Accumulate</button>
            </div>
        </div>
        :
        <div>

        </div>
      }

    </section>
  );
}

export default UtilityButtons;