import React, { useEffect, useState } from 'react';

import {ElementStyleProps} from 'constants/interfaces';
import {TickList, TickObserver} from './tick_list';

interface AllTickProps extends ElementStyleProps {
  tickList : TickList;
  notifyTable: (isChecked: boolean) => void;
}

const AllTick = (props: AllTickProps) => {
  
    const [isTicked, setTick] = useState<boolean>(false);
    
    useEffect(() => {
        function setAllTickWhenTickListChange(tickList: TickList) {

            let tickListState = tickList.isAllTicked();
            if (tickListState !== isTicked) {
              setTick(tickListState);
            }
        }

        const tickListObserver: TickObserver = function(tickList: TickList): void {
            setAllTickWhenTickListChange(tickList);
        }
        
        props.tickList.registerObserver(tickListObserver);

        return (function unregObserver() {
          props.tickList.unregisterObserver(tickListObserver);
        });
        
    }, [isTicked])

    return (
    <div className="form-check">
        <input className="form-check-input"
            type="checkbox"
            id='tick-all'
            checked={isTicked}

            onChange={(e: React.SyntheticEvent) => {
                let target: HTMLInputElement = e.target as HTMLInputElement;
                if (isTicked !== target.checked) {
                  setTick(target.checked);
                  props.notifyTable(target.checked);
                }
            } } />

        <label className="form-check-label" htmlFor="tick-all">
        </label>
    </div>
    );
}

export default AllTick;