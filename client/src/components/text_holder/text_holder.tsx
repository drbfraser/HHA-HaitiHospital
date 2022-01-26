import React from 'react';
import { ElementStyleProps } from 'constants/interfaces';
import 'components/text_holder/text_holder';

interface TextHolderProps extends ElementStyleProps {
  text: string;
}

const TextHolder = (props: TextHolderProps) => {
  return (
    <div className={'text-holder ' + (props.classes || '')} style={props.style}>
      {props.text}
    </div>
  );
};

export default TextHolder;
