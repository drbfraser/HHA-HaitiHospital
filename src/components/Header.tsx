import { useLocation } from 'react-router-dom';

import HHALogo from './HHALogo';
import Btn from './Btn';
import {IProps} from './IProps';
import { MyCustomCSS } from './MyCustomCSS';

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
              } as MyCustomCSS
            }
          />
          <Btn classes='btn grid-item goto-admin-btn'
            style= {
              {'--griditem-alignself':'center'} as MyCustomCSS
            }
            value='ADMIN PANEL'
          />
          <Btn classes='btn grid-item signout-btn'
            style = {
              {'--griditem-alignself':'center'} as MyCustomCSS
            } 
            value='SIGN OUT'/>
        </>
      )}
    </div>
  );
}

export default Header;