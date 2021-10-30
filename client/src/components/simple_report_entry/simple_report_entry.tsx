import React from 'react';
import { ElementStyleProps } from 'constants/interfaces';
import TextHolder from 'components/text_holder/text_holder';
import { isGetAccessor } from 'typescript';

interface SimpleEntryProps extends ElementStyleProps {
  name: string;
  value: boolean | string | number;
  edit: boolean;
};

// Read only report
// export const SimpleEntry = (props: SimpleEntryProps) => {
  // function getClassName() {
  //   if (props.classes === undefined)
  //     return 'entry simple-entry';
  //   else
  //     return `entry simple-entry ${props.classes}`
  // }

//   return (
//     <div className={`${getClassName()} row my-2`}>
//       <TextHolder classes="col-sm" text={`${props.name}`}/> 
//       <TextHolder classes="col-sm" text={`${props.value as string}`}/>
//    </div>
//   )  
// };

// Editable report
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
        <div className='col-sm input-group-text'>{props.name}</div>    
        <input type="text" className="col-sm form-control" 
          placeholder={`${props.value as string}`}/>
      </div>
    );
  else 
    return (
      <div className={`${getClassName()} row my-2`}>
        <TextHolder classes="col-sm" text={`${props.name}`}/> 
        <TextHolder classes="col-sm" text={`${props.value as string}`}/>
      </div>
    );
  
}