import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { ElementStyleProps, Message, emptyMessage } from 'constants/interfaces';

import {useTranslation} from "react-i18next";


const getDepartmentId = (department: any) => {
    switch (department) {
    case 'NICUPaeds':
        return 1;

    case 'CommunityHealth':
        return 2;

    case 'Rehab':
        return 3;

    case 'Maternity':
        return 4;

    default:
        return 0;
    }
}

interface MessageFormProps extends ElementStyleProps{
    optionalMsg? : Message, 
    submitAction: (data) => void,
}

function MessageForm(props: MessageFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        // resolver: yupResolver(messageFormSchema)
    });

    let prefilledMsg = props.optionalMsg;
    if (props.optionalMsg === undefined) {
        prefilledMsg = emptyMessage;
    }

    const history = useHistory();
    const onSubmit = (data: any) => {
        if (data.departmentName === "") {
            alert("Must select a department");
            return;
        }
    
        if (getDepartmentId(data.departmentName) !== 0) {
            data.departmentId = getDepartmentId(data.departmentName);
        }
    
        props.submitAction(data);

        reset();
        history.push('/messageBoard')
    }
    const {t, i18n} = useTranslation();
    
    return (

    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">

            <div className="col-md-3 mb-3">
                <label htmlFor="" className="form-label">{t("addMessageDepartment")}</label>
                <select className="form-select" {...register("departmentName")}>
                    <option value=""> Select </option>
                    <option value="NICUPaeds">NICU/Paeds</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Rehab">Rehabilitation</option>
                    <option value="CommunityHealth">Community Health</option>
                </select>
            </div>

        </div>

        <div className="mb-3">
            <label htmlFor="" className="form-label">{t("addMessageTitle")}</label>
            <input className="form-control" type="text" {...register("messageHeader")} 
            defaultValue = {prefilledMsg["messageHeader"]}/>
        </div>

        <div className="mb-3">
            <label htmlFor="" className="form-label">{t("addMessageBody")}</label>
            <textarea 
                className="form-control" 
                {...register("messageBody")} 
                cols={30} rows={10}
                defaultValue = {prefilledMsg["messageBody"]}>
            </textarea>
        </div>

        <button className="btn btn-primary">{t("addMessageSubmit")}</button>

    </form>
    );
}


export default MessageForm;