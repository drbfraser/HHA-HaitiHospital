import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import './app.css';

import login from 'pages/login/login'
import Home from 'pages/home/home'
import Admin from 'pages/admin/admin'
import { DepartmentOne } from "pages/department/department_1_nicu";
import { DepartmentTwo } from "pages/department/department_2_maternity";
import { DepartmentThree} from "pages/department/department_3_rehab";
import { DepartmentFour} from "pages/department/department_4_comhealth";
import { CaseStudyMain} from "pages/case_study_main/case_study_main";
import { DepartmentMain} from "pages/department/department_main";
import { LeaderBoardMain } from "pages/leader_board_main/leader_board_main"
import { MessageBoardMain } from "pages/message_board_main/message_board_main";
import DepartmentReports from 'pages/department_reports/department_reports';
import DepartmentReport from 'pages/department_report/department_report';
import NICUForm from 'pages/form/nicu_form';

// import Post from "./components/Post/Post";


const App = () => {
  return (
    <Router>
      <div className="app">
        <Route path='/login' exact component={login}/>
        <Route path='/home' exact component={Home}/>
        <Route path='/admin' exact component={Admin}/>
        <Route path="/Department1NICU" exact component={DepartmentOne} />
        <Route path="/Department2Maternity" exact component={DepartmentTwo} />
        <Route path="/Department3Rehab" exact component={DepartmentThree} />
        <Route path="/Department4ComHealth" exact component={DepartmentFour} />
        <Route path="/departmentMain" exact component={DepartmentMain} />
        <Route path='/caseStudyMain' exact component={CaseStudyMain} />
        <Route path="/leaderBoard" exact component={LeaderBoardMain} />
        <Route path="/messageBoard" exact component={MessageBoardMain} />
        <Route path='/Department1NICU/summary_reports' exact component = {DepartmentReports} />
        <Route path='/Department1NICU/detailed_reports/:id' exact component = {DepartmentReport} />
        <Route path="/NICUForm" component={NICUForm} />
   
        {/*<Route path="/posts/:id" exact component={Post} />*/}
        {/*<Route path="/" render={() => <div>404</div>} />*/}
      </div>
    </Router>
  );
}

export default App;

// Commented out during JS to TS for future reference
// import React, { useEffect } from 'react';
// import { Route, Switch } from 'react-router-dom';
// import { compose } from 'redux';
// import { connect } from 'react-redux';
// import Cookies from 'js-cookie';

// import Login from './pages/Login/Login';
// import Register from './pages/Register/Register';
// import Home from './pages/Home/Home';
// import Profile from './pages/Profile/Profile';
// import Users from './pages/Users/Users';
// import Admin from './pages/Admin/Admin';
// import NotFound from './pages/NotFound/NotFound';

// import Loader from './components/Loader/Loader';

// import { logInUserWithOauth, loadMe } from './store/actions/authActions';

// Commented out during converting JS to TS
// const App = ({ logInUserWithOauth, auth, loadMe }: Props) => {
//   useEffect(() => {
//     loadMe();
//   }, [loadMe]);

//   //redosled hookova
//   useEffect(() => {
//     if (window.location.hash === '#_=_') window.location.hash = '';

//     const cookieJwt = Cookies.get('x-auth-cookie');
//     if (cookieJwt) {
//       Cookies.remove('x-auth-cookie');
//       logInUserWithOauth(cookieJwt);
//     }
//   }, []);

//   useEffect(() => {
//     if (!auth.appLoaded && !auth.isLoading && auth.token && !auth.isAuthenticated) {
//       loadMe();
//     }
//   }, [auth.isAuthenticated, auth.token, loadMe, auth.isLoading, auth.appLoaded]);

//   return (
//     <>
//       {auth.appLoaded ? (
//         <Switch>
//           <Route path="/login" component={Login} />
//           <Route path="/register" component={Register} />
//           <Route path="/users" component={Users} />
//           <Route path="/notfound" component={NotFound} />
//           <Route path="/admin" component={Admin} />
//           <Route exact path="/:username" component={Profile} />
//           <Route exact path="/" component={Home} />
//           <Route component={NotFound} />
//         </Switch>
//       ) : (
//         <Loader />
//       )}
//     </>
//   );
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth,
// });

// export default compose(connect(mapStateToProps, { logInUserWithOauth, loadMe }))(App);
