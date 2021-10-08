import React from 'react'
import './Navbar.css';
import {NavLink} from 'react-router-dom'
import logo from '../../img/logo.png'

const Navbar = () => {
    return (
        <nav className="navbar">
            {/* <NavLink to="/" className="home-button" ><a href="" className="logo"><img className="logo" src={logo} alt="" /></a></NavLink> */}
            
            <NavLink className="home-button" to="/">
                <img src={logo}
                alt="logo"  height="100px" width="320px"/> 
            </NavLink>
            <NavLink className="toLeadersBoard" to="/" exact>
                LeadersBoard
            </NavLink>
            <NavLink className="toMessageBoard" to="/" exact>
                MessageBoard
            </NavLink>
            <NavLink className="toDepartments" to="/" exact>
                Departments
            </NavLink>
            <NavLink className="toCaseStudy" to="/" exact>
                CaseStudy
            </NavLink>

        </nav>
    )
}

export default Navbar;