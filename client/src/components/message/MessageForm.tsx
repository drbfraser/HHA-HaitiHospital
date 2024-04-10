import { MessageJson, DepartmentJson as Department } from '@hha/common';
import { toast } from 'react-toastify';
import { useDepartmentData } from 'hooks';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MessageFormProps {
  message?: MessageJson;
  newForm?: boolean;
  submitAction: (data: any) => void;
}

const MessageForm = (props: MessageFormProps) => {
  const { submitAction, newForm, message } = props;
  const { departmentNameKeyMap: departments } = useDepartmentData();

  const { t, i18n } = useTranslation();
  const { register, handleSubmit, getFieldState } = useForm({});
  const [department, setDepartment] = useState<string>('');

  const onSubmit = (data: any) => {
    for (const key in data) {
      const dataValue = data[key];
      data[key] = typeof dataValue === 'string' ? dataValue.trim() : dataValue;
    }

    if (department === '') {
      toast.error(i18n.t('addMessageAlertMustSelectDepartment') as string);
      return;
    }

    if (newForm && (data.messageBody === '' || data.messageHeader === '')) {
      toast.error(i18n.t('addMessageAlertEmptyTitleBody') as string);
      return;
    }

    if (data.messageBody === '' && !getFieldState('messageBody').isTouched) {
      data.messageBody = message?.messageBody;
    }

    if (data.messageHeader === '' && !getFieldState('messageHeader').isTouched) {
      data.messageHeader = message?.messageHeader;
    }

    data.department = departments.get(department);
    submitAction(data);
  };

  // https://medium.com/@digruby/do-not-use-props-as-default-value-of-react-usestate-directly-818ee192f454
  useEffect(() => {
    setDepartment(message?.department?.name || '');
  }, [message]);

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
                {t(`departments.${dept.name}`)}
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
          defaultValue={message?.messageHeader || ''}
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
          defaultValue={message?.messageBody || ''}
        ></textarea>
      </div>

      <button data-testid="add-message-add-message-button" className="btn btn-primary">
        {t('addMessageSubmit')}
      </button>
    </form>
  );
};

export default MessageForm;
