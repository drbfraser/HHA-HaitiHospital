import { EmployeeViewParams } from './typing';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { EmployeeOfTheMonthForm } from 'components/employee_of_the_month/EmployeeOfTheMonthForm';
import { History } from 'history';
import Layout from 'components/layout';
import { toast } from 'react-toastify';
import { useDepartmentData } from 'hooks';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EmployeeOfTheMonthJson } from '@hha/common';
import { getEotmById, updateEotm } from 'api/eotm';

interface Props extends RouteComponentProps<EmployeeViewParams> {}

export const EmployeeOfTheMonthUpdateForm = (props: Props) => {
  const { departmentNameKeyMap: departments } = useDepartmentData();
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [employeeOfTheMonth, setEmployeeOfTheMonth] = useState<EmployeeOfTheMonthJson>();
  const { reset } = useForm<EmployeeOfTheMonthJson>({});
  const [imageIsUpdated, setImageIsUpdated] = useState<boolean>(false);
  const history: History = useHistory<History>();

  const onImageUpload = (item: File) => {
    setSelectedFile(item);
  };

  const removeImageUpload = () => {
    setSelectedFile(null);
  };

  const onSubmitActions = () => {
    toast.success(t('employeeOfTheMonthSuccessfullyUpdated'));
    reset({});
    setSelectedFile(null);
    history.push('/employee-of-the-month');
  };

  const toFormData = (data: any) => {
    const formData = new FormData();
    data.department = departments.get(data.department);
    [data.awardedYear, data.awardedMonth] = data.awardedMonth.split('-'); // ex: 2023-08
    data.imageIsUpdated = imageIsUpdated.toString();
    let postData = JSON.stringify(data);

    formData.append('document', postData);
    if (imageIsUpdated && selectedFile) {
      formData.append('file', selectedFile);
    }
    return formData;
  };

  const onSubmit = async (data: any) => {
    const formData = toFormData(data);
    updateEotm(formData, onSubmitActions, history);
  };

  const getEotm = useCallback(async () => {
    const { eotmId } = props.match.params;
    const eotm = await getEotmById(eotmId, history);
    if (eotm.length == 1) {
      setEmployeeOfTheMonth(eotm[0]);
    }
  }, [props.match.params, history]);

  useEffect(() => {
    getEotm();
  }, [getEotm]);

  return (
    <Layout showBackButton title={t('headerEmployeeOfTheMonthUpdateForm')}>
      <EmployeeOfTheMonthForm
        onSubmit={onSubmit}
        onImageUpload={onImageUpload}
        removeImageUpload={removeImageUpload}
        data={employeeOfTheMonth}
        setImageIsUpdated={() => setImageIsUpdated(true)}
      />
    </Layout>
  );
};
