import { Department, GeneralDepartment } from 'constants/interfaces';

import Api from '../../actions/Api';
import {
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT,
} from 'constants/endpoints';
import {
  EmployeeOfTheMonth,
  EmployeeOfTheMonth as EmployeeOfTheMonthModel,
  EmployeeViewParams,
} from './typing';
import { History } from 'history';
import Layout from 'components/layout';
import {
  TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR,
  TOAST_EMPLOYEE_OF_THE_MONTH_PUT_ERROR,
} from 'constants/toastErrorMessages';
import { imageCompressor } from 'utils/imageCompressor';
import { toast } from 'react-toastify';
import { useDepartmentData } from 'hooks';
import { useForm } from 'react-hook-form';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends RouteComponentProps<EmployeeViewParams> {}

export const EmployeeOfTheMonthUpdateForm = (props: Props) => {
  const { departmentNameKeyMap: departments } = useDepartmentData();
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [awardedAt, setAwardedAt] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [employeeOfTheMonth, setEmployeeOfTheMonth] = useState<EmployeeOfTheMonth>(null);
  const { register, handleSubmit, reset } = useForm<EmployeeOfTheMonthModel>({});
  const history: History = useHistory<History>();

  const isNonEmptyObject = (objectName) => {
    return (
      typeof objectName === 'object' && objectName !== null && Object.keys(objectName).length > 0
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    const { eotmId } = props.match.params;
    const endpoint = `${ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET}/${eotmId}`;
    const getEmployeeOfTheMonth = async () => {
      const employeeOfTheMonthInfo: EmployeeOfTheMonth = await Api.Get(
        endpoint,
        TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR,
        history,
        controller.signal,
      );
      if (isNonEmptyObject(employeeOfTheMonthInfo)) {
        setEmployeeOfTheMonth(employeeOfTheMonthInfo);
      }
    };
    getEmployeeOfTheMonth();
    return () => {
      controller.abort();
    };
  }, [history]);

  useEffect(() => {
    if (isNonEmptyObject(employeeOfTheMonth)) {
      const month = employeeOfTheMonth.awardedMonth.toString();
      const awardedMonth = month.length == 1 ? `0${month}` : `${month}`;
      const awardedAtInfo = `${employeeOfTheMonth.awardedYear}-${awardedMonth}`;
      setAwardedAt(awardedAtInfo);
      setDepartmentName(employeeOfTheMonth.department.name);
    }
  }, [employeeOfTheMonth]);

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
    console.log('PONYO');
    let formData = new FormData();
    data.department = departments.get(data.department);
    [data.awardedYear, data.awardedMonth] = data.awardedMonth.split('-'); // ex: 2023-08
    let postData = JSON.stringify(data);
    formData.append('document', postData);
    formData.append('file', selectedFile);
    await Api.Put(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT,
      formData,
      onSubmitActions,
      history,
      TOAST_EMPLOYEE_OF_THE_MONTH_PUT_ERROR,
    );
  };

  return (
    <Layout showBackButton title={t('headerEmployeeOfTheMonthUpdateForm')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group col-lg-9 col-xl-6">
          <label className="font-weight-bold">{t('headerEmployeeOfTheMonth')}</label>
          <div>
            <input
              data-testid="eotm-id"
              className="form-control mb-2 mt-0"
              type="text"
              id="employee-eotmid"
              defaultValue={employeeOfTheMonth?.id}
              readOnly
              {...register('id', { required: true })}
            ></input>
            <label htmlFor="Employee Month Year" className="form-label">
              Month and Year Awarded
            </label>
            <input
              data-testid="eotm-awarded-at"
              className="form-control mb-2 mt-0"
              type="month"
              id="employee-month"
              required
              defaultValue={awardedAt}
              {...register('awardedMonth', { required: true })}
            ></input>
            <label htmlFor="Employee Name" className="form-label">
              {t('employeeOfTheMonthName')}
            </label>
            <input
              data-testid="eotm-name"
              className="form-control mb-2 mt-0"
              type="text"
              id="employee-name"
              required
              defaultValue={employeeOfTheMonth?.name}
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
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              {...register('department', { required: true })}
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
              defaultValue={employeeOfTheMonth?.description}
              {...register('description', { required: true })}
            ></textarea>
            <label htmlFor="Employee Image" className="form-label mb-2">
              {t('employeeOfTheMonthUpdateUploadImage')}
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              id="employee-image"
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
