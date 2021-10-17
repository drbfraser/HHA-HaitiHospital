import React from 'react';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import { SimpleEntry } from 'components/simple_report_entry/simple_report_entry';
import { ArrayEntry } from 'components/array_report_entry/array_report_entry';
import { ObjectEntry } from 'components/object_report_entry/object_report_entry';

interface ReportDisplayProps extends ElementStyleProps {
  report : ReportProps;
};

export const ReportDisplay = (props : ReportDisplayProps) => {

  function mapKeyToJsx (key: string, index: number, array: string[]) : React.ReactNode{
      let entry = props.report[key];
      let entryType = typeof(entry);

      if (entryType === 'number' || entryType === 'string' || entryType === 'boolean')
        return (<SimpleEntry key={key} value={entry as boolean | string | number}/>);
      else if (Array.isArray(entry)) {
        return (<ArrayEntry key={key} entries={entry as ReportProps[]}/>);
      }
      else {
        // see an object entry as a sub-report
        return (<ObjectEntry key={key} value={entry as ReportProps}/>);
      }
  }

  return (
    <div className={'report-display' + props.classes}>
      {
        Object.keys(props.report).map(mapKeyToJsx)
      }
    </div>
  );
}

export default ReportDisplay; 