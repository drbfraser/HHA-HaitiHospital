import {
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT,
} from 'constants/endpoints';
import {
  EmployeeOfTheMonth,
  EmployeeOfTheMonth as EmployeeOfTheMonthModel,
  EmployeeViewParams,
  isNonEmptyObject,
} from './typing';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import {
  TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR,
  TOAST_EMPLOYEE_OF_THE_MONTH_PUT_ERROR,
} from 'constants/toastErrorMessages';
import { useEffect, useState } from 'react';
import Api from '../../actions/Api';
import { EmployeeOfTheMonthForm } from 'components/employee_of_the_month/EmployeeOfTheMonthForm';
import { History } from 'history';
import Layout from 'components/layout';
import { toast } from 'react-toastify';
import { useDepartmentData } from 'hooks';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ResponseMessage } from 'utils';

interface Props extends RouteComponentProps<EmployeeViewParams> {}

export const EmployeeOfTheMonthUpdateForm = (props: Props) => {
  const { departmentNameKeyMap: departments } = useDepartmentData();
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [employeeOfTheMonth, setEmployeeOfTheMonth] = useState<EmployeeOfTheMonth>();
  const { reset } = useForm<EmployeeOfTheMonthModel>({});
  const [imageIsUpdated, setImageIsUpdated] = useState<boolean>(false);
  const history: History = useHistory<History>();

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
  }, [history, props.match.params]);

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

  const onSubmit = async (data: any) => {
    let formData = new FormData();
    data.department = departments.get(data.department);
    [data.awardedYear, data.awardedMonth] = data.awardedMonth.split('-'); // ex: 2023-08
    data.imageIsUpdated = imageIsUpdated.toString();
    let postData = JSON.stringify(data);

    formData.append('document', postData);
    if (imageIsUpdated && selectedFile) {
      formData.append('file', selectedFile);
    }

    await Api.Put(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT,
      formData,
      onSubmitActions,
      history,
      ResponseMessage.getMsgUpdateEotmFailed(),
      undefined,
      ResponseMessage.getMsgUpdateEotmOk(),
    );
  };

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
