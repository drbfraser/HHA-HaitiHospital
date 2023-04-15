import { Link, useHistory } from 'react-router-dom';
import { AdminUserFormData } from 'pages/admin/typing';
import Layout from 'components/layout';
import Api from 'actions/Api';
import { ENDPOINT_ADMIN_POST } from 'constants/endpoints';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { toast } from 'react-toastify';
import { AdminUserForm } from 'pages/admin/form/form';
import { ResponseMessage } from 'utils/response_message';
import { Paths } from 'constants/paths';
import './add.css';
import { useDepartmentData } from 'hooks';

interface AdminProps {}

export const AddUserForm = (props: AdminProps) => {
  const { departmentNameKeyMap: departments } = useDepartmentData();

  const { t } = useTranslation();
  const history: History = useHistory<History>();

  const onSubmit = () => {
    toast.success(ResponseMessage.getMsgCreateUserOk());
    history.push(Paths.getAdminMain());
  };

  const submitForm = async (data: AdminUserFormData) => {
    await Api.Post(
      ENDPOINT_ADMIN_POST,
      data,
      onSubmit,
      history,
      ResponseMessage.getMsgCreateUserFailed(),
    );
  };

  return (
    <div className={'admin'}>
      <Layout>
        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to={Paths.getAdminMain()}>
            <button
              data-testid="add-user-back-button"
              type="button"
              className="btn btn-outline-dark"
            >
              {t('button.back')}
            </button>
          </Link>
        </div>

        <div className="col-md-6">
          <AdminUserForm data={{ departments: departments }} onSubmit={submitForm}></AdminUserForm>
        </div>
      </Layout>
    </div>
  );
};
