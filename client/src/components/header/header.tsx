import { useLocation } from 'react-router-dom';
import React from 'react';

import HhaLogo from 'components/hha_logo/hha_logo';
import Button from 'components/button/button';
import NavBar from 'components/nav_bar/nav_bar';
import { ElementStyleProps, CustomCssProps } from 'constants/interfaces';
import * as Routing from 'constants/routing';

import './header_styles.css';

interface HeaderProps extends ElementStyleProps{
}

const Header = (props: HeaderProps) => {
  const location = useLocation();
  
  if (location.pathname === Routing.HOME_ROUTE)
    return (  
      <div className={'header '+ (props.classes || '')} 
          style={props.style}>
        <HhaLogo
          classes='logo grid-item'
          style={
            {'--griditem-alignself': 'center',
            '--griditem-justifyself': 'center',
            'width' : '300px',
            } as CustomCssProps
          }
        />
        <Button classes='btn grid-item goto-admin-btn'
          style= {
            {'--griditem-alignself':'center'} as CustomCssProps
          }
          value='ADMIN PANEL'
        />
        <Button classes='btn grid-item signout-btn'
          style = {
            {'--griditem-alignself':'center'} as CustomCssProps
          } 
          value='SIGN OUT'/>
      </div>
    );
  else 
    return (
      <NavBar/>
    )
}

export default Header;