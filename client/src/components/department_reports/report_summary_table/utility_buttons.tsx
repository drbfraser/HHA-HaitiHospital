import React from 'react';

import {ElementStyleProps, ReportProps} from 'constants/interfaces';

interface UtilityButtonsProps extends ElementStyleProps {
    tickTracker : {[rid: string]: boolean},
}

function isShown(tickTracker: {[rid: string]: boolean}) : boolean{
    const values = Object.values(tickTracker);
    return values.includes(true);
}

function deleteReports(tickTracker: {[rid: string]: boolean}): void {
    console.log("Delete ", tickTracker);
    
}

const UtilityButtons = (props: UtilityButtonsProps) => {
  
  return (
    <div>
      {(isShown(props.tickTracker))?
        <div className="row justify-content-end">
            <div className="col-auto">
                <button 
                    className=""
                    onClick = {() => {
                        deleteReports(props.tickTracker);
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
        <div></div>
      }
    </div>
  );
}

export default UtilityButtons;