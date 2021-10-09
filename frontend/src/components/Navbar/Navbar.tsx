import React from 'react'
import './Navbar.css';
import {NavLink} from 'react-router-dom'
import logo from '../../img/logo/LogoWText.svg'

const Navbar = () => {
    return (
        <nav className="navbar">
            {/* <NavLink to="/" className="home-button" ><a href="" className="logo"><img className="logo" src={logo} alt="" /></a></NavLink> */}
            
            <NavLink className="navbar-home-button" to="/home">
                <img src={logo}
                alt="logo"  height="100px" width="320px"/> 
            </NavLink>

            <div className="navbar-other-button">
                <NavLink className="toLeadersBoard" to="/leadersBaord" exact>
                    LeadersBoard
                </NavLink>
                <NavLink className="toMessageBoard" to="/messgeBoard" exact>
                    MessageBoard
                </NavLink>
                <NavLink className="toDepartments" to="/DepartmentMain" exact>
                    Departments
                </NavLink>
                <NavLink className="toCaseStudy" to="/caseStudyMain" exact>
                    CaseStudy
                </NavLink>
            </div>

        </nav>
    )
}

export default Navbar;