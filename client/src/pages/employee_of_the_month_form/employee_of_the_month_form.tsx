import { useState } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { EmployeeOfTheMonth as EmployeeOfTheMonthModel } from './EmployeeOfTheMonthModel';
import { DepartmentName } from 'common/definitions/departments';
import Api from '../../actions/Api';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT } from 'constants/endpoints';
import { TOAST_EMPLOYEE_OF_THE_MONTH_PUT } from 'constants/toast_messages';
import './employee_of_the_month_form.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { History } from 'history';

interface EmployeeOfTheMonthFormProps extends RouteComponentProps {}

export const EmployeeOfTheMonthForm = (props: EmployeeOfTheMonthFormProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, reset } = useForm<EmployeeOfTheMonthModel>({});
  const history: History = useHistory<History>();

  const onSubmitActions = () => {
    toast.success('Employee of the month successfully updated!');
    reset({});
    setSelectedFile(null);
    props.history.push('/employee-of-the-month');
  };

  const onSubmit = async (data: any) => {
    let formData = new FormData();
    let postData = JSON.stringify(data);
    formData.append('document', postData);
    formData.append('file', selectedFile);

    await Api.Put(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT,
      data,
      onSubmitActions,
      TOAST_EMPLOYEE_OF_THE_MONTH_PUT,
      history,
    );
  };

  return (
    <div className="employee-of-the-month-form">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to="/employee-of-the-month">
            <button type="button" className="btn btn-outline-dark">
              {t('employeeOfTheMonthBack')}
            </button>
          </Link>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group col-md-6">
              <label className="font-weight-bold">{t('headerEmployeeOfTheMonth')}</label>
              <div>
                <label htmlFor="Employee Name" className="form-label">
                  {t('employeeOfTheMonthName')}
                </label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="employee-name"
                  required
                  {...register('name', { required: true })}
                ></input>
                <label htmlFor="Employee Department" className="form-label">
                  {t('employeeOfTheMonthDepartment')}
                </label>
                <select
                  className="form-select mb-2 mt-0"
                  id="employee-department"
                  aria-label="Default select example"
                  required
                  {...register('department', { required: true })}
                  defaultValue=""
                >
                  <option value="">{t('employeeOfTheMonthDepartmentOption')}</option>
                  <option value={DepartmentName.NicuPaeds}>{t('NICU/Paeds')}</option>
                  <option value={DepartmentName.Maternity}>{t('Maternity')}</option>
                  <option value={DepartmentName.Rehab}>{t('Rehab')}</option>
                  <option value={DepartmentName.CommunityHealth}>{t('Community & Health')}</option>
                </select>
                <label htmlFor="Employee Description" className="form-label">
                  {t('employeeOfTheMonthDescription')}
                </label>
                <textarea
                  className="form-control mb-2 mt-0"
                  id="employee-description"
                  required
                  {...register('description', { required: true })}
                ></textarea>
                <label htmlFor="Employee Image" className="form-label mb-2">
                  {t('employeeOfTheMonthUploadImage')}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="employee-image"
                  required
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
              <div>
                <button className="btn btn-primary mt-4 " type="submit">
                  {t('employeeOfTheMonthSubmitForm')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
