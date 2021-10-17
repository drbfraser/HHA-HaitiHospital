import React from 'react';
import { ElementStyleProps } from 'constants/interfaces';
import TextHolder from 'components/text-holder/text_holder';

interface SimpleEntryProps extends ElementStyleProps {
  key: string;
  value: boolean | string | number;
};

export const SimpleEntry = (props: SimpleEntryProps) => {
  return (
    <div className={props.classes}>
      <TextHolder text={props.key}/>
      <TextHolder text={props.value as string}/>
    </div>
  );
};
