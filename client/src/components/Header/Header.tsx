import { useLocation } from 'react-router-dom';
import React from 'react';

import HHALogo from 'components/HHALogo/HHALogo';
import Button from 'components/Button/Button';
import IProps from 'components/IProps/IProps';
import ICustomCSS from 'components/ICustomCSS/ICustomCSS';

import 'components/styless.css';

interface IHeader extends IProps{
}

const Header = (props: IHeader) => {
  const location = useLocation();

  return (  
    <div className={props.classes} 
    style={props.style}>
      {location.pathname === '/home' && (
        <>
          <HHALogo 
            classes='logo grid-item' 
            style={
              {'--griditem-alignself': 'center',
              '--griditem-justifyself': 'center',
              'width' : '40%',
              } as ICustomCSS
            }
          />
          <Button classes='btn grid-item goto-admin-btn'
            style= {
              {'--griditem-alignself':'center'} as ICustomCSS
            }
            value='ADMIN PANEL'
          />
          <Button classes='btn grid-item signout-btn'
            style = {
              {'--griditem-alignself':'center'} as ICustomCSS
            } 
            value='SIGN OUT'/>
        </>
      )}
    </div>
  );
}

export default Header;