import { RouteComponentProps } from "react-router-dom";
import { ElementStyleProps } from 'constants/interfaces';
import logo from 'img/logo/LogoWText.svg'
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import './login_styles.css';
import { loginUser } from "../../actions/authActions";
import { useFormik } from 'formik';
import { loginSchema } from './validation';
import React from 'react';

interface LoginProps extends ElementStyleProps {
};

interface LoginProps extends RouteComponentProps {}

function setUsername(username: string) {
    // may change after authenticate/validation
    const name = (document as any).getElementById("username").value
    localStorage.setItem('username', JSON.stringify(name))
}

const Login = (props : LoginProps) => {
    const [errorMessage, setErrorMessage] = React.useState("");

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: (values) => {
            setErrorMessage('Invalid login credentials');
            loginUser(values, props).then((res: any) => {
                // Problems with async to get res with username and set as name.
                // setUsername(res.data.user.name);
                // props.history.push("./home");
            }).catch(err => {
                console.log("error catch")
            });
        },
    });

    return(
        <div className={'login '+ (props.classes||'')}>
            <form onSubmit={formik.handleSubmit}>
                <img className="login-logo" src={logo} alt="logo logo"/>
                {formik.touched.username && formik.errors.username ? (
                        <p className="error">{formik.errors.username}</p>
                    ) : null}
                {formik.touched.password && formik.errors.password ? (
                    <p className="error">{formik.errors.password}</p>
                    ) : null}                    
                <h4 className="text-center">Please sign in </h4>
                <div className="form-floating">
                    <input
                        id="username"
                        placeholder="Username"
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                </div>

                <div className="form-floating">
                    <input
                        id="password"
                        placeholder="Password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                </div>

                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                            Remember me
                        </label>
                </div>

                {/*Temporarily link the sign in button directly to the homepage*/}
                <button 
                    className="w-100 btn btn-lg btn-primary" 
                    type="submit"
                    onClick={() => {
                        setUsername("")
                    }}
                >Sign In</button>
                <label className="mt-5 mb-3 text-muted">&copy; 2021-2022</label>

                {errorMessage && <div className="error"> {errorMessage} </div>}
            </form>
        </div>
    );
}

export default Login;