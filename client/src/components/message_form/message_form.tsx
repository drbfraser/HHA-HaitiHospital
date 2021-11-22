import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import Axios from 'axios';
import { ElementStyleProps, Message, emptyMessage } from 'constants/interfaces';


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
    edit? : boolean,
}

function MessageForm(props: MessageFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        // resolver: yupResolver(messageFormSchema)
    });

    let prefilledMsg = props.optionalMsg;
    if (props.optionalMsg === undefined) {
        prefilledMsg = emptyMessage;
    }

    const postMessage = (async (data) => {
        const api = '/api/messageboard/';
    try {
        let response = await Axios.post(api, data);
        alert('success');

    }
    catch (e) {
        if (e.response.status === 401)
            alert("update message failed: unauthorized");
        else 
            alert("update message failed");
        console.log("update message failed ", e.response.status);
    }
    })

    const {id} = useParams<{id? : string}>();
    const updateMessage = async (data) => {
        const api = `api/messageboard/${id}`;
        try {
            let response = await Axios.put(api, data);
            alert('success');
        }
        catch (e) {
            if (e.response.status === 401)
                alert("update message failed: unauthorized");
            else 
                alert("update message failed");
            console.log("update message failed ", e.response.status);
        }
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
    
        data.date = Date();
        if (props.edit === true)
            updateMessage(data);
        else
            postMessage(data);
        reset();
        history.push('/messageBoard')
    }

    return (

    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">

            <div className="col-md-2 mb-3">
                <label htmlFor="" className="form-label">User ID</label>
                <input className="form-control" 
                type="number" 
                {...register("authorId")} />
            </div>

            <div className="col-md-3 mb-3">
                <label htmlFor="" className="form-label">Department</label>
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
            <label htmlFor="" className="form-label">Title</label>
            <input className="form-control" type="text" {...register("messageHeader")} 
            defaultValue = {prefilledMsg["messageHeader"]}/>
        </div>

        <div className="mb-3">
            <label htmlFor="" className="form-label">Body</label>
            <textarea 
                className="form-control" 
                {...register("messageBody")} 
                cols={30} rows={10}
                defaultValue = {prefilledMsg["messageBody"]}>
            </textarea>
        </div>

        <button className="btn btn-primary">Submit</button>

    </form>
    );
}


export default MessageForm;