import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Department } from 'constants/interfaces';
import { AdminUserFormData } from "constants/forms";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import { ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { TOAST_DEPARTMENT_GET } from 'constants/toast_messages';
import { createDepartmentMap } from 'utils/departmentMapper';
import { ENDPOINT_ADMIN_POST } from 'constants/endpoints';
import { TOAST_ADMIN_POST } from 'constants/toast_messages';
import './admin.css';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { toast } from 'react-toastify';
import { AdminUserForm } from '../../components/admin_user_form/admin-user-form';

interface AdminProps {}

export const AddUserForm = (props: AdminProps) => {
  const [departments, setDepartments] = useState<Map<string, Department>>();
  const { t } = useTranslation();
  const history: History = useHistory<History>();

  useEffect(() => {
    const getDepartments = async () => {
      setDepartments(
        createDepartmentMap(await Api.Get(ENDPOINT_DEPARTMENT_GET, TOAST_DEPARTMENT_GET, history)),
      );
    };
    getDepartments();
  }, [history]);

  const onSubmit = () => {
    toast.success('Successfully created user');
    history.push('/admin');
  };

  const submitForm = async (data: AdminUserFormData) => {
    await Api.Post(ENDPOINT_ADMIN_POST, data, onSubmit, TOAST_ADMIN_POST, history);
  };

  return (
    <div className={'admin'}>
      <SideBar />

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
          <AdminUserForm data={{ departments: departments }} onSubmit={submitForm}></AdminUserForm>
        </div>
      </main>
    </div>
  );
};
