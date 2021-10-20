import React from 'react';
import { ElementStyleProps } from 'constants/interfaces';
import TextHolder from 'components/text_holder/text_holder';

interface SimpleEntryProps extends ElementStyleProps {
  name: string;
  value: boolean | string | number;
};

export const SimpleEntry = (props: SimpleEntryProps) => {
  return (
    <div className={'entry simple-entry '+ (props.classes||'')}>
      <TextHolder text={`${props.name} : ${props.value as string}`}/>
    </div>
  );
};
