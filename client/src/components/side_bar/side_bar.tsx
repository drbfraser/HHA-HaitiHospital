import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './side_bar_data';
import { SidebarOther} from "./side_bar_other";
import './side_bar.css'

import 'bootstrap/dist/css/bootstrap.css';

function side_bar() {
    return (
        <div className='Sidebar'>
            {/*<Link to='/home' className='menu-bars'></Link>*/}

            <div className='d-flex flex-column flex-shrink-0 p-3 bg-secondary' style={{width: 220}}>
                <a href="/home"
                   className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <svg className="bi me-2" width="40" height="32">
                        <use href="#bootstrap"/>
                    </svg>
                    <span className="fs-4">HHA</span>
                </a>


                {/*<ul className='nav-menu-items'>*/}
                <ul className="nav nav-pills flex-column mb-auto">

                    {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                        <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}

                    <li className="border-top my-3"></li>

                    {SidebarOther.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}

                    {/*<ul className="nav nav-pills flex-column mb-auto">*/}
                    {/*    <li className="nav-item">*/}
                    {/*        <a href="#" className="nav-link active" aria-current="page">*/}
                    {/*            <svg className="bi me-2" width="16" height="16">*/}
                    {/*                <use href="#home"/>*/}
                    {/*            </svg>*/}
                    {/*            Home*/}
                    {/*        </a>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <a href="#" className="nav-link link-dark">*/}
                    {/*            <svg className="bi me-2" width="16" height="16">*/}
                    {/*                <use href="#speedometer2"/>*/}
                    {/*            </svg>*/}
                    {/*            Dashboard*/}
                    {/*        </a>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <a href="#" className="nav-link link-dark">*/}
                    {/*            <svg className="bi me-2" width="16" height="16">*/}
                    {/*                <use href="#table"/>*/}
                    {/*            </svg>*/}
                    {/*            Orders*/}
                    {/*        </a>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <a href="#" className="nav-link link-dark">*/}
                    {/*            <svg className="bi me-2" width="16" height="16">*/}
                    {/*                <use href="#grid"/>*/}
                    {/*            </svg>*/}
                    {/*            Products*/}
                    {/*        </a>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <a href="#" className="nav-link link-dark">*/}
                    {/*            <svg className="bi me-2" width="16" height="16">*/}
                    {/*                <use href="#people-circle"/>*/}
                    {/*            </svg>*/}
                    {/*            Customers*/}
                    {/*        </a>*/}
                    {/*    </li>*/}
                    {/*</ul>*/}

                </ul>


            </div>

        </div>



        // <div className="Sidebar">
        //     <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: 200}}>
        //         <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        //             <svg className="bi me-2" width="40" height="32">
        //                 <use href="#bootstrap"/>
        //             </svg>
        //             <span className="fs-4">HHA</span>
        //         </a>
        //
        //         <a className="border-top my-3"></a>
        //
        //         <ul className="nav nav-pills flex-column mb-auto">
        //             <li className="nav-item">
        //                 <a href="#" className="nav-link active" aria-current="page">
        //                     Home
        //                 </a>
        //             </li>
        //             <li>
        //                 <a href="#" className="nav-link text-white">
        //                     Dashboard
        //                 </a>
        //             </li>
        //             <li>
        //                 <a href="#" className="nav-link text-white">
        //                     Orders
        //                 </a>
        //             </li>
        //             <li>
        //                 <a href="#" className="nav-link text-white">
        //                     Products
        //                 </a>
        //             </li>
        //             <li>
        //                 <a href="#" className="nav-link text-white">
        //                     Customers
        //                 </a>
        //             </li>
        //         </ul>
        //
        //         <a className="border-top my-3"></a>
        //
        //         <div className="dropdown">
        //             <a href="#"
        //                className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
        //                id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
        //                 <img src="https://github.com/mdo.png" alt="" width="32" height="32"
        //                      className="rounded-circle me-2" />
        //                 <strong>mdo</strong>
        //             </a>
        //             <ul className="dropdown-menu dropdown-menu-dark text-small shadow"
        //                 aria-labelledby="dropdownUser1">
        //                 <li><a className="dropdown-item" href="#">New project...</a></li>
        //                 <li><a className="dropdown-item" href="#">Settings</a></li>
        //                 <li><a className="dropdown-item" href="#">Profile</a></li>
        //                 <li>
        //                     {/*<hr className="dropdown-divider">*/}
        //                 </li>
        //                 <li><a className="dropdown-item" href="#">Sign out</a></li>
        //             </ul>
        //         </div>
        //     </div>
        // </div>

    );
}

export default side_bar