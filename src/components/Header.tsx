import { useLocation } from 'react-router-dom'

import HHALogo from './HHALogo'
import Btn from './Btn'
import {IProps, getClassesFromProps} 
  from './IProps';

interface IHeader extends IProps{
}

const Header = (props: IHeader) => {
  const location = useLocation();
  const classes = getClassesFromProps(props);

  return (  
    <div className={classes}>
      {location.pathname === '/home' && (
        <>
          <HHALogo width='30%'/>
          <Btn classes='btn' value='ADMIN PANEL'/>
          <Btn classes='btn' value='SIGN OUT'/>
        </>
      )}
    </div>
  );
}

export default Header;