import React, {useState, useEffect} from 'react';

import { TickObserver, Ticks } from 'components/report_summary_table/ticks';

import {ElementStyleProps} from 'constants/interfaces';

interface UtilityButtonsProps extends ElementStyleProps {
  ticks: Ticks;
}


const UtilityButtons = (props: UtilityButtonsProps) => {
  
  const [showButtons, setShowButtons] = useState<boolean>(false);
  let tickObserver: TickObserver = (tickCount: number) => {
    if (tickCount > 0)
      setShowButtons(true);
    else
      setShowButtons(false);  
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