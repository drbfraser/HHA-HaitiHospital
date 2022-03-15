import { useState, useRef, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Role } from 'constants/interfaces';
import { DepartmentName } from 'common/definitions/departments';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import axios from 'axios';
import './admin.css';
import DbErrorHandler from 'actions/http_error_handler';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

interface AdminProps {}

export const EditUserForm = (props: AdminProps) => {
  const [user, setUser] = useState({} as User);
  const [submissionStatus, setSubmissionStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [role, setRole] = useState(null);
  const [department, setDepartment] = useState(null);
  const { register, handleSubmit, reset, unregister } = useForm<User>({});

  const failureMessageRef = useRef(null);
  const history = useHistory();
  const { t } = useTranslation();
  const id = useLocation().pathname.split('/')[3];
  const userUrl = `/api/users/${id}`;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(userUrl);
        setUser(res.data);
        setRole(res.data.role);
        setDepartment(res.data.department);
      } catch (err) {
        DbErrorHandler(err, history, 'Unable to get user');
      }
    };
    getUser();
  }, [history, userUrl]);

  useEffect(() => {
    reset({
      username: user.username,
      password: user.password,
      name: user.name,
      department: user.department,
      role: user.role,
    });
  }, [user]);

  useEffect(() => {
    reset({
      username: user.username,
      password: user.password,
      name: user.name,
      department: user.department,
      role: user.role,
    });
  }, [user]);

  const onSubmit = (data: any) => {
    axios
      .put(userUrl, data)
      .then((res) => {
        reset({});
        history.push('/admin');
      })
      .catch((error) => {
        handleSubmitFailure(error);
      });
  };

  const handleSubmitFailure = (error) => {
    try {
      if (error.response.data.message) {
        setErrorMessage(error.response.data.message);
      }
      setSubmissionStatus('failure');
      failureMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={'admin'}>
      <SideBar />

      <main className="container-fluid main-region">
        <Header />

        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to="/admin">
            <button type="button" className="btn btn-outline-dark">
              {t('adminAddUserBack')}
            </button>
          </Link>
        </div>

        <div className="col-md-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                {t('adminAddUserUsername')}
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                autoComplete="new-password"
                defaultValue={user.username}
                required
                {...register('username')}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                {t('adminAddUserPassword')}
              </label>
              <div className="input-group">
                <input
                  type={passwordShown ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  autoComplete="new-password"
                  {...register('password')}
                ></input>
                <div className="input-group-text">
                  <i
                    onClick={() => setPasswordShown(true)}
                    className={`${
                      passwordShown ? 'd-none' : 'd-block'
                    } btn btn-sm p-0 m-0 fa fa-eye-slash text-dark`}
                  ></i>
                  <i
                    onClick={() => setPasswordShown(false)}
                    className={`${
                      passwordShown ? 'd-block' : 'd-none'
                    } btn btn-sm p-0 m-0 fa fa-eye text-dark`}
                  ></i>
                </div>
              </div>
              <div id="passwordHelp" className="form-text">
                {t('adminEditUserLeaveBlank')}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                {t('adminAddUserName')}
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                defaultValue={user.name}
                required
                {...register('name')}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                {t('adminAddUserRole')}
              </label>
              <select
                className="form-select"
                id="role"
                defaultValue={role}
                required
                {...register('role')}
                onChange={(e) => {
                  setRole(e.target.value);
                  unregister('department');
                }}
              >
                <option value="" disabled hidden>
                  {t('adminAddUserSelectRole')}
                </option>
                <option value={Role.User}>{i18n.t(Role.User)}</option>
                <option value={Role.Admin}>{i18n.t(Role.Admin)}</option>
                <option value={Role.MedicalDirector}>{i18n.t(Role.MedicalDirector)}</option>
                <option value={Role.HeadOfDepartment}>{i18n.t(Role.HeadOfDepartment)}</option>
              </select>
            </div>
            {role === Role.User || role === Role.HeadOfDepartment ? (
              <div className="mb-3">
                <label htmlFor="department" className="form-label">
                  {t('adminAddUserDepartment')}
                </label>
                <select
                  className="form-select"
                  id="department"
                  defaultValue={department}
                  required
                  {...register('department')}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                  }}
                >
                  <option value="" disabled hidden>
                    {t('adminAddUserSelectDepartment')}
                  </option>
                  <option value={DepartmentName.NicuPaeds}>{DepartmentName.NicuPaeds}</option>
                  <option value={DepartmentName.Maternity}>{DepartmentName.Maternity}</option>
                  <option value={DepartmentName.Rehab}>{DepartmentName.Rehab}</option>
                  <option value={DepartmentName.CommunityHealth}>
                    {DepartmentName.CommunityHealth}
                  </option>
                </select>
              </div>
            ) : null}
            <div className="mt-5 mb-3 d-flex justify-content-center">
              <button type="submit" className="btn btn-dark col-6">
                {t('adminAddUserSubmit')}
              </button>
            </div>
          </form>

          <div
            className={`alert alert-danger ${
              submissionStatus === 'failure' ? 'd-block' : 'd-none'
            }`}
            role="alert"
            ref={failureMessageRef}
          >
            {t('adminAddErrorOccurredDuringTheSubmission')} {errorMessage}
          </div>
        </div>
      </main>
    </div>
  );
};
