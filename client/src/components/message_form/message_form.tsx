import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Message, emptyMessage } from 'constants/interfaces';
import { Department } from 'constants/interfaces';
import MockDepartmentApi from 'actions/MockDepartmentApi';
import initialDepartments from 'utils/json/departments.json';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface MessageFormProps {
  optionalMsg?: Message;
  submitAction: (data: any) => void;
}

const MessageForm = (props: MessageFormProps) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments.departments);
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm({});
  const [prefilledMsg, setPrefilledMsg] = useState<Message>(props.optionalMsg || emptyMessage);
  const [department, setDepartment] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    if (isMounted === true) {
      if (props.optionalMsg !== undefined) {
        setPrefilledMsg(props.optionalMsg);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [props.optionalMsg]);

  useEffect(() => {
    // For Future Devs: Replace MockDepartmentApi with Api
    setDepartments(MockDepartmentApi.getDepartments());
    setDepartment(prefilledMsg.departmentName);
    reset(prefilledMsg);
  }, [prefilledMsg, reset]);

  const onSubmit = (data: any) => {
    if (data.departmentName === '') {
      toast.error('Must select a department');
      return;
    }

    const currentDepartment: Department = MockDepartmentApi.getDepartmentById(
      data.departmentName,
    ) as Department;
    data.departmentId = currentDepartment.id;
    props.submitAction(data);

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-3 mb-3">
          <label htmlFor="select-menu" className="form-label">
            {t('addMessageDepartment')}
          </label>
          <select
            className="form-select"
            id="select-menu"
            value={department}
            {...register('departmentName')}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">{t('addMessageSelect')} </option>
            {departments.map((dept: Department, index: number) => {
              return dept.name !== 'General' ? (
                <option key={index} value={dept.name}>
                  {dept.name}
                </option>
              ) : (
                <></>
              );
            })}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="" className="form-label">
          {t('addMessageTitle')}
        </label>
        <input
          className="form-control"
          type="text"
          {...register('messageHeader')}
          defaultValue={prefilledMsg['messageHeader']}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="" className="form-label">
          {t('addMessageBody')}
        </label>
        <textarea
          className="form-control"
          {...register('messageBody')}
          cols={30}
          rows={10}
          defaultValue={prefilledMsg['messageBody']}
        ></textarea>
      </div>

      <button className="btn btn-primary">{t('addMessageSubmit')}</button>
    </form>
  );
};

export default MessageForm;
