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

const setMap = (data: Department[]): Map<string, Department> => {
  try {
    let departmentMap = new Map<string, Department>();
    Object.values(data).forEach((dept: Department) => {
      departmentMap.set(dept.name, dept);
    });
    return departmentMap;
  } catch (error: any) {
    return new Map<string, Department>();
  }
};

const MessageForm = (props: MessageFormProps) => {
  const [departments, setDepartments] = useState<Map<string, Department>>(
    setMap(initialDepartments.departments),
  );
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm({});
  const [prefilledMsg, setPrefilledMsg] = useState<Message>(props.optionalMsg || emptyMessage);
  const [department, setDepartment] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (props.optionalMsg !== undefined) {
        setPrefilledMsg(props.optionalMsg);
        setDepartments(setMap(MockDepartmentApi.getDepartments()));
      }
    }

    return () => {
      isMounted = false;
    };
  }, [props.optionalMsg, department]);

  const onSubmit = (data: any) => {
    if (data.department === '') {
      toast.error('Must select a department');
      return;
    }
    data.department = departments.get(data.department);
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
            {...register('department')}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">{t('addMessageSelect')} </option>
            {Array.from(departments.values()).map((dept: Department, index: number) => {
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
