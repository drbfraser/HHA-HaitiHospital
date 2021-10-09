import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import './style/App.css';

import HomePage from './pages/HomePage'
import { DepartmentOne } from "./pages/Department1NICU";
import { DepartmentTwo } from "./pages/Department2Maternity";
import { CaseStudyMain} from "./pages/CaseStudyMain";
import { Post } from "./components/Post";

function App() {
  return (
    <Router>
      <div className="app">
        <Route exact path='/home' component={HomePage}/>
        <Route path="/Department1NICU" exact component={DepartmentOne} />
        <Route path="/Department2Maternity" exact component={DepartmentTwo} />
        <Route path='/caseStudyMain' exact component={CaseStudyMain} />
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
