import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Message } from 'constants/interfaces';
import { Department } from 'constants/interfaces';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDepartmentData } from 'hooks';

interface MessageFormProps {
  optionalMsg?: Message;
  submitAction: (data: any) => void;
}

const MessageForm = (props: MessageFormProps) => {
  const { departmentNameKeyMap: departments } = useDepartmentData();

  const { t, i18n } = useTranslation();
  const { register, handleSubmit, reset } = useForm({});
  const [department, setDepartment] = useState<string>('');

  const onSubmit = (data: any) => {
    if (data.department === '') {
      toast.error(i18n.t('addMessageAlertMustSelectDepartment'));
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
            data-testid="add-message-department-dropdown"
            className="form-select"
            id="select-menu"
            value={department}
            {...register('department')}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">{t('addMessageSelect')} </option>
            {Array.from(departments?.values()).map((dept: Department, index: number) => (
              <option key={index} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="" className="form-label">
          {t('addMessageTitle')}
        </label>
        <input
          data-testid="add-message-title-input"
          className="form-control"
          type="text"
          {...register('messageHeader')}
          defaultValue={props?.optionalMsg?.messageHeader || ''}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="" className="form-label">
          {t('addMessageBody')}
        </label>
        <textarea
          data-testid="add-message-body"
          className="form-control"
          {...register('messageBody')}
          cols={30}
          rows={10}
          defaultValue={props?.optionalMsg?.messageBody || ''}
        ></textarea>
      </div>

      <button data-testid="add-message-add-message-button" className="btn btn-primary">
        {t('addMessageSubmit')}
      </button>
    </form>
  );
};

export default MessageForm;
