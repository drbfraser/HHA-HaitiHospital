import React from 'react';
import { ElementStyleProps } from 'constants/interfaces';

interface SimpleEntryProps extends ElementStyleProps {
  name: string;
  value: boolean | string | number;
  edit: boolean;
};

export const SimpleEntry = (props: SimpleEntryProps) => {

  function getClassName() {
    if (props.classes === undefined)
      return 'entry simple-entry';
    else
      return `entry simple-entry ${props.classes}`
  }

  if (props.edit == true)
    return (
      <div className={`${getClassName()} row my-2 input-group`}>
        <div className='col-sm input-group-text'><strong>{props.name}</strong></div>    
        <input type="text" className="col-sm form-control" 
          placeholder={`${props.value as string}`}/>
      </div>
    );
  else 
    return (
      <div className={`${getClassName()} row my-2 text-dark`}>
        <div className="col-sm strong"> {`${props.name}`}</div> 
        <div className="col-sm"> {`${props.value as string}`}</div>
      </div>
    );
  
}