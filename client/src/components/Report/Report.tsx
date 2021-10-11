import React from 'react';

import IProps from 'components/IProps/IProps';
import {Json, JsonArray} from 'constants/json';
import {Report} from 'constants/report';


interface ReportProps extends IProps {
  report : Json,
};

const ReportDisplay = (props : ReportProps) => {
//   type SimpleType = string | number | boolean | Date;
//   type ComplexType = Json | JsonArray;

  const displayReport = () => {
    for (let i in props.report) {
      const keytype: string = typeof props.report[i];
      if (keytype === "string" || keytype === "number"
        || keytype === "boolean" || keytype === "Date")
        <div><span>{i}</span><span>{" : "}</span><span>{props.report[i]}</span></div>
      else {
        
      }
    }
  }
  return (
    <div className='container'>
      {
        
      }
    </div>
  );
}

export default ReportDisplay; 