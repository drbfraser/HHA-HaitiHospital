import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ElementStyleProps } from 'constants/interfaces';
import { logOutUser } from '../../actions/authActions'

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
}

const Header = (props: HeaderProps) => {
    const onLogOut = (event) => {
        logOutUser();
    };
    return (
        <div className={'header '+ (props.classes || '')}>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom row">

                <div className="col">
                    <HeaderView/>
                </div>

                <div className="col-md-auto">
                    <GetUsername/>
                </div>

                <NavLink className="btn btn-sm btn-outline-secondary col-md-2" to="/login" exact onClick={onLogOut}>
                    <i className="bi bi-door-open-fill me-2"/>
                    Sign Out
                </NavLink>

            </div>
        </div>
        )
}

export default Header;