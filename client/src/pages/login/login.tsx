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
            .required(t("signInValidationRequired")),
        password: Yup.string()
            .min(6, t("signInValidationMustBe6CharMini"))
            .max(20, t("signInValidationRequired"))
            .required(t("signInValidationRequired")),
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
            <form onSubmit={formik.handleSubmit}>
                <img className="login-logo" src={logo} alt="logo logo"/>
                {formik.touched.username && formik.errors.username ? (
                        <p className="error">{formik.errors.username}</p>
                    ) : null}
                {formik.touched.password && formik.errors.password ? (
                    <p className="error">{formik.errors.password}</p>
                    ) : null}
                {errorMessage ? <div className="error"> {errorMessage} </div> : null}
                <h4 className="text-center">{t("signInPleaseSignIn")}</h4>
                <div className="form-floating">
                    <input
                        id="username"
                        placeholder={t("signInPleasePlaceHolderEmail")}
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                    />
                </div>
                {formik.touched.username && formik.errors.username ? (
                    <p className="error">{formik.errors.username}</p>
                ) : null}

                <div className="form-floating mt-2">
                    <input
                        id="password"
                        placeholder={t("signInPleasePlaceHolderPassword")}
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                </div>
                {formik.touched.password && formik.errors.password ? (
                    <p className="error">{formik.errors.password}</p>
                ) : null}

                <div className="form-check form-switch mt-1">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                            {t("signInRememberMe")}
                        </label>
                </div>

                <button 
                    className="w-100 btn btn-lg btn-primary mt-3"
                    type="submit"
                    disabled={loading}
                >{t("signInSignIn")}</button>
                <label className="mt-5 mb-3 text-muted">&copy; 2021-2022</label>
            </form>

            <div className="row mt-5">
                <div className="col">
                    <button className="w-100 btn btn-lg btn-danger"
                            onClick={changeLanguage("en")}>
                        <i className="bi bi-gear-fill me-2"/>
                        <span className="text text-light">{t("sidebarEnglish")}</span>
                    </button>
                </div>

                <div className="col">
                    <button className="w-100 btn btn-lg btn-danger" id="fc"
                            onClick={changeLanguage("fr")}>
                        <i className="bi bi-gear me-2"/>
                        <span className="text text-light">{t("sidebarFrench")}</span>
                    </button>
                </div>
            </div>

            <label className="mt-3 mb-3 text-muted d-flex justify-content-center">&copy; 2021-2022</label>
        </div>
    );
}

export default Login;