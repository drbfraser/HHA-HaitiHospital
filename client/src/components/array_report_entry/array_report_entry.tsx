import React from 'react';
import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import { ReportDisplay } from 'components/report/report';
import TextHolder from 'components/text-holder/text_holder';

interface ArrayEntryProps extends ElementStyleProps {
  key: string;
  entries: ReportProps[];
};

export const ArrayEntry = (props : ArrayEntryProps) => {
  return (<div className = {'entry array-entry ' + (props.classes || '')}>
    <TextHolder text={props.key + ': ['}/>
    {props.entries.forEach((entry) => (<>{'\t'}<ReportDisplay report={entry as ReportProps} /></>))}
    <TextHolder text={']'}/>
  </div>);
};
