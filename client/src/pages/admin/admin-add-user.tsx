import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Department } from 'constants/interfaces';
import { AdminUserFormData } from 'constants/forms';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import { ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { createDepartmentMap } from 'utils/departmentMapper';
import { ENDPOINT_ADMIN_POST } from 'constants/endpoints';
import './admin.css';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import { AdminUserForm } from 'components/admin_user_form/admin-user-form';
import useDidMountEffect from 'utils/custom_hooks';
import { Spinner } from 'components/spinner/Spinner';
import { Translator } from 'utils/internationalization/internationalization';
import { Paths } from 'constants/paths';

const { Content, ResponseMessage } = Translator;

interface AdminProps {}

export const AddUserForm = (props: AdminProps) => {
  const [departments, setDepartments] = useState<Map<string, Department>>(undefined);
  const [fetch, setFetch] = useState<boolean>(false);
  const { t } = useTranslation();
  const history: History = useHistory<History>();
  
  useEffect(() => {
    const getDepartments = async () => {
      setDepartments(
        createDepartmentMap(
          await Api.Get(
            ENDPOINT_DEPARTMENT_GET,
            ResponseMessage.getMsgFetchDepartmentsFailed(),
            history,
          ),
        ),
      );
    };
    getDepartments();
  }, [history]);

  useDidMountEffect(
    function signalInitDataReady() {
      if (departments !== undefined) setFetch(true);
    },
    [departments],
  );

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
      {fetch === false ? (
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
              data={{ departments: departments }}
              onSubmit={submitForm}
            ></AdminUserForm>
          </div>
        </main>
      )}
    </div>
  );
};
