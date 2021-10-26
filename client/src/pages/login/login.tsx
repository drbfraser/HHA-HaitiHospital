import React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { ElementStyleProps } from 'constants/interfaces';
import Layout from 'layout/layout'
import logo from 'img/logo/LogoWText.svg'
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import './login.css';

interface LoginProps extends ElementStyleProps {

};

interface LoginProps extends RouteComponentProps {
};

const Login = (props : LoginProps) => {
  return(
    // <Layout>
    //   <div className={'login '+ (props.classes||'')}></div>
    // </Layout>
      <div className={'login '+ (props.classes||'')}>
          <form>
              <img className="login-logo" src={logo} />
              <label className="h3 mb-3 fw-normal">Please sign in</label>

              <div className="form-floating">
                  <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"/>
                  <label htmlFor="floatingInput">Email address</label>
              </div>

              <div className="form-floating">
                  <input type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                  <label htmlFor="floatingPassword">Password</label>
              </div>

              <div className="checkbox mb-3">
                  <label>
                      <input type="checkbox" value="remember-me" />
                      Remember me
                  </label>
              </div>

              {/*Temporarily link the sign in button directly to the homepage*/}
              <button className="w-100 btn btn-lg btn-primary" type="submit"
                      onClick={() => {
                          props.history.push("./home");
                      }}>Sign In</button>
              <label className="mt-5 mb-3 text-muted">&copy; 2021-2022</label>
          </form>
      </div>
  );
}

export default Login;





// Commented out during JS to TS for future reference
// import React from 'react';
// import { Link, withRouter, Redirect } from 'react-router-dom';

// import { useFormik } from 'formik';

// import { compose } from 'redux';
// import { connect } from 'react-redux';
// import _ from 'lodash';

// import { loginUserWithEmail } from '../../store/actions/authActions';
// import { FACEBOOK_AUTH_LINK, GOOGLE_AUTH_LINK } from '../../constants';
// import { loginSchema } from './validation';
// import './homeStyles.css';

// const Login = ({ auth, history, loginUserWithEmail }) => {
//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: '',
//     },
//     validationSchema: loginSchema,
//     onSubmit: (values) => {
//       loginUserWithEmail(values, history);
//     },
//   });

//   if (auth.isAuthenticated) return <Redirect to="/" />;

//   return (
//     <div className="login">
//       <div className="container">
//         <h1>Log in page</h1>
//         <p>
//           back to{' '}
//           <Link className="bold" to="/">
//             Home page
//           </Link>
//         </p>
//         <form onSubmit={formik.handleSubmit}>
//           <h2>Log in with social media</h2>
//           <a className="fb btn" href={FACEBOOK_AUTH_LINK}>
//             <i className="fa fa-facebook fa-fw" /> Login with Facebook
//           </a>
//           <a className="google btn" href={GOOGLE_AUTH_LINK}>
//             <i className="fa fa-google fa-fw" />
//             Login with Google
//           </a>
//           <h2>Login with email address</h2>
//           <p className="logins">Admin: email0@email.com 123456789</p>
//           <p className="logins">User: email1@email.com 123456789</p>
//           <div>
//             <input
//               placeholder="Email address"
//               name="email"
//               className="text"
//               type="text"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.email}
//             />
//             {formik.touched.email && formik.errors.email ? (
//               <p className="error">{formik.errors.email}</p>
//             ) : null}
//             <input
//               placeholder="Password"
//               name="password"
//               type="password"
//               className="text"
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               value={formik.values.password}
//             />
//             {formik.touched.password && formik.errors.password ? (
//               <p className="error">{formik.errors.password}</p>
//             ) : null}
//           </div>
//           {auth.error && <p className="error">{auth.error}</p>}
//           <div>
//             <button
//               className="btn submit"
//               disabled={auth.isLoading || !formik.isValid}
//               type="submit"
//             >
//               Log in now
//             </button>
//           </div>
//           <div>
//             Don't have an account?{' '}
//             <Link className="bold" to="/register">
//               Register
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth,
//   errors: state.errors,
// });

// export default compose(withRouter, connect(mapStateToProps, { loginUserWithEmail }))(Login);
