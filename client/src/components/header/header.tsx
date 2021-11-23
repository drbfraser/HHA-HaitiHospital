import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link, useHistory } from 'react-router-dom';
import { ElementStyleProps } from 'constants/interfaces';
import { logOutUser } from '../../actions/authActions';
import axios from 'axios';

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
        return <h4 className="text-secondary">Leaderboard</h4>
    } else if (location.pathname.slice(1) === 'caseStudyMain') {
        return <h4 className="text-secondary">Case Study</h4>
    } else if (location.pathname.slice(1) === 'caseStudyForm') {
        return <h4 className="text-secondary">Case Study Form</h4>
    } else if (location.pathname.split('/')[1] === 'caseStudyView') {
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
        history.push("/login");
    };

    const history = useHistory();

    const [userInfo, setUserInfo] = useState({} as any);
    const userUrl = '/api/users/me';
    const getUserInfo = async () => {
        try {
            const res = await axios.get(userUrl);
            setUserInfo(res.data);
        } catch (err) {
            console.log(err);
            // history.push("/login");
        }
    }
    
    useEffect(() => {
        getUserInfo();
        console.log(userInfo);
    }, [Object.keys(userInfo).length]);

    return (
        <div className={'header '+ (props.classes || '')}>
            <div className="d-flex align-items-center pt-3 pb-2 mb-3 mx-1 border-bottom row">

                <div className="col">
                    <HeaderView/>
                </div>

                <div className="col-auto">
                    {/* <GetUsername/> */}
                    <div className="dropdown">
                        <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <span className="d-none d-sm-inline fw-bold">{userInfo.name}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end rounded shadow">
                            <li className="d-block d-sm-none">
                                <button className="dropdown-item disabled fw-bold text-muted mb-2">
                                    {userInfo.name}
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item disabled text-muted mb-2">
                                    <i className="bi bi-person-fill"></i>{' @' + userInfo.username}
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item disabled text-muted mb-2">
                                    <i className="bi bi-person-badge-fill"></i>{' ' + userInfo.role}
                                </button>
                            </li>
                            <li className={`${userInfo.department ? "d-block" : "d-none"}`}>
                                <button className="dropdown-item disabled text-muted">
                                    <i className="bi bi-people-fill"></i>{' ' + userInfo.department}
                                </button>
                            </li>
                            <li><hr className="dropdown-divider"/></li>
                            <li>
                                <button className="dropdown-item" type="button" onClick={onLogOut}>
                                    <i className="fa fa-sign-out" aria-hidden="true"></i> Log out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* <div className="col col-2 col-sm-3 col-md-3 col-lg-3">
                    <NavLink className="btn btn-sm btn-outline-secondary" to="/login" exact onClick={onLogOut}>
                        <i className="bi bi-door-open-fill me-2"/>
                        <span className="text text-dark">Sign Out</span>
                    </NavLink>
                </div> */}
            </div>
        </div>
        )
}

export default Header;