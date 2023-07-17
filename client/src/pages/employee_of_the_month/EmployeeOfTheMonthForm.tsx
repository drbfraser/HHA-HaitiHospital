import { Department, GeneralDepartment } from 'constants/interfaces';

import Api from '../../actions/Api';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT } from 'constants/endpoints';
import { EmployeeOfTheMonth as EmployeeOfTheMonthModel } from './typing';
import { History } from 'history';
import Layout from 'components/layout';
import { TOAST_EMPLOYEE_OF_THE_MONTH_PUT } from 'constants/toastErrorMessages';
import { imageCompressor } from 'utils/imageCompressor';
import { toast } from 'react-toastify';
import { useDepartmentData } from 'hooks';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const EmployeeOfTheMonthForm = () => {
  const { departmentNameKeyMap: departments } = useDepartmentData();
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
    history.push('/employee-of-the-month');
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
      history,
      TOAST_EMPLOYEE_OF_THE_MONTH_PUT,
    );
  };

  return (
    <Layout showBackButton title={t("headerEmployeeOfTheMonthForm")}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group col-lg-9 col-xl-6">
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
    </Layout>
  );
};
