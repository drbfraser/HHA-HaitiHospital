import { AdminUserForm } from 'pages/admin/AdminUserForm';
import { AdminUserFormData } from 'pages/admin/typing';
import { History } from 'history';
import Layout from 'components/layout';
import { Paths } from 'constants/paths';
import { useDepartmentData } from 'hooks';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addUser } from 'api/user';

export const AddUserForm = () => {
  const { departmentNameKeyMap: departments } = useDepartmentData();
  const { t } = useTranslation();

  const history: History = useHistory<History>();

  const onSubmit = () => {
    history.push(Paths.getAdminMain());
  };

  const handleSubmit = async (data: AdminUserFormData) => {
    addUser(data, onSubmit, history);
  };

  return (
    <Layout showBackButton title={t('headerAddUser')}>
      <div className="col-md-6">
        <AdminUserForm
          data={{ departments: departments }}
          onSubmit={handleSubmit}
          newUser
        ></AdminUserForm>
      </div>
    </Layout>
  );
};
