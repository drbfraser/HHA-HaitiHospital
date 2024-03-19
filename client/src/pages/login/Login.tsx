import '../../../node_modules/bootstrap/dist/css/bootstrap.css';
import './login_styles.css';

import * as Yup from 'yup';

import { getCSRFToken, loginUser } from '../../actions/authActions';
import { useAuthDispatch, useAuthState } from 'contexts';

import React from 'react';
import { changeLanguage } from '../../components/side_bar/SideBar';
import logo from 'img/logo/LogoWText.svg';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function setUsername(name: string) {
  localStorage.setItem('username', JSON.stringify(name));
}

const Login = () => {
  const dispatch = useAuthDispatch();
  // @ts-ignore
  const { loading } = useAuthState();
  const [errorMessage, setErrorMessage] = React.useState('');
  const { t, i18n } = useTranslation();
  const history = useHistory();

  // Moved the validation here to support the language translation feature
  const loginSchema = Yup.object({
    username: Yup.string()
      .min(2, t('signInValidationMustBe2CharMini'))
      .max(20, t('signInValidationMustBe20CharLess'))
      .required(t('signInUsernameValidationRequired')),
    password: Yup.string()
      .min(6, t('signInValidationMustBe6CharMini'))
      .max(20, t('signInValidationRequired'))
      .required(t('signInPasswordValidationRequired')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      getCSRFToken()
        .then(() => {
          loginUser(dispatch, values)
            .then((res: any) => {
              if (!res.success) {
                setErrorMessage(i18n.t('signInInvalidLoginCredentials'));
                document.querySelector('.login-form')?.classList.remove('shaked'); // do nothing if no class yet
                document.querySelector('.login-form')?.scrollBy(0, 0); // allows animation to happen again
                document.querySelector('.login-form')?.classList.add('shaked');
                return;
              }
              setUsername(res.user.name);
              history.push('/home');
            })
            .catch((error) => {
              console.error('Logging in failed: ', error);
            });
        })
        .catch((error) => {
          console.log('Get CSRF Token failed');
        });
    },
  });

  return (
    <div className={'login vh-100 d-flex flex-column justify-content-center'}>
      <img className="login-logo user-select-none w-100" src={logo} alt="logo logo" />
      <h4 className="text-center mt-4 mb-4 user-select-none fw-bold">{t('signInPleaseSignIn')}</h4>
      <form className="login-form mb-5" onSubmit={formik.handleSubmit}>
        <div>
          <input type="hidden" name="_csrf" value="csrfToken" />
        </div>

        <div>
          <input
            id="username"
            placeholder={t('signInPleasePlaceHolderEmail')}
            name="username"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            className="form-control"
          />
          {formik.touched.username && formik.errors.username ? (
            <p className="form-text text-danger user-select-none">{formik.errors.username}</p>
          ) : (
            <p />
          )}
        </div>

        <div>
          <input
            id="password"
            placeholder={t('signInPleasePlaceHolderPassword')}
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="form-control"
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="form-text text-danger user-select-none">{formik.errors.password}</p>
          ) : (
            <p />
          )}
        </div>

        {errorMessage ? (
          <div>
            <p className="form-text text-danger user-select-none"> {errorMessage} </p>
          </div>
        ) : null}

        <div className="text-center mb-5">
          <button
            data-testid="signin-button"
            className="w-100 btn btn-lg btn-success mb-5 fw-bold"
            type="submit"
            disabled={loading}
          >
            {t('signInSignIn')}
          </button>
        </div>
      </form>

      <div className="row mt-5">
        <div className="col">
          <button
            className="w-100 btn btn-outline-secondary shadow-sm"
            onClick={changeLanguage('en', i18n)}
          >
            {t('sidebarEnglish')}
          </button>
        </div>

        <div className="col">
          <button
            className="w-100 btn btn-outline-secondary shadow-sm"
            id="fc"
            onClick={changeLanguage('fr', i18n)}
          >
            {t('sidebarFrench')}
          </button>
        </div>
      </div>

      <div className="mt-4 mb-3 text-muted d-flex justify-content-center user-select-none">
        <a href="mailto:hcbh_admin@example.org" className="link-secondary">
          {t('signInContactAdmin')}
        </a>
      </div>
      <div className="text-muted d-flex justify-content-center user-select-none">
        <p>&copy; 2021-{new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default Login;
