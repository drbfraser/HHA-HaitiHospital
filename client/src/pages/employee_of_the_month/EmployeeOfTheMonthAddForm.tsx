import Api from '../../actions/Api';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_POST } from 'constants/endpoints';
import { History } from 'history';
import Layout from 'components/layout';
import { TOAST_EMPLOYEE_OF_THE_MONTH_PUT_ERROR } from 'constants/toastErrorMessages';
import { useDepartmentData } from 'hooks';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EmployeeOfTheMonthForm } from 'components/employee_of_the_month/EmployeeOfTheMonthForm';
import { EmployeeOfTheMonthJson } from '@hha/common';

// Previously was EmployeeOfTheMonthForm
export const EmployeeOfTheMonthAddForm = () => {
  const { departmentNameKeyMap: departments } = useDepartmentData();
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { reset } = useForm<EmployeeOfTheMonthJson>({});
  const history: History = useHistory<History>();

  const onImageUpload = (item: File) => {
    setSelectedFile(item);
  };

  const removeImageUpload = () => {
    setSelectedFile(null);
  };

  const onSubmitActions = () => {
    reset({});
    setSelectedFile(null);
    history.push('/employee-of-the-month');
  };

  const onSubmit = async (data: any) => {
    let formData = new FormData();
    data.department = departments.get(data.department);
    [data.awardedYear, data.awardedMonth] = data.awardedMonth.split('-'); // ex: 2023-08
    let postData = JSON.stringify(data);
    formData.append('document', postData);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    await Api.Post(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_POST,
      formData,
      onSubmitActions,
      history,
      TOAST_EMPLOYEE_OF_THE_MONTH_PUT_ERROR,
    );
  };

  return (
    <Layout showBackButton title={t('headerEmployeeOfTheMonthAddForm')}>
      <EmployeeOfTheMonthForm
        onSubmit={onSubmit}
        onImageUpload={onImageUpload}
        removeImageUpload={removeImageUpload}
      />
    </Layout>
  );
};
