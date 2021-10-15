import React from 'react';

import ElementStyleProps from 'components/IProps/IProps';

import './styles.css';

interface IButton extends ElementStyleProps {
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