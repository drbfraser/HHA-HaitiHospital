import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps, Link, useHistory, useLocation } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { ElementStyleProps, User, Role, DepartmentName } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import axios from 'axios';

import "./admin.css";

interface AdminProps extends ElementStyleProps {
}

export const EditUserForm = (props: AdminProps) => {
  const [user, setUser] = useState({} as User);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [role, setRole] = useState(null);
  const [department, setDepartment] = useState(null);

  const { register, handleSubmit, reset, unregister } = useForm<User>({});

  const failureMessageRef = useRef(null); 
  const history = useHistory();

  const id = useLocation().pathname.split('/')[2];
  const userUrl = `/api/users/${id}`;

  const getUser = async () => {
    try {
      const res = await axios.get(userUrl);
      console.log(res);
      setUser(res.data);
      setRole(res.data.role);
      setDepartment(res.data.department);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getUser();
  }, [Object.keys(user).length])

  const onSubmit = (data: any) => {
    axios.put(userUrl, data).then(res => {
      console.log(res.data);
      reset({});
      history.push("/admin");
    }).catch(error => {
      handleSubmitFailure(error);
    });
  }

  const handleSubmitFailure = (error) => {
    try {
      if (error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response.data.details) {
        setErrorMessage(error.response.data.details[0].message);
      }
      setSubmissionStatus("failure");
      failureMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error('Something went wrong!', err);
    }
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
              <input type="text" className="form-control" id="username" autoComplete="new-password" defaultValue={user.username} required {...register("username")}></input>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <input type={passwordShown ? "text" : "password"} className="form-control" id="password" autoComplete="new-password" {...register("password")}></input>
                <div className="input-group-text">
                  <i onClick={() => setPasswordShown(true)} className={`${passwordShown ? "d-none" : "d-block"} btn btn-sm p-0 m-0 fa fa-eye-slash text-dark`}></i>
                  <i onClick={() => setPasswordShown(false)} className={`${passwordShown ? "d-block" : "d-none"} btn btn-sm p-0 m-0 fa fa-eye text-dark`}></i>
                </div>
              </div>
              <div id="passwordHelp" className="form-text">Leave blank to keep it unchanged</div>
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" defaultValue={user.name} required {...register("name")}></input>
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select className="form-select" id="role" value={role} required {...register("role")} onChange={(e)=>{setRole(e.target.value);unregister("department")}}>
                <option value="" selected disabled hidden>Select User's Role</option>
                <option value={Role.User}>{Role.User}</option>
                <option value={Role.Admin}>{Role.Admin}</option>
                <option value={Role.MedicalDirector}>{Role.MedicalDirector}</option>
                <option value={Role.HeadOfDepartment}>{Role.HeadOfDepartment}</option>
              </select>
            </div>
            {role === Role.User || role === Role.HeadOfDepartment ? 
              <div className="mb-3">
                <label htmlFor="department" className="form-label">Department</label>
                <select className="form-select" id="department" value={department} required {...register("department")} onChange={(e)=>{setDepartment(e.target.value)}}>
                  <option value="" selected disabled hidden>Select User's Department</option>
                  <option value={DepartmentName.NicuPaeds}>{DepartmentName.NicuPaeds}</option>
                  <option value={DepartmentName.Maternity}>{DepartmentName.Maternity}</option>
                  <option value={DepartmentName.Rehab}>{DepartmentName.Rehab}</option>
                  <option value={DepartmentName.CommunityHealth}>{DepartmentName.CommunityHealth}</option>
                </select>
              </div>
            : null}
            <div className="mt-5 mb-3 d-flex justify-content-center">
              <button type="submit" className="btn btn-dark col-6">Submit</button>
            </div>
          </form>
          
          <div className={`alert alert-danger ${submissionStatus === "failure" ? "d-block" : "d-none"}`} role="alert" ref={failureMessageRef}>
            An error occurred during the submission! {errorMessage}
          </div>
        </div>
      </main>

    </div>
  );
};
