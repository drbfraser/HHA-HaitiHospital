import React from 'react';

import { ElementStyleProps } from 'constants/interfaces';

interface ButtonProps extends ElementStyleProps {
  value: string;
}

const Button = (props: ButtonProps) => {
  return (
    <button className={'button ' + (props.classes || '')} style={props.style}>
      {props.value}
    </button>
  );
};

export default Button;
