import React from 'react';
import { NavLink } from 'react-router-dom';
import HhaLogo from 'components/hha_logo/hha_logo';
import { ElementStyleProps } from "../../constants/interfaces";
import './side_bar.css';

import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import Button from "../button/button";

// import { SidebarData } from './side_bar_data';

// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

interface SidebarProps extends ElementStyleProps {}

export const changeLanguage = (ln) => {
    return ()=> {
        console.log(`Language changed to ${ln}`);
        i18n.changeLanguage(ln)
    }
}


const Sidebar = (props: SidebarProps) => {
    // const location = useLocation();
    // const { pathname } = location;
    // const splitLocation = pathname.split("/");
    function getClassName() {
        if (props.classes === undefined) 
            return "Sidebar";
        else 
            return `Sidebar ${props.classes} `
    }

    const {t, i18n} = useTranslation();

    return (
        <div className={getClassName()}>
            <div className="bg-dark">
            {/*<div className='position-fixed d-flex flex-column flex-shrink-0 p-3 bg-dark' style={{width: 220}}>*/}
                <div className="sidebar_logo">
                    <div className="text-center" style={{width: 190}}>
                        <HhaLogo style={{width: 150}}/>
                    </div>
                </div>


                {/*<Link to="/home"*/}
                {/*   className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">*/}
                {/*    <a>*/}
                {/*        <HhaLogo style={{width: 160}}/>*/}
                {/*    </a>*/}
                {/*    <span className="fs-4 text-white">HHA</span>*/}
                {/*</Link>*/}

                <ul className="nav nav-pills flex-column mb-auto p-2">
                    <li>
                        <NavLink to="/home" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-house-door-fill me-2"/>
                            <span className="text text-light">{t("sidebarHome")}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/messageBoard" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-chat-right-text-fill me-2"/>
                            <span className="text text-light">{t("sidebarMessageBoard")}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/leaderBoard" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-bar-chart-fill me-2"/>
                            <span className="text text-light">{t("sidebarLeaderBoard")}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/caseStudyMain" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-award-fill me-2"/>
                            <span className="text text-light">{t("sidebarCaseStudy")}</span>
                        </NavLink>
                    </li>

                    <li className="border-top my-2"/>

                    <li className="nav-item">
                        <NavLink to='/general_reports' className='nav-link link-light' exact activeClassName="active">
                            <i className="bi bi-brightness-high-fill me-2"/>
                            <span className='text text-light'>General</span>
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink to="/Department1NICU" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-brightness-high-fill me-2"/>
                            <span className="text text-light">NICU / PAED</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/Department2Maternity" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-heart-fill me-2"/>
                            <span className="text text-light">Maternity</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/Department3Rehab" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-bootstrap-reboot me-2"/>
                            <span className="text text-light">Rehab</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/Department4ComHealth" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-headset me-2"/>
                            <span className="text text-light">Com & Health</span>
                        </NavLink>
                    </li>

                    <li className="border-top my-2"/>

                    <li>
                        <NavLink to="/admin" className="nav-link link-light" exact activeClassName="active">
                            <i className="bi bi-person-badge-fill me-2"/>
                            <span className="text text-light">{t("sidebarAdmin")}</span>
                        </NavLink>
                    </li>

                    <li className="border-top my-2"/>

                    <li className="btn-group-toggle" data-toggle="buttons">
                        <button className="nav-link link-light"
                        onClick={changeLanguage("en")}>
                            <i className="bi bi-gear-fill me-2"/>
                            <span className="text text-light">{t("sidebarEnglish")}</span>
                        </button>
                    </li>
                    <li>
                        <button className="nav-link link-light" id="fc"
                                onClick={changeLanguage("fr")}>
                            <i className="bi bi-gear me-2"/>
                            <span className="text text-light">{t("sidebarFrench")}</span>
                        </button>
                    </li>

                </ul>

                {/*<ul className='nav-menu-items'>*/}
                {/*<ul className="nav nav-pills flex-column mb-auto">*/}

                {/*{SidebarData.map((item, index) => {*/}
                {/*    return (*/}
                {/*        <li key={index} className={item.cName}>*/}
                {/*            <Link to={item.path}>*/}
                {/*                {item.icon}*/}
                {/*                    <span>{item.title}</span>*/}
                {/*            </Link>*/}
                {/*        </li>*/}
                {/*    )*/}
                {/*})}*/}

                {/*{SidebarOther.map((item, index) => {*/}
                {/*    return (*/}
                {/*        <li key={index} className={item.cName}>*/}
                {/*            <Link to={item.path}>*/}
                {/*                {item.icon}*/}
                {/*                <span>{item.title}</span>*/}
                {/*            </Link>*/}
                {/*        </li>*/}
                {/*    )*/}
                {/*})}*/}

            </div>
        </div>

    );
}

export default Sidebar