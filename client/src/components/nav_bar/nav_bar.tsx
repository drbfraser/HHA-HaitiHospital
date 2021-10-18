import React from 'react'
import {NavLink} from 'react-router-dom'

import { ElementStyleProps } from 'constants/interfaces';

import './styles.css';
import logo from '../../img/logo/LogoWText.svg'

interface INavBar extends ElementStyleProps {

};

const NavBar = (props:INavBar) => {
  return (
    <nav className={"navbar "+ (props.classes || '')}>
      {/* <NavLink to="/" className="home-button" ><a href="" className="logo"><img className="logo" src={logo} alt="" /></a></NavLink> */}
    
      <NavLink className="navbar-home-button" to="/home">
        <img src={logo}
        alt="logo"  height="100px" width="320px"/> 
      </NavLink>
      <div className='navbar-other-button'>
        <NavLink className="toLeadersBoard" to="/leaderBoard" exact>
            LeadersBoard
        </NavLink>
        <NavLink className="toMessageBoard" to="/messageBoard" exact>
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
