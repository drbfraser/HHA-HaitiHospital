import React from 'react';
import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import { ReportDisplay } from 'components/report/report';

interface ArrayEntryProps extends ElementStyleProps {
  key: string;
  entries: ReportProps[];
};

export const ArrayEntry = ({ key, entries }: ArrayEntryProps) => {
  return (<>
    <p>{key}{' : ['}</p>
    {entries.forEach((entry) => (<div>{'\t'}<ReportDisplay report={entry as ReportProps} /></div>))}
    <p>{']'}</p>
  </>);
};
