import { useLocation } from 'react-router-dom';
import React from 'react';

import HhaLogo from 'components/hha_logo/hha_logo';
import Button from 'components/button/button';
import { ElementStyleProps, CustomCssProps } from 'constants/interfaces';

import './styles.css';

interface HeaderProps extends ElementStyleProps{
}

const Header = (props: HeaderProps) => {
  const location = useLocation();

  return (  
    <div className={'header '+props.classes} 
    style={props.style}>
      {location.pathname === '/home' && (
        <>
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
        </>
      )}
    </div>
  );
}

export default Header;