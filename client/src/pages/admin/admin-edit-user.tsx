import { useState, useEffect, useMemo } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Department, UserJson, emptyUser } from 'constants/interfaces';
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
import { History } from 'history';
import { toast } from 'react-toastify';
import { Spinner } from 'components/spinner/Spinner';
import useDidMountEffect from 'utils/custom_hooks';
import { useCallback } from 'react';
import { AdminUserForm } from '../../components/admin_user_form/admin-user-form';

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

  const signalInitDataReady = useCallback(() => {
    setFetch(true);
  }, []);
  useDidMountEffect(signalInitDataReady, [user]);

  const onSubmit = () => {
    toast.success('Successfully updated user');
    history.push('/admin');
  };

  const submitForm = async (data: any) => {
    await Api.Put(ENDPOINT_ADMIN_PUT_BY_ID(id), data, onSubmit, TOAST_ADMIN_PUT, history);
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
            <AdminUserForm
              data={{ userData: user, departments: departments }}
              onSubmit={submitForm}
            ></AdminUserForm>
          </div>
        </main>
      )}
    </div>
  );
};
