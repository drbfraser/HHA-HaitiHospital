import { useState, useEffect, useMemo } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { UserJson } from 'constants/interfaces';
import { AdminUserFormData } from 'pages/admin/typing';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import { ENDPOINT_ADMIN_GET_BY_ID, ENDPOINT_ADMIN_PUT_BY_ID } from 'constants/endpoints';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { toast } from 'react-toastify';
import { Spinner } from 'components/spinner/Spinner';
import useDidMountEffect from 'utils/custom_hooks';
import { AdminUserForm } from 'pages/admin/form/form';
import { Paths, UserIdParams } from 'constants/paths';
import { ResponseMessage } from 'utils/response_message';
import { useDepartmentMap } from 'hooks';

import './edit.css';

interface UserEditProps {}

export const EditUserForm = (props: UserEditProps) => {
  const departments = useDepartmentMap();
  const [fetch, setFetch] = useState<boolean>(false);
  const [user, setUser] = useState<UserJson>(undefined);
  const params = useParams<UserIdParams>();
  const id = useMemo<string>(() => params.userId, [params.userId]);
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const fetchedUser: UserJson = await Api.Get(
        ENDPOINT_ADMIN_GET_BY_ID(id),
        ResponseMessage.getMsgFetchUserFailed(),
        history,
      );
      setUser(fetchedUser);
    };
    fetchAndSetUser();
  }, [history, id]);

  useDidMountEffect(
    function signalInitDataReady() {
      if (user !== undefined || !departments) setFetch(true);
    },
    [user],
  );

  const onSubmit = () => {
    toast.success(ResponseMessage.getMsgUpdateUserOk());
    history.push(Paths.getAdminMain());
  };

  const submitForm = async (data: AdminUserFormData) => {
    await Api.Put(
      ENDPOINT_ADMIN_PUT_BY_ID(id),
      data,
      onSubmit,
      ResponseMessage.getMsgUpdateUserFailed(),
      history,
    );
  };

  return (
    <div className={'admin'}>
      <SideBar />
      {!fetch ? (
        <Spinner></Spinner>
      ) : (
        <main className="container-fluid main-region">
          <Header />
          <div className="ml-3 mb-3 d-flex justify-content-start">
            <Link to={Paths.getAdminMain()}>
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
