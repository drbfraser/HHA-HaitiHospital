import React, { SyntheticEvent, useEffect, useState } from 'react';

import {ElementStyleProps} from 'constants/interfaces';

interface AllTickProps extends ElementStyleProps {
    tickTracker : {[rid: string] : boolean},
    notifyTable(ticked : boolean) : void,
}

function isTicked(tickTracker: {[rid: string] : boolean}) {
    const values = Object.values(tickTracker);
    console.log("AllTick: ", !values.includes(false))
    return !(values.includes(false))
}

const AllTick = (props: AllTickProps) => {

    return (
    <div className="form-check">
        <input className="form-check-input"
            type="checkbox"
            id='tick-all'
            checked={isTicked(props.tickTracker)}
            // onClick= {(e: SyntheticEvent) => {
            //     const target = e.target as HTMLInputElement;
            //     props.notifyTable(target.checked);
            // }}
            onChange = {(e: SyntheticEvent) => {
                const target = e.target as HTMLInputElement;
                props.notifyTable(target.checked);
            }}
        />

        <label className="form-check-label" htmlFor="tick-all">
        </label>
    </div>
    );
}

export default AllTick;