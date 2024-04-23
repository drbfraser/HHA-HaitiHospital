import { History } from 'history';
import Layout from 'components/layout';
import { useDepartmentData } from 'hooks';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EmployeeOfTheMonthForm } from 'components/employee_of_the_month/EmployeeOfTheMonthForm';
import { EmployeeOfTheMonthJson } from '@hha/common';
import { addEotm } from 'api/eotm';

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

  const toFormData = (data: any) => {
    const formData = new FormData();
    data.department = departments.get(data.department);
    [data.awardedYear, data.awardedMonth] = data.awardedMonth.split('-'); // ex: 2023-08
    let postData = JSON.stringify(data);
    formData.append('document', postData);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    return formData;
  };

  const onSubmit = async (data: any) => {
    const formData = toFormData(data);
    addEotm(formData, onSubmitActions, history);
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
