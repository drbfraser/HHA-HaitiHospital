import React from 'react';

import { ReportProps} from 'constants/interfaces';
import { SimpleEntry } from 'components/report_display/simple_report_entry';
import { ArrayEntry } from 'components/report_display/array_report_entry';
import { ObjectEntry } from 'components/report_display/object_report_entry';

interface ReportDisplayProps {
  report : ReportProps;
  edit: boolean;
};

export const ReportDisplay = (props : ReportDisplayProps) => {

  function mapKeyToJsx (entryKey: string, index: number, array: string[]) : React.ReactNode{
      let entryValue = props.report[entryKey];
      let valueType = typeof(entryValue);

      if (valueType === 'number' || valueType === 'string' || valueType === 'boolean')
        return (<SimpleEntry key={index as React.Key}
                  name={entryKey}
                  value={entryValue as boolean | string | number}
                  edit={props.edit}/>);
      else if (Array.isArray(entryValue)) {
        return (<ArrayEntry key={index}
                  name={entryKey} 
                  entries={entryValue as ReportProps[]}
                  edit={props.edit}/>);
      }
      else {
        // see an object entry as a sub-report
        return (<ObjectEntry key={index}
                name={entryKey} 
                value={entryValue as ReportProps}
                edit={props.edit}/>);
      }
  }

  return (
    <div className={'report-display'} id='report_display'>
      {
        Object.keys(props.report).map(mapKeyToJsx)
      }
    </div>
  );

}

export default ReportDisplay; 