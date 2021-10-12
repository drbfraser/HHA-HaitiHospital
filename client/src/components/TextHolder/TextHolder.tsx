import React from 'react';

import IProps from 'components/IProps/IProps';
import 'components/TextHolder/TextHolder';

import './styles.css'

interface ITextHolder extends IProps {
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