import React from 'react';
import { Link } from 'react-router-dom';
import HhaLogo from 'components/hha_logo/hha_logo';
import './side_bar.css'

// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import { SidebarData } from './side_bar_data';


function Sidebar() {
    return (
        <div className='Sidebar'>
            <div className="SidebarList">
            {/*<div className='position-fixed d-flex flex-column flex-shrink-0 p-3 bg-dark' style={{width: 220}}>*/}

                {/*<div>*/}
                <div className="text-center">
                    <HhaLogo style={{width: 160}}/>
                </div>

                {/*<Link to="/home"*/}
                {/*   className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">*/}
                {/*    <a>*/}
                {/*        <HhaLogo style={{width: 160}}/>*/}
                {/*    </a>*/}
                {/*    <span className="fs-4 text-white">HHA</span>*/}
                {/*</Link>*/}

                <ul className="nav nav-pills flex-column mb-auto">
                    <li>
                        <Link to="/home" className="nav-link link-light">
                            <i className="bi bi-house-door-fill me-2"/>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/messageBoard" className="nav-link link-light">
                            <i className="bi bi-chat-right-text-fill me-2"/>
                            Message Board
                        </Link>
                    </li>
                    <li>
                        <Link to="/leaderBoard" className="nav-link link-light">
                            <i className="bi bi-bar-chart-fill me-2"/>
                            Leader Board
                        </Link>
                    </li>
                    <li>
                        <Link to="/caseStudyMain" className="nav-link link-light">
                            <i className="bi bi-award-fill me-2"/>
                            Case Study
                        </Link>
                    </li>

                    <li className="border-top my-3"/>

                    <li className="nav-item">
                        <Link to="/Department1NICU" className="nav-link link-light">
                            <i className="bi bi-dice-1-fill me-2"/>
                            NICU
                        </Link>
                    </li>
                    <li>
                        <Link to="/Department2Maternity" className="nav-link link-light">
                            <i className="bi bi-dice-2-fill me-2"/>
                            Maternity
                        </Link>
                    </li>
                    <li>
                        <Link to="/Department3Rehab" className="nav-link link-light">
                            <i className="bi bi-dice-3-fill me-2"/>
                            Rehab
                        </Link>
                    </li>
                    <li>
                        <Link to="/Department4ComHealth" className="nav-link link-light">
                            <i className="bi bi-dice-4-fill me-2"/>
                            Com & Health
                        </Link>
                    </li>

                    <li className="border-top my-3"/>

                    <li>
                        <Link to="/admin" className="nav-link link-light">
                            <i className="bi bi-person-badge-fill me-2"/>
                            Admin
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="nav-link link-light">
                            <i className="bi bi-door-open-fill me-2"/>
                            Sign Out
                        </Link>
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