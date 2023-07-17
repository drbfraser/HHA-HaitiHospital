import { ENDPOINT_ADMIN_GET_BY_ID, ENDPOINT_ADMIN_PUT_BY_ID } from 'constants/endpoints';
import { Paths, UserIdParams } from 'constants/paths';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { AdminUserForm } from 'pages/admin/AdminUserForm';
import { AdminUserFormData } from 'pages/admin/typing';
import Api from 'actions/Api';
import { History } from 'history';
import Layout from 'components/layout';
import { ResponseMessage } from 'utils/response_message';
import { Spinner } from 'components/spinner/Spinner';
import { UserDetails } from 'constants/interfaces';
import { toast } from 'react-toastify';
import { useDepartmentData } from 'hooks';
import useDidMountEffect from 'utils/custom_hooks';

export const EditUserForm = () => {
  const { departmentNameKeyMap: departments } = useDepartmentData();
  const [fetch, setFetch] = useState<boolean>(false);
  const [user, setUser] = useState<UserDetails>(undefined);
  const params = useParams<UserIdParams>();
  const id = useMemo<string>(() => params.userId, [params.userId]);
  const history: History = useHistory<History>();

  useEffect(() => {
    const controller = new AbortController();
    const fetchAndSetUser = async () => {
      const fetchedUser: UserDetails = await Api.Get(
        ENDPOINT_ADMIN_GET_BY_ID(id),
        ResponseMessage.getMsgFetchUserFailed(),
        history,
        controller.signal,
      );
      setUser(fetchedUser);
    };
    fetchAndSetUser();
    return () => {
      controller.abort();
    };
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
      history,
      ResponseMessage.getMsgUpdateUserFailed(),
    );
  };

  return (
    <div className={'admin'}>
      <Layout showBackButton>
        {!fetch ? (
          <Spinner></Spinner>
        ) : (
          <>
            <div className="col-md-6">
              <AdminUserForm
                data={{ userData: user, departments: departments }}
                onSubmit={submitForm}
              ></AdminUserForm>
            </div>
          </>
        )}
      </Layout>
    </div>
  );
};
