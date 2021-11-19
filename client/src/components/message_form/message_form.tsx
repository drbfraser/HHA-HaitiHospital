import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import Axios from 'axios';

const postMessage = (async (data) => {
    await Axios.post('/api/messageboard/', data).then(res => {
      console.log(res.data);
    }).catch(error => {
      console.error('Something went wrong!', error.response);
    });
})

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

const { register, handleSubmit, formState: { errors }, reset } = useForm({
    // resolver: yupResolver(messageFormSchema)
});

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

    postMessage(data);
    // console.log(data);
    reset();
    history.push('/messageBoard')
}

function MessageForm() {
    return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">

            <div className="col-md-2 mb-3">
                <label htmlFor="" className="form-label">User ID</label>
                <input className="form-control" type="number" {...register("authorId")} />
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
            <input className="form-control" type="text" {...register("messageHeader")} />
        </div>

        <div className="mb-3">
            <label htmlFor="" className="form-label">Body</label>
            <textarea className="form-control" {...register("messageBody")} cols={30} rows={10}></textarea>
        </div>

        <button className="btn btn-primary">Submit</button>

    </form>
    );
}


export default MessageForm;