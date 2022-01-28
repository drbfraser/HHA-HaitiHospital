import React from 'react';
import { Link } from 'react-router-dom';

import HHALogoSvg from 'img/logo/LogoWText.svg';
import { ElementStyleProps } from 'constants/interfaces';

import './hha_logo_styles.css';

interface HhaLogoProps extends ElementStyleProps {}

const HhaLogo = (props: HhaLogoProps) => {
  return (
    <Link to="/home">
      <img
        className={'hha-logo ' + (props.classes || '')}
        src={HHALogoSvg}
        alt="HHA Logo"
        style={props.style}
      ></img>
    </Link>
  );
};

export default HhaLogo;
