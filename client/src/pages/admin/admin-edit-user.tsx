import { useState, useEffect, useMemo } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  UserInfoForm,
  Role,
  Department,
  UserJson,
  GeneralDepartment,
  emptyUser,
} from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import { ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { TOAST_DEPARTMENT_GET } from 'constants/toast_messages';
import initialDepartments from 'utils/json/departments.json';
import { createDepartmentMap } from 'utils/departmentMapper';
import { ENDPOINT_ADMIN_GET_BY_ID, ENDPOINT_ADMIN_PUT_BY_ID } from 'constants/endpoints';
import { TOAST_ADMIN_GET, TOAST_ADMIN_PUT } from 'constants/toast_messages';
import './admin.css';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { History } from 'history';
import { toast } from 'react-toastify';
import { Spinner } from 'components/spinner/Spinner';
import { getEnumKeyByStringValue } from 'utils/utils';
import useDidMountEffect from 'utils/custom_hooks';
import { useCallback } from 'react';

interface UserEditProps {}

export const EditUserForm = (props: UserEditProps) => {
  const [departments, setDepartments] = useState<Map<string, Department>>(
    createDepartmentMap(initialDepartments.departments),
  );
  const [fetch, setFetch] = useState<boolean>(false);
  const location = useLocation();
  //   Refactor: make url slugs
  const id = useMemo<string>(() => location.pathname.split('/')[3], [location.pathname]);
  const [user, setUser] = useState<UserJson>(emptyUser);

  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [showDepartment, setShowDepartment] = useState<boolean>(false);
  const { register, handleSubmit, reset, unregister } = useForm<UserInfoForm>({});
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  useEffect(
    function fetchInitData() {
      let isMounted = true;
      const fetchAndSetUser = async () => {
        const newUser: UserJson = await Api.Get(
          ENDPOINT_ADMIN_GET_BY_ID(id),
          TOAST_ADMIN_GET,
          history,
        );
        if (isMounted) setUser(newUser);
      };
      fetchAndSetUser();

      const fetchAndSetDepartments = async () => {
        const response = await Api.Get(ENDPOINT_DEPARTMENT_GET, TOAST_DEPARTMENT_GET, history);
        if (isMounted) setDepartments(createDepartmentMap(response));
      };
      fetchAndSetDepartments();

      return function cleanUp() {
        isMounted = false;
      };
    },
    [history, id],
  );

  const setShowDepartmentInit = useCallback(() => {
    const isShown = user.role === Role.User || user.role === Role.HeadOfDepartment;
    setShowDepartment(isShown);
  }, [user]);
  useDidMountEffect(setShowDepartmentInit, [user]);

  const signalInitDataReady = useCallback(() => {
    setFetch(true);
  }, []);
  useDidMountEffect(signalInitDataReady, [user]);

  const onSubmitActions = () => {
    toast.success('Successfully updated user');
    reset({});
    history.push('/admin');
  };

  const onSubmit = async (data: any) => {
    data = setGeneralDepartmentForAdminAndMedicalDir(data) as UserInfoForm;
    await Api.Put(ENDPOINT_ADMIN_PUT_BY_ID(id), data, onSubmitActions, TOAST_ADMIN_PUT, history);
  };

  const setGeneralDepartmentForAdminAndMedicalDir = (data: any): UserInfoForm => {
    data.department =
      data.role === Role.Admin || data.role === Role.MedicalDirector
        ? departments.get(GeneralDepartment)
        : departments.get(data.department);
    return data;
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
      {fetch === false ? (
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
                  defaultValue={user.role}
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
                    defaultValue={user.department.name}
                    required
                    {...register('department')}
                  >
                    <option value="" disabled hidden>
                      {t('adminAddUserSelectDepartment')}
                    </option>
                    {Array.from(departments.values()).map((dept: Department, index: number) => {
                      return dept.name !== GeneralDepartment ? (
                        <option key={index} value={dept.name}>
                          {dept.name}
                        </option>
                      ) : null;
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
