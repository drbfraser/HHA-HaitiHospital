import { useState, useEffect } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { EmployeeOfTheMonth as EmployeeOfTheMonthModel } from './EmployeeOfTheMonthModel';
import Api from '../../actions/Api';
import { Department, GeneralDepartment } from 'constants/interfaces';
import initialDepartments from 'utils/json/departments.json';
import { createDepartmentMap } from 'utils/departmentMapper';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT, ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { TOAST_EMPLOYEE_OF_THE_MONTH_PUT, TOAST_DEPARTMENT_GET } from 'constants/toast_messages';
import './employee_of_the_month_form.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { History } from 'history';
import { imageCompressor } from 'utils/imageCompressor';

interface EmployeeOfTheMonthFormProps extends RouteComponentProps {}

export const EmployeeOfTheMonthForm = (props: EmployeeOfTheMonthFormProps) => {
  const [departments, setDepartments] = useState<Map<string, Department>>(
    createDepartmentMap(initialDepartments.departments),
  );
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, reset } = useForm<EmployeeOfTheMonthModel>({});
  const history: History = useHistory<History>();

  const onImageUpload = (item: File) => {
    setSelectedFile(item);
  };

  const onSubmitActions = () => {
    toast.success('Employee of the month successfully updated!');
    reset({});
    setSelectedFile(null);
    props.history.push('/employee-of-the-month');
  };

  const onSubmit = async (data: any) => {
    let formData = new FormData();
    data.department = departments.get(data.department);
    let postData = JSON.stringify(data);
    formData.append('document', postData);
    formData.append('file', selectedFile);

    await Api.Put(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT,
      formData,
      onSubmitActions,
      TOAST_EMPLOYEE_OF_THE_MONTH_PUT,
      history,
    );
  };

  useEffect(() => {
    const getDepartments = async () => {
      setDepartments(
        createDepartmentMap(await Api.Get(ENDPOINT_DEPARTMENT_GET, TOAST_DEPARTMENT_GET, history)),
      );
    };
    getDepartments();
  }, [history]);

  return (
    <div className="employee-of-the-month-form">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to="/employee-of-the-month">
            <button data-testid="back-eotm-button" type="button" className="btn btn-outline-dark">
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
                  data-testid="eotm-name"
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
                  data-testid="eotm-department"
                  className="form-select mb-2 mt-0"
                  id="employee-department"
                  aria-label="Default select example"
                  required
                  {...register('department', { required: true })}
                  defaultValue=""
                >
                  <option value="">{t('employeeOfTheMonthDepartmentOption')}</option>
                  {Array.from(departments.values()).map((dept: Department, index: number) => {
                    return dept.name !== GeneralDepartment ? (
                      <option key={index} value={dept.name}>
                        {dept.name}
                      </option>
                    ) : null;
                  })}
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
                  onChange={(e) => imageCompressor(e.target.files[0], onImageUpload)}
                />
              </div>
              <div>
                <button
                  data-testid="eotm-submit-button"
                  className="btn btn-primary mt-4 "
                  type="submit"
                >
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
