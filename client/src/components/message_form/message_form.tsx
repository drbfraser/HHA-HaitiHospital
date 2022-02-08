import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Message, emptyMessage, DepartmentName, getDepartmentId} from 'constants/interfaces';

import {useTranslation} from "react-i18next";

interface MessageFormProps {
    optionalMsg? : Message, 
    submitAction: (data) => void,
}

function MessageForm(props: MessageFormProps) {

    const {t} = useTranslation();
    const { register, handleSubmit, reset } = useForm({
    });

    
    const [ prefilledMsg, setPrefilledMsg ] = useState<Message>(props.optionalMsg || emptyMessage);
    const [ department, setDepartment ] = useState<string>('')

    useEffect(() => {
        let isMounted = true;
        if (isMounted === true) {
            if (props.optionalMsg !== undefined) {
                setPrefilledMsg(props.optionalMsg);
            }
        } 

        return function leaveSite() {
            isMounted = false
        }
    }, [props.optionalMsg])

    useEffect(() => {
        setDepartment(prefilledMsg.departmentName);
        reset(prefilledMsg);
    }, [prefilledMsg, reset])


    const onSubmit = (data: any) => {
        if (data.departmentName === "") {
            alert("Must select a department");
            return;
        }
    
        data.departmentId = getDepartmentId(data.departmentName);
        props.submitAction(data);

        reset();
    }


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
            {Object.values(DepartmentName).map((deptName, index) => {
              return (
                <option value={deptName} key={index}>
                  {deptName}
                </option>
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
}

export default MessageForm;
