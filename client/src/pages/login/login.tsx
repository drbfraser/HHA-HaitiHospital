import { RouteComponentProps } from "react-router-dom";
import { ElementStyleProps } from 'constants/interfaces';
import { loginUser } from "../../actions/authActions";
import { useFormik } from 'formik';
// import { loginSchema } from './validation';
import * as Yup from "yup";
import React from 'react';
import logo from 'img/logo/LogoWText.svg'
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import './login_styles.css';
import { useAuthState, useAuthDispatch } from '../../Context'
import {useTranslation} from "react-i18next";
import {changeLanguage} from "../../components/side_bar/side_bar";


interface LoginProps extends ElementStyleProps {
};

interface LoginProps extends RouteComponentProps {}

function setUsername(name: string) {
    localStorage.setItem('username', JSON.stringify(name));
}

const Login = (props : LoginProps) => {
    const dispatch = useAuthDispatch();
    // @ts-ignore
    const { loading, eMessage } = useAuthState();
    const [errorMessage, setErrorMessage] = React.useState("");

    const {t, i18n} = useTranslation();

    // Moved the validation here to support the language translation feature
    const loginSchema = Yup.object({
        username: Yup.string()
            // .email('Invalid email address')
            .min(2, t("signInValidationMustBe2CharMini"))
            .max(20, t("signInValidationMustBe20CharLess"))
            .required(t("signInUsernameValidationRequired")),
        password: Yup.string()
            .min(6, t("signInValidationMustBe6CharMini"))
            .max(20, t("signInValidationRequired"))
            .required(t("signInPasswordValidationRequired")),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: (values) => {
            try {
                loginUser(dispatch, values).then((res: any) => {
                    if (!res.success) return;
                    setUsername(res.user.name);
                    props.history.push('/home');
                }).catch(error => {
                    setErrorMessage(i18n.t("signInInvalidLoginCredentials"));
                    console.error("Error with logging in: ", error);
                });
            } catch (error) {
                console.error('error with logging in: ', error);
            }
        },
    });

    return(
        <div className={'login '+ (props.classes||'')}>
            <img className="login-logo user-select-none" src={logo} alt="logo logo"/>
            <h4 className="text-center mt-4 mb-4 user-select-none fw-bold">{t("signInPleaseSignIn")}</h4>
            <form className="mb-5" onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        id="username"
                        placeholder={t("signInPleasePlaceHolderEmail")}
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        className="form-control"
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <p className="form-text text-danger user-select-none">{formik.errors.username}</p>
                    ) : <p/>}
                </div>

                <div>
                    <input
                        id="password"
                        placeholder={t("signInPleasePlaceHolderPassword")}
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className="form-control"
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="form-text text-danger user-select-none">{formik.errors.password}</p>
                    ) : <p/>}
                </div>

                {errorMessage ? <div><p className="form-text text-danger user-select-none"> {errorMessage} </p></div> : null}

                {/* <div className="form-check form-switch mb-4">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                            {t("signInRememberMe")}
                        </label>
                </div> */}

                <div className="text-center mb-5">
                    <button 
                        className="w-100 btn btn-lg btn-success mb-5 fw-bold"
                        type="submit"
                        disabled={loading}
                    >{t("signInSignIn")}</button>
                </div>

            </form>

            <div className="row mt-5">
                <div className="col">
                    <button className="w-100 btn btn-outline-secondary shadow-sm"
                            onClick={changeLanguage("en")}>
                        {t("sidebarEnglish")}
                    </button>
                </div>

                <div className="col">
                    <button className="w-100 btn btn-outline-secondary shadow-sm" id="fc"
                            onClick={changeLanguage("fr")}>
                        {t("sidebarFrench")}
                    </button>
                </div>
            </div>

            <div className="mt-4 mb-3 text-muted d-flex justify-content-center user-select-none">
                <a href="mailto:hcbh_admin@example.org" className="link-secondary">{t("signInContactAdmin")}</a>
            </div>
            <div className="text-muted d-flex justify-content-center user-select-none">
                <p>&copy; 2021-2022</p>
            </div>
        </div>
    );
}

export default Login;