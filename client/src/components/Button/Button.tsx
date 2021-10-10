import React from 'react';

import IProps from 'components/IProps/IProps';

import 'components/Button/styles.ccs';

interface IButton extends IProps {
  value: string;  
}

const Btn = (props: IButton) => {
  
  return (
    <button className={props.classes}
      style={props.style}
    >
      {props.value}
    </button>
  )
}

export default Btn;