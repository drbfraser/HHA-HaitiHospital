import { useState, useEffect, useMemo } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Department, UserJson } from 'constants/interfaces';
import { AdminUserFormData } from 'constants/forms';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import { ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { createDepartmentMap } from 'utils/departmentMapper';
import { ENDPOINT_ADMIN_GET_BY_ID, ENDPOINT_ADMIN_PUT_BY_ID } from 'constants/endpoints';
import './admin.css';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { toast } from 'react-toastify';
import { Spinner } from 'components/spinner/Spinner';
import useDidMountEffect from 'utils/custom_hooks';
import { AdminUserForm } from 'components/admin_user_form/admin-user-form';
import { ADMIN_MAIN, UserIdParams } from 'constants/paths';

interface UserEditProps {}

export const EditUserForm = (props: UserEditProps) => {
  const [departments, setDepartments] = useState<Map<string, Department>>(undefined);
  const [fetch, setFetch] = useState<boolean>(false);
  const [user, setUser] = useState<UserJson>(undefined);
  const params = useParams<UserIdParams>();
  const id = useMemo<string>(() => params.userId, [params.userId]);

  const history: History = useHistory<History>();
  const { t } = useTranslation();

  useEffect(
    function fetchInitData() {
      let isMounted = true;
      const fetchAndSetUser = async () => {
        const fetchedUser: UserJson = await Api.Get(
          ENDPOINT_ADMIN_GET_BY_ID(id),
          t('admin.toast.fetch_user_failed'),
          history,
        );
        if (isMounted) setUser(fetchedUser);
      };
      fetchAndSetUser();

      const fetchAndSetDepartments = async () => {
        const response: Department[] = await Api.Get(
          ENDPOINT_DEPARTMENT_GET,
          t('admin.toast.fetch_departments_failed'),
          history,
        );
        if (isMounted) setDepartments(createDepartmentMap(response));
      };
      fetchAndSetDepartments();

      return function cleanUp() {
        isMounted = false;
      };
    },
    [history, id],
  );

  useDidMountEffect(
    function signalInitDataReady() {
      if (user !== undefined && departments !== undefined) setFetch(true);
    },
    [user, departments],
  );

  const onSubmit = () => {
    toast.success(t('admin.toast.update_user_ok'));
    history.push(ADMIN_MAIN);
  };

  const submitForm = async (data: AdminUserFormData) => {
    await Api.Put(ENDPOINT_ADMIN_PUT_BY_ID(id), data, onSubmit, t("admin.toast.update_user_failed"), history);
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
            <Link to={ADMIN_MAIN}>
              <button type="button" className="btn btn-outline-dark">
                {t('button.back')}
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
