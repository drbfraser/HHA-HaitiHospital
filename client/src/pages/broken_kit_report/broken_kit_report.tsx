import { useState, useRef } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import {BiomechModel, bioMechEnum}  from "./BiomechModel"
import axios from 'axios';
import "./broken_kit_report.css";
import {useTranslation} from "react-i18next";

interface BrokenKitReport extends ElementStyleProps {
}

interface BrokenKitReport extends RouteComponentProps {}

export const BrokenKitReport = (props: BrokenKitReport) => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const { register, handleSubmit, reset } = useForm<BiomechModel>({});
  const failureMessageRef = useRef(null);

  const onSubmit = (data: any) => {
    var formData = new FormData();

    var postData = JSON.stringify(data);
    formData.append("document", postData);
    formData.append("file", selectedFile);

    axios.post('/api/biomech', formData).then(res => { 
      window.alert("Biomechanic report successfully submitted!");
      reset({});
      setSelectedFile(null);
      props.history.push("/biomechanic");
    }).catch(error =>{
      console.error('Something went wrong!', error.message);
      setSubmissionStatus("failure");
      failureMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    });

  }

    return (
        
  <div className ="broken_kit">
   <SideBar/>
      <main className="container-fluid main-region">
          <Header/>
          <div className="ml-3 mb-3 d-flex justify-content-start">
            <Link to="/biomechanic">
              <button type="button" className="btn btn-outline-dark">Back</button>
            </Link>
          </div>
          <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group col-md-6">
                  <label className = "font-weight-bold">Broken Kit Report</label>
                  <div>
                    <label htmlFor="Equipment Name" className = "form-label">Name of Equipment</label>
                    <input className="form-control mb-2 mt-0" type="text" id="Equipment Name" required {...register("equipmentName", {required: true })}></input>
                    <label htmlFor="Equipment Fault" className = "form-label">Fault with equipment</label>
                    <textarea className="form-control mb-2 mt-0" id="Equipment Fault" required {...register("equipmentFault", {required: true })}></textarea>
                    <label htmlFor="Equipment Priority" className = "form-label">Priority of Equipment</label>
                    <select className="form-select" id="Equipment Priority" aria-label="Default select example" required {...register("equipmentPriority", {required: true })}>
                        <option selected value="">Click to select Priority</option>
                        <option value={bioMechEnum.Urgent} >Urgent</option>
                        <option value={bioMechEnum.Important}>Important</option>
                        <option value={bioMechEnum.NonUrgent}>Non-Urgent</option>
                    </select>
                    <label htmlFor="customFile" className="form-label mt-2">Upload Image</label>
                    <input type="file" accept="image/*" className="form-control" id="customFile" onChange={(e) => setSelectedFile(e.target.files[0])}/>
                  </div>
                  <div>
                    <button className="btn btn-primary mt-4 " type="submit">Submit Form</button>
                  </div>
                </div>
              </form>
        </div>
      </main>
  
  </div>
    );
  };
  