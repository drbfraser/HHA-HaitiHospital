import React from 'react';

import { ElementStyleProps, ReportProps} from 'constants/interfaces';
import { SimpleEntry } from 'components/report_display/simple_report_entry';
import { ArrayEntry } from 'components/report_display/array_report_entry';
import { ObjectEntry } from 'components/report_display/object_report_entry';

interface ReportDisplayProps extends ElementStyleProps {
  report : ReportProps;
  parentKey : string;
  edit: boolean;
};

export const ReportDisplay = (props : ReportDisplayProps) => {

  function concatParent(entryKey: string){
    if(props.parentKey === ""){
      return entryKey;
    }else{
      return props.parentKey + "_" + entryKey;
    }
  }

  function mapKeyToJsx (entryKey: string, index: number, array: string[]) : React.ReactNode{
      if(entryKey === "descriptions"){
        return;
      }
      let entryValue = props.report[entryKey];
      let valueType = typeof(entryValue);

      // console.log(concatParent(entryKey));
      // if(props.report["descriptions"][concatParent(entryKey)] === undefined){
      //   console.log(concatParent(entryKey));
      // }
      let key: string = concatParent(entryKey);

      // console.log(props.report["descriptions"]["diedBefore48hr_total"]);
      console.log(props.report["descriptions"]);

      if (valueType === 'number' || valueType === 'string' || valueType === 'boolean')
        return (<SimpleEntry key={index as React.Key}
                  name={entryKey}
                  parentKey={concatParent(entryKey)}
                  value={entryValue as boolean | string | number}
                  edit={props.edit}/>);
      else if (Array.isArray(entryValue)) {
        return (<ArrayEntry key={index}
                  name={entryKey} 
                  parentKey={concatParent(entryKey)}
                  entries={entryValue as ReportProps[]}
                  edit={props.edit}/>);
      }
      else {
        // see an object entry as a sub-report
        return (<ObjectEntry key={index}
                name={entryKey} 
                parentKey={concatParent(entryKey)}
                value={entryValue as ReportProps}
                edit={props.edit}/>);
      }
  }

  return (
    <div className={'report-display ' + (props.classes || '')}
      id='report_display'
    >
      {
        Object.keys(props.report).map(mapKeyToJsx)
      }
    </div>
  );

}

export default ReportDisplay; 