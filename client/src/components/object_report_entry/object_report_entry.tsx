import React from 'react';
import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import { ReportDisplay } from 'components/report/report';

interface ObjectEntryProps extends ElementStyleProps {
  key: string;
  value: ReportProps;
}
;
export const ObjectEntry = ({ key, value }: ObjectEntryProps) => {
  return (<>
    <p>{key}{' : {'}</p>
    <div>{'\t'}<ReportDisplay report={value} /></div>
    <p>{'}'}</p>
  </>);
};
