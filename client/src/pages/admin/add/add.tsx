import { Link, useHistory } from 'react-router-dom';
import { AdminUserFormData } from 'pages/admin/typing';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import { ENDPOINT_ADMIN_POST } from 'constants/endpoints';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { toast } from 'react-toastify';
import { AdminUserForm } from 'pages/admin/form/form';
import { Spinner } from 'components/spinner/Spinner';
import { ResponseMessage } from 'utils/response_message';
import { Paths } from 'constants/paths';
import './add.css';
import { useDepartmentData } from 'hooks';

interface AdminProps {}

export const AddUserForm = (props: AdminProps) => {
  const { departmentMap: departments } = useDepartmentData();

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
      ResponseMessage.getMsgCreateUserFailed(),
      history,
    );
  };

  return (
    <div className={'admin'}>
      <SideBar />
      {!departments ? (
        <Spinner />
      ) : (
        <main className="container-fluid main-region">
          <Header />
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
            <AdminUserForm
              data={{ departments: departments }}
              onSubmit={submitForm}
            ></AdminUserForm>
          </div>
        </main>
      )}
    </div>
  );
};
