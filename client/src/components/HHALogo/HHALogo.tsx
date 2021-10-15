import React from 'react';

import HHALogoSvg from "img/logo/LogoWText.svg";
import ElementStyleProps from "components/IProps/IProps";

import "./styles.css";

interface IHHALogo extends ElementStyleProps{
}

const HHALogo = (props: IHHALogo) => {

  return (
    <img className={props.classes} src={HHALogoSvg} 
      alt='HHA Logo' 
      style={props.style}></img>
  )
}

export default HHALogo;