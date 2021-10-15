import React from 'react';

import ElementStyleProps from 'components/IProps/IProps';
import 'components/TextHolder/TextHolder';

import './styles.css'

interface ITextHolder extends ElementStyleProps {
  text: string;
}

const TextHolder = (props: ITextHolder) => {

  return(
    <div className={props.classes}
      style={props.style}
    >
      {props.text}
    </div>
  )
}

export default TextHolder;