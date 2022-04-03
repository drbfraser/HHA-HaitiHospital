import { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Role, Department } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import MockDepartmentApi from 'actions/MockDepartmentApi';
import initialDepartments from 'utils/json/departments.json';
import { setDepartmentMap } from 'utils/departmentMapper';
import { ENDPOINT_ADMIN_GET_BY_ID, ENDPOINT_ADMIN_PUT_BY_ID } from 'constants/endpoints';
import { TOAST_ADMIN_GET, TOAST_ADMIN_PUT } from 'constants/toast_messages';
import './admin.css';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { History } from 'history';
import { toast } from 'react-toastify';

interface AdminProps {}

export const EditUserForm = (props: AdminProps) => {
  const [departments, setDepartments] = useState<Map<string, Department>>(
    setDepartmentMap(initialDepartments.departments),
  );
  const [user, setUser] = useState({} as User);
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [role, setRole] = useState(null);
  const [department, setDepartment] = useState(null);
  const { register, handleSubmit, reset, unregister } = useForm<User>({});
  const history: History = useHistory<History>();
  const { t } = useTranslation();
  const id = useLocation().pathname.split('/')[3];

  const getUser = async () => {
    const retrievedUser = await Api.Get(ENDPOINT_ADMIN_GET_BY_ID(id), TOAST_ADMIN_GET, history);
    setUser(retrievedUser);
    setRole(retrievedUser.role);
    setDepartment(retrievedUser.department);
  };

  useEffect(() => {
    getUser();
    // For Future Devs: Replace MockDepartmentApi with Api
    setDepartments(setDepartmentMap(MockDepartmentApi.getDepartments()));
  }, []);

  const defaultValueHandler = (data: User): object => {
    if (data.name === '' || data.username === '') {
      data.name = user.name;
      data.username = user.username;
    }
    return data;
  };

  const onSubmitActions = () => {
    reset({});
    history.push('/admin');
    toast.success('Successfully updated user');
  };

  const onSubmit = async (data: any) => {
    data = setGeneralDepartmentForAdminAndMedicalDir(data);
    await Api.Put(
      ENDPOINT_ADMIN_PUT_BY_ID(id),
      defaultValueHandler(data),
      onSubmitActions,
      TOAST_ADMIN_PUT,
      history,
    );
  };

  const setGeneralDepartmentForAdminAndMedicalDir = (data: any): any => {
    if (data.role === Role.Admin || data.role === Role.MedicalDirector) {
      data.department = departments.get('General');
    } else {
      data.department = departments.get(data.department);
    }
    return data;
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
                  {Array.from(departments.values()).map((dept: Department, index: number) => {
                    return dept.name !== 'General' ? (
                      <option key={index} value={dept.name}>
                        {dept.name}
                      </option>
                    ) : (
                      <></>
                    );
                  })}
                </select>
              </div>
            ) : null}
            <div className="mt-5 mb-3 d-flex justify-content-center">
              <button type="submit" className="btn btn-dark col-6">
                {t('adminAddUserSubmit')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
