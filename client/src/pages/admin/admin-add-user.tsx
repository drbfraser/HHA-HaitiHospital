import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps, Link, useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { ElementStyleProps, User, Role, DepartmentName } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import axios from 'axios';

import "./admin.css";

interface AdminProps extends ElementStyleProps {
}

export const AddUserForm = (props: AdminProps) => {
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [role, setRole] = useState(Role.User as string);

  const { register, handleSubmit, reset, unregister } = useForm<User>({});

  const failureMessageRef = useRef(null); 
  const history = useHistory();

  const onSubmit = (data: any) => {

    axios.post('/api/users', data).then(res => {
      console.log(res.data);
      reset({});
      history.push("/admin");
    }).catch(error =>{
      console.error('Something went wrong!', error.message);
      setSubmissionStatus("failure");
      failureMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    });

  }

  return (
    <div className={"admin "+ props.classes}>
      <SideBar/>

      <main className="container-fluid main-region">
        <Header/>

        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to="/admin"><button type="button" className="btn btn-outline-dark">Back</button></Link>
        </div>

        <div className="col-md-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" autoComplete="new-password" required {...register("username", {required: true})}></input>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" autoComplete="new-password" required {...register("password", {required: true})}></input>
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" required {...register("name", {required: true})}></input>
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select className="form-select" id="role" required {...register("role", {required: true})} onChange={(e)=>{setRole(e.target.value);unregister("department")}}>
                {/* <option selected>Select user's role</option> */}
                <option value={Role.User}>{Role.User}</option>
                <option value={Role.Admin}>{Role.Admin}</option>
                <option value={Role.MedicalDirector}>{Role.MedicalDirector}</option>
                <option value={Role.HeadOfDepartment}>{Role.HeadOfDepartment}</option>
              </select>
            </div>
            {role === Role.User || role === Role.HeadOfDepartment ? 
              <div className="mb-3">
                <label htmlFor="department" className="form-label">Department</label>
                <select className="form-select" id="department" required {...register("department", {required: true})}>
                  {/* <option selected>Select user's department</option> */}
                  {/* {
                    (Object.keys(DepartmentName) as (keyof typeof DepartmentName)[]).map((key) => (
                      <option value="1">{key}</option>
                    ))
                  } */}
                  <option value={DepartmentName.NicuPaeds}>{DepartmentName.NicuPaeds}</option>
                  <option value={DepartmentName.Maternity}>{DepartmentName.Maternity}</option>
                  <option value={DepartmentName.Rehab}>{DepartmentName.Rehab}</option>
                  <option value={DepartmentName.CommunityHealth}>{DepartmentName.CommunityHealth}</option>
                </select>
              </div>
            : null}
            <div className="mt-5 mb-5 d-flex justify-content-center">
              <button type="submit" className="btn btn-dark col-6">Submit</button>
            </div>
          </form>
          
          <div className={`alert alert-danger ${submissionStatus === "failure" ? "d-block" : "d-none"}`} role="alert" ref={failureMessageRef}>
            An error occurred during the submission. Please try again.
          </div>
        </div>
      </main>

    </div>
  );
};
