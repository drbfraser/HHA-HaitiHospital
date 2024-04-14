import { Paths, UserIdParams } from 'constants/paths';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AdminUserForm } from 'pages/admin/AdminUserForm';
import { AdminUserFormData } from 'pages/admin/typing';
import { History } from 'history';
import Layout from 'components/layout';
import { Spinner } from 'components/spinner/Spinner';
import { UserClientModel as User } from '@hha/common';
import { useDepartmentData } from 'hooks';
import useDidMountEffect from 'utils/custom_hooks';
import { useTranslation } from 'react-i18next';
import { getUserById, updateUser } from 'api/user';

export const EditUserForm = () => {
  const { departmentNameKeyMap: departments } = useDepartmentData();
  const [fetch, setFetch] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const params = useParams<UserIdParams>();
  const id = useMemo<string>(() => params.userId, [params.userId]);
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const fetchAndSetUser = async () => {
    const fetchedUser: User = await getUserById(id, history);
    setUser(fetchedUser);
  };

  useEffect(() => {
    fetchAndSetUser();
  }, [history, id]);

  useDidMountEffect(
    function signalInitDataReady() {
      if (user !== undefined || !departments) setFetch(true);
    },
    [user],
  );

  const onSubmit = () => {
    history.push(Paths.getAdminMain());
  };

  const submitForm = async (data: AdminUserFormData) => {
    updateUser(id, data, onSubmit, history);
  };

  return (
    <Layout showBackButton title={t('headerEditUser')}>
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
  );
};
