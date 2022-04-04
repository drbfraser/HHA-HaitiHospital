import { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  User,
  Role,
  Department,
  UserJson,
  emptyUser,
  GeneralDepartment,
} from 'constants/interfaces';
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
import { Spinner } from 'components/spinner/Spinner';
import { getEnumKeyByStringValue } from 'utils/utils';

interface AdminProps {}

interface FetchState {
  isLoading: boolean;
  data: UserJson;
}
const initFetchState: FetchState = {
  isLoading: true,
  data: emptyUser,
};

export const EditUserForm = (props: AdminProps) => {
  const [departments, setDepartments] = useState<Map<string, Department>>(
    setDepartmentMap(initialDepartments.departments),
  );
  const [fetch, setFetch] = useState<FetchState>(initFetchState);
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [showDepartment, setShowDepartment] = useState<boolean>();
  const { register, handleSubmit, reset, unregister } = useForm<User>({});
  const history: History = useHistory<History>();
  const { t } = useTranslation();
  const id = useLocation().pathname.split('/')[3];

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const retrievedUser: UserJson = await Api.Get(
        ENDPOINT_ADMIN_GET_BY_ID(id),
        TOAST_ADMIN_GET,
        history,
      );
      setFetch({
        data: retrievedUser,
        isLoading: false,
      });
    };
    fetchAndSetUser();

    // For Future Devs: Replace MockDepartmentApi with Api
    const fetchAndSetDepartments = async () => {
      const departments = await MockDepartmentApi.getDepartments();
      setDepartments(setDepartmentMap(departments));
    };
    fetchAndSetDepartments();
  }, []);

  useEffect(() => {
    if (fetch.isLoading === false) {
      const isShown = fetch.data.role === Role.User || fetch.data.role === Role.HeadOfDepartment;
      setShowDepartment(isShown);
    }
  }, [fetch]);

  const onSubmitActions = () => {
    reset({});
    history.push('/admin');
    toast.success('Successfully updated user');
  };

  const onSubmit = async (data: any) => {
    await Api.Put(ENDPOINT_ADMIN_PUT_BY_ID(id), data, onSubmitActions, TOAST_ADMIN_PUT, history);
  };

  const onRoleChange = (value: string) => {
    const roleKey = getEnumKeyByStringValue(Role, value);
    if (!roleKey) {
      throw new Error(`Role of value ${value} not existing`);
    }
    const isShown = Role[roleKey] === Role.User || Role[roleKey] === Role.HeadOfDepartment;
    setShowDepartment(isShown);
    if (!isShown) {
      unregister('department');
    }
  };

  return (
    <div className={'admin'}>
      <SideBar />
      {fetch.isLoading === true ? (
        <Spinner></Spinner>
      ) : (
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
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    autoComplete="new-username"
                    {...register('username')}
                  ></input>
                </div>
                <div id="usernameHelp" className="form-text">
                  {t('adminEditUserLeaveBlank')}
                </div>
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
                  defaultValue={fetch.data.name}
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
                  defaultValue={fetch.data.role}
                  required
                  {...register('role')}
                  onChange={(e) => onRoleChange(e.target.value)}
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
              {showDepartment ? (
                <div className="mb-3">
                  <label htmlFor="department" className="form-label">
                    {t('adminAddUserDepartment')}
                  </label>
                  <select
                    className="form-select"
                    id="department"
                    defaultValue={fetch.data.department.id}
                    required
                    {...register('department.id')}
                  >
                    <option value="" disabled hidden>
                      {t('adminAddUserSelectDepartment')}
                    </option>
                    {Array.from(departments.values()).map((dept: Department, index: number) => {
                      return dept.name !== GeneralDepartment ? (
                        <option key={index} value={dept.id}>
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
      )}
    </div>
  );
};
