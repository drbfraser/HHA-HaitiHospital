import { AdminUserForm } from 'pages/admin/AdminUserForm';
import { AdminUserFormData } from 'pages/admin/typing';
import Api from 'actions/Api';
import { ENDPOINT_ADMIN_POST } from 'constants/endpoints';
import { History } from 'history';
import Layout from 'components/layout';
import { Paths } from 'constants/paths';
import { ResponseMessage } from 'utils/response_message';
import { useDepartmentData } from 'hooks';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AddUserForm = () => {
  const { departmentNameKeyMap: departments } = useDepartmentData();
  const { t } = useTranslation();

  const history: History = useHistory<History>();

  const onSubmit = () => {
    history.push(Paths.getAdminMain());
  };

  const submitForm = async (data: AdminUserFormData) => {
    await Api.Post(
      ENDPOINT_ADMIN_POST,
      data,
      onSubmit,
      history,
      ResponseMessage.getMsgCreateUserFailed(),
      'Pending create user',
      ResponseMessage.getMsgCreateUserOk(),
    );
  };

  return (
    <Layout showBackButton title={t('headerAddUser')}>
      <div className="col-md-6">
        <AdminUserForm
          data={{ departments: departments }}
          onSubmit={submitForm}
          newUser
        ></AdminUserForm>
      </div>
    </Layout>
  );
};
