import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ElementStyleProps } from 'constants/interfaces';
// import * as Routing from 'constants/routing';

interface HeaderProps extends ElementStyleProps{
}

function HeaderView() {
    const location = useLocation();
    // console.log(location.pathname);
    // return <span>{location.pathname}</span>
    return <span>{location.pathname.slice(1)}</span>
}

const Header = (props: HeaderProps) => {
    return (
        <div className={'header '+ (props.classes || '')}>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom row">

                {/*???????????????????????????????????????*/}
                <h4 className="col text-secondary">
                    <HeaderView/>
                </h4>

                {/*<div className="btn-toolbar mb-2 mb-md-0">*/}
                <div className="col-md-auto">user name</div>
                <NavLink className="btn btn-sm btn-outline-secondary col-md-2" to="/login" exact>
                    <i className="bi bi-door-open-fill me-2"/>
                    Sign Out
                </NavLink>

                {/*<div className="col col-lg-2">*/}
                {/*    <NavLink className="btn btn-sm btn-outline-secondary" to="/login" exact>*/}
                {/*        <i className="bi bi-door-open-fill me-2"/>*/}
                {/*        Sign Out*/}
                {/*    </NavLink>*/}
                {/*</div>*/}
            </div>
        </div>
        )

  // const location = useLocation();
  //
  // if (location.pathname === Routing.HOME_ROUTE)
  //   return (
  //     <div className={'header '+ (props.classes || '')}
  //         style={props.style}>
  //       <HhaLogo
  //         classes='logo grid-item'
  //         style={
  //           {'--griditem-alignself': 'center',
  //           '--griditem-justifyself': 'center',
  //           'width' : '300px',
  //           } as CustomCssProps
  //         }
  //       />
  //       <Button classes='btn grid-item goto-admin-btn'
  //         style= {
  //           {'--griditem-alignself':'center'} as CustomCssProps
  //         }
  //         value='ADMIN PANEL'
  //       />
  //       <Button classes='btn grid-item signout-btn'
  //         style = {
  //           {'--griditem-alignself':'center'} as CustomCssProps
  //         }
  //         value='SIGN OUT'/>
  //     </div>
  //   );
  // else
  //   return (
  //     <NavBar/>
  //   )
}

export default Header;