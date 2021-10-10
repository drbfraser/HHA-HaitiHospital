import React from 'react'
import {NavLink} from 'react-router-dom'

import IProps from 'components/IProps/IProps';

import './styles.css';
import logo from 'img/logo/LogoWText.svg'

interface INavBar extends IProps {

};

const NavBar = (props:INavBar) => {
    return (
        <nav className="navbar">
            {/* <NavLink to="/" className="home-button" ><a href="" className="logo"><img className="logo" src={logo} alt="" /></a></NavLink> */}
            
            <NavLink className="home-button" to="/home">
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

export default NavBar;

// Commented out during Js to Ts for future reference
// import React from 'react';
// import { compose } from 'redux';
// import { connect } from 'react-redux';
// import { Link, withRouter } from 'react-router-dom';

// import { logOutUser } from '../../store/actions/authActions';
// import './styles.css';

// const Navbar = ({ auth, logOutUser, history }) => {
//   const onLogOut = (event) => {
//     event.preventDefault();
//     logOutUser(history);
//   };

//   return (
//     <nav className="navbar">
//       <h2 className="logo">MERN Boilerplate</h2>
//       <ul className="nav-links flex-1">
//         <li className="nav-item">
//           <Link to="/">Home</Link>
//         </li>
//         {auth.isAuthenticated ? (
//           <>
//             <li className="nav-item">
//               <Link to="/users">Users</Link>
//             </li>
//             <li className="nav-item">
//               <Link to={`/${auth.me.username}`}>Profile</Link>
//             </li>
//             {auth.me?.role === 'ADMIN' && (
//               <li className="nav-item">
//                 <Link to="/admin">Admin</Link>
//               </li>
//             )}
//             <li className="flex-1" />
//             <img className="avatar" src={auth.me.avatar} />
//             <li className="nav-item" onClick={onLogOut}>
//               <a href="#">Log out</a>
//             </li>
//           </>
//         ) : (
//           <>
//             <li className="flex-1" />

//             <li className="nav-item">
//               <Link to="/login">Login</Link>
//             </li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth,
// });

// export default compose(withRouter, connect(mapStateToProps, { logOutUser }))(Navbar);
