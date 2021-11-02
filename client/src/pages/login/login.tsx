import { RouteComponentProps } from "react-router-dom";
import { ElementStyleProps } from 'constants/interfaces';
import logo from 'img/logo/LogoWText.svg'
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import './login_styles.css';
import { loginUser } from "../../actions/authActions";
import { useFormik } from 'formik';
import { loginSchema } from './validation';

interface LoginProps extends ElementStyleProps {
};
// import Layout from 'layout/layout'

interface LoginProps extends RouteComponentProps {}

function setUsername() {
    // may change after authenticate/validation
    let username = (document as any).getElementById("username").value
    localStorage.setItem('username', JSON.stringify(username))
}


const Login = (props : LoginProps) => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            await loginUser(values, props);
        },
        });

    return(
        <div className={'login '+ (props.classes||'')}>
            <form onSubmit={formik.handleSubmit}>
                <img className="login-logo" src={logo} alt="logo logo"/>
                {formik.touched.email && formik.errors.email ? (
                        <p className="error">{formik.errors.email}</p>
                    ) : null}
                {formik.touched.password && formik.errors.password ? (
                    <p className="error">{formik.errors.password}</p>
                    ) : null}                    
                <h4 className="text-center">Please sign in </h4>
                <div className="form-floating">
                    <input
                        id="username"
                        placeholder="Username"
                        name="email"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
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
                        setUsername()
                    }}
                >Sign In</button>
                <label className="mt-5 mb-3 text-muted">&copy; 2021-2022</label>
            </form>
        </div>
    );
}

export default Login;