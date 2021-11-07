import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ElementStyleProps } from 'constants/interfaces';
// import {stringify} from "querystring";
// import * as Routing from 'constants/routing';

interface HeaderProps extends ElementStyleProps{
}

function HeaderView() {
    const location = useLocation();
    console.log(location.pathname);
    // return <h4 className="text-secondary">{location.pathname.slice(1)}</h4>

    if (location.pathname.slice(1) === 'home') {
        return <h4 className="text-secondary">Overview</h4>
    } else if (location.pathname.slice(1) === 'messageBoard') {
        return <h4 className="text-secondary">Message Board</h4>
    } else if (location.pathname.slice(1) === 'leaderBoard') {
        return <h4 className="text-secondary">Leader Board</h4>
    } else if (location.pathname.slice(1) === 'caseStudyMain') {
        return <h4 className="text-secondary">Case Study</h4>
    } else if (location.pathname.slice(1) === 'caseStudyForm') {
        return <h4 className="text-secondary">Case Study Form</h4>
    } else if (location.pathname.slice(1) === 'Department1NICU') {
        return <h4 className="text-secondary">Department of NICU</h4>
    } else if (location.pathname.slice(1) === 'Department2Maternity') {
        return <h4 className="text-secondary">Department of Maternity</h4>
    } else if (location.pathname.slice(1) === 'Department3Rehab') {
        return <h4 className="text-secondary">Department of Rehab</h4>
    } else if (location.pathname.slice(1) === 'Department4ComHealth') {
        return <h4 className="text-secondary">Department of Com&Health</h4>
    } else if (location.pathname.slice(1) === 'admin') {
        return <h4 className="text-secondary">Admin Desk</h4>
    } else {
        return <h4 className="text-secondary">{location.pathname.slice(1)}</h4>
    }
}

function GetUsername() {
    let username = localStorage.getItem('username')
    let name = (username as any).replace(/['"]+/g, '')
    return <h6> { name }</h6>
    // return <h6> Bonjour, { name }</h6>
}

const Header = (props: HeaderProps) => {
    return (
        <div className={'header '+ (props.classes || '')}>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom row">

                <div className="col">
                    <HeaderView/>
                </div>

                <div className="col-md-auto">
                    <GetUsername/>
                </div>

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