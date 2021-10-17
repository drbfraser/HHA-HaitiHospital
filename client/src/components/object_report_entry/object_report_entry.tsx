import React from 'react';
import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import { ReportDisplay } from 'components/report/report';
import TextHolder from 'components/text-holder/text_holder';
import { isPropertySignature } from 'typescript';

interface ObjectEntryProps extends ElementStyleProps {
  key: string;
  value: ReportProps;
}
;
export const ObjectEntry = (props: ObjectEntryProps) => {
  return (<div className={props.classes}>
    <TextHolder text={props.key + ': {'}/>
    <>{'\t'}<ReportDisplay report={props.value} /></>
    <TextHolder text={'}'}/>
  </div>);
};
