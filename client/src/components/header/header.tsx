import { useAuthDispatch, useAuthState } from '../../Context'
import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { ElementStyleProps, User } from 'constants/interfaces';
import { logOutUser } from '../../actions/authActions';
import axios from 'axios';
import {useTranslation} from "react-i18next";

// import {stringify} from "querystring";
// import * as Routing from 'constants/routing';

interface HeaderProps extends ElementStyleProps{
}

function HeaderView() {
    const location = useLocation();
    // return <h4 className="text-secondary">{location.pathname.slice(1)}</h4>

    const {t} = useTranslation();

    if (location.pathname.slice(1) === 'home') {
        return <h4 className="text-secondary">{t("headerOverview")}</h4>
    } else if (location.pathname.slice(1) === 'messageBoard') {
        return <h4 className="text-secondary">{t("headerMessageBoard")}</h4>
    } else if (location.pathname.slice(1) === 'leaderBoard') {
        return <h4 className="text-secondary">{t("headerLeaderBoard")}</h4>
    } else if (location.pathname.slice(1) === 'caseStudyMain') {
        return <h4 className="text-secondary">{t("headerCaseStudy")}</h4>
    } else if (location.pathname.slice(1) === 'caseStudyForm') {
        return <h4 className="text-secondary">Case Study Form</h4>
    } else if (location.pathname.split('/')[1] === 'caseStudyView') {
        return <h4 className="text-secondary">{t("headerCaseStudyForm")}</h4>
    } else if (location.pathname.slice(1) === 'Department1NICU') {
        return <h4 className="text-secondary">{t("headerDepartmentNICU")}</h4>
    } else if (location.pathname.slice(1) === 'Department2Maternity') {
        return <h4 className="text-secondary">{t("headerDepartmentMaternity")}</h4>
    } else if (location.pathname.slice(1) === 'Department3Rehab') {
        return <h4 className="text-secondary">{t("headerDepartmentRehab")}</h4>
    } else if (location.pathname.slice(1) === 'Department4ComHealth') {
        return <h4 className="text-secondary">{t("headerDepartmentCom")}</h4>
    } else if (location.pathname.slice(1) === 'admin') {
        return <h4 className="text-secondary">{t("headerAdmin")}</h4>
<<<<<<< HEAD
=======
    } else if (location.pathname.split('/')[1] === 'admin-add-user') {
        return <h4 className="text-secondary">Add User</h4>
    } else if (location.pathname.split('/')[1] === 'admin-edit-user') {
        return <h4 className="text-secondary">Edit User</h4>
>>>>>>> master
    } else {
        // return <h4 className="text-secondary">{location.pathname.slice(1)}</h4>
        return <h4></h4>
    }
}

function GetUsername() {
    let username = localStorage.getItem('username')
    let name = '';
    if (username) {
        name = (username as any).replace(/['"]+/g, '')
    } else {
        name = 'default';
    }
    return <h6> { name }</h6>
}

const Header = (props: HeaderProps) => {
    const dispatch = useAuthDispatch() // read dispatch method from context
    const userDetails = useAuthState() //read user details from context
    const onLogOut = (event) => {
<<<<<<< HEAD
        logOutUser();
=======
        logOutUser(dispatch);
>>>>>>> master
        history.push("/login");
    };

    const history = useHistory();

    const [userInfo, setUserInfo] = useState({} as User);
    const userUrl = '/api/users/me';
    const getUserInfo = async () => {
        try {
            const res = await axios.get(userUrl);
            setUserInfo(res.data);
        } catch (err) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        getUserInfo();
    }, [userInfo.username]);
    const {t, i18n} = useTranslation();

    return (
        <div className={'header '+ (props.classes || '')}>
            <div className="d-flex align-items-center pt-3 pb-2 mb-3 mx-1 border-bottom row">

                <div className="col">
                    <HeaderView/>
                </div>

                <div className="col-auto">
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
                                    <i className="fa fa-sign-out" aria-hidden="true"></i>{" " + t("headerSignOut")}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;