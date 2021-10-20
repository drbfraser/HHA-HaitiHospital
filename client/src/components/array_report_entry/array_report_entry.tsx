import React from 'react';
import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import { ReportDisplay } from 'components/report_display/report_display';
import TextHolder from 'components/text_holder/text_holder';

interface ArrayEntryProps extends ElementStyleProps {
  name: string;
  entries: ReportProps[];
};

export const ArrayEntry = (props : ArrayEntryProps) => {
  return (<div className = {'entry array-entry ' + (props.classes || '')}>
    <TextHolder text={props.name + ': ['}/>
    {props.entries.forEach((entry) => (<>{'\t'}<ReportDisplay report={entry as ReportProps} /></>))}
    <TextHolder text={']'}/>
  </div>);
};
