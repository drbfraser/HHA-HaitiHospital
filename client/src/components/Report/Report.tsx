import React from 'react';

import ElementStyleProps from 'components/IProps/IProps';
// import {Json, JsonArray} from 'constants/json';
import {Report, ReportEntry} from 'constants/report';
// import { report } from 'process';


interface ReportProps extends ElementStyleProps {
  report : {[key : string ] : ReportEntry};
};

const ReportDisplay = (props : ReportProps) => {
//   type SimpleType = string | number | boolean | Date;
//   type ComplexType = Json | JsonArray;

  return (
    <div className='container'>
      {

        Object.keys(props.report).map(
          (key) => {
            let value = props.report[key];
            let valueType = typeof(value);
            // value is simple type
            if (valueType === 'number' || valueType === 'string' || valueType === 'boolean')
              return (<div><span>{key}</span> : <span>{value}</span></div>);
            else if (Array.isArray(value)) {
              // value is a list of objects (list of sub-reports)
              return (<>
                <div><span>{key}</span> <span>{' : {'}</span></div>
                {value.forEach((element) => (<div>{'\t'}<span><ReportDisplay report={element as Report}/></span></div>))}
                <div>{'}'}</div>
              </>);
            }
            else {
              // value is a sub-report
              return (<>
                <div><span>{key}</span><span>{' : {'}</span></div>
                <div>{'\t'}<ReportDisplay report={value as unknown as Report}/></div>
                <div>{'}'}</div>
              </>);
            }
              
          }
        )
      }
    </div>
  );
}

export default ReportDisplay; 