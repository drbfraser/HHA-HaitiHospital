import React from 'react';

import HHALogoSvg from "img/logo/LogoWText.svg";
import { ElementStyleProps } from "constants/interfaces";

import "./styles.css";

interface HhaLogoProps extends ElementStyleProps{
}

const HhaLogo = (props: HhaLogoProps) => {

  return (
    <img className={props.classes} src={HHALogoSvg} 
      alt='HHA Logo' 
      style={props.style}></img>
  )
}

export default HhaLogo;