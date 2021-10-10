import React from 'react';

import HHALogoSvg from "img/logo/LogoWText.svg";
import IProps from "components/IProps/IProps";

import "components/HHALogo/styles.css";

interface IHHALogo extends IProps{
}

const HHALogo = (props: IHHALogo) => {

  return (
    <img className={props.classes} src={HHALogoSvg} 
      alt='HHA Logo' 
      style={props.style}></img>
  )
}

export default HHALogo;