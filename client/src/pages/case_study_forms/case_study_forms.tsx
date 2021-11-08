import React, { useState } from "react";
import { RouteComponentProps} from "react-router-dom";
import { useForm } from 'react-hook-form';
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import { caseStudyModel } from "./CaseStudies"
import axios from 'axios';

// import "./case_study_main_styles.css";

interface CaseStudyMainProps extends ElementStyleProps {
};

interface CaseStudyMainProps extends RouteComponentProps {};

export const CaseStudyForm = (props: CaseStudyMainProps) => {
  const [formOption, setformOption] = useState("");

  function refreshForm(formNum) {
    setformOption(formNum);
  }

  const { register, handleSubmit, formState: { errors }, reset } = useForm<caseStudyModel>({});
  const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm<caseStudyModel>({});
  const { register: register3, handleSubmit: handleSubmit3, formState: { errors: errors3 }, reset: reset3 } = useForm<caseStudyModel>({});
  const { register: register4, handleSubmit: handleSubmit4, formState: { errors: errors4 }, reset: reset4 } = useForm<caseStudyModel>({});
  const { register: register5, handleSubmit: handleSubmit5, formState: { errors: errors5 }, reset: reset5 } = useForm<caseStudyModel>({});

  const onSubmit = (data: any) => {
    data.caseStudyType = parseInt(formOption) - 1;

    console.log(data);
    axios.post('/api/casestudies', data).then(res => {
        console.log(res.data);
    }).catch(error =>{
        console.error('Something went wrong!', error.response);
    });

    reset({});
  }

  return (
    <div className={'case-study-main '+ props.classes}>
        <SideBar/>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Header/>

            <div className="col-md-4">
                <button type="button" className="btn btn-primary btn-md" onClick={() => {
                    props.history.push("/caseStudyMain");
                }}>Back</button>
            </div>

             <div>
                 <form>
                   <div className="form-group col-md-6">
                     <label className = "font-weight-bold">Case Study Options</label>
                     <select className="form-control" id="CaseStudyType" onChange={(e)=> {
                                        const selectedForm = e.target.value; 
                                        setformOption(selectedForm);
                                        }}>
                       <option selected>Click to select a Case Study Type</option>
                       <option value = "1" >Patient Story</option>
                       <option value = "2" >Staff Recognition</option>
                       <option value = "3" >Training Session</option>
                       <option value = "4" >Equipment Received</option>
                       <option value = "5" >Other Story</option>
                     </select>
                   </div>
                </form>
             </div>
            <form onSubmit={handleSubmit(onSubmit)}>
             <div className={`form-group col-md-6 ${formOption === "1" ? "d-block" : "d-none"}`} id="Form1">
               <label className = "font-weight-bold">Patient Story Case Study</label>
                <div className="form-row">
                    <div className="col-md-8">
                        <label>Patient's Name</label>
                        <input className="form-control mb-2 mt-0" type="text" required {...register("patientStory.patientsName", {required: true})}></input>
                    </div>
                     <div className="col-md-4">
                        <label>Patient Age</label>
                        <input className="form-control mb-2 mt-0" type="number" required {...register("patientStory.patientsAge", {required: true})}></input>
                     </div>
                </div>
                <label>Where is the patient from?</label>
                <input className="form-control mb-2 mt-0" type="text" required {...register("patientStory.whereIsThePatientFrom", {required: true})}></input>
                <label>Why did the patient choose to come to HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text" required {...register("patientStory.whyComeToHCBH", {required: true})}></input>
                <label>How long were they at HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text" required {...register("patientStory.howLongWereTheyAtHCBHinDays", {required: true})}></input>
                <label>What was their diagnosis?</label>
                <textarea className="form-control mb-2 mt-0" required {...register("patientStory.diagnosis", {required: true})}></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control mb-2 mt-0" required {...register("patientStory.caseStudyStory", {required: true})}></textarea>
                <label className="form-label">Upload Image</label>
                <input type="file" accept="image/*" className="form-control" id="customFile"/>
                <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="invalidCheck1" required></input>
                    <label className="form-check-label" htmlFor="invalidCheck1"> This person has given permission to share their story and photo in HHA communications, including online platforms</label>
                </div>
                <div>
                <button className="btn btn-primary" type="submit">Submit form</button>
                </div>
             </div>
            </form>
            <form onSubmit={handleSubmit2(onSubmit)}>
             <div className={`form-group col-md-6 ${formOption === "2" ? "d-block" : "d-none"}`} id="Form2">
               <label className = "font-weight-bold">Staff Recognition Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label>Staff Name</label>
                        <input className="form-control mb-2 mt-0" type="text" required {...register2("staffRecognition.staffName", {required: true})}></input>
                    </div>
                    <div className="col-md-6">
                        <label>Role/Job Title</label>
                        <input className="form-control mb-2 mt-0" type="text" required {...register2("staffRecognition.jobTitle", {required: true})}></input>
                    </div>
                </div>
                <label>Which department do they work in?</label>
                <input className="form-control mb-2 mt-0" type="text" required {...register2("staffRecognition.department", {required: true})}></input>
                <label>How long have they been working at HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text" required {...register2("staffRecognition.howManyMonthsWorkingAtHCBH", {required: true})}></input>
                <label>What do they enjoy the most about working at HCBH?</label>
                <textarea className="form-control mb-2 mt-0" required {...register2("staffRecognition.mostEnjoy", {required: true})}></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control mb-2 mt-0" required {...register2("staffRecognition.caseStudyStory", {required: true})}></textarea>
                <label className="form-label">Upload Image</label>
                <input type="file" accept="image/*" className="form-control" id="customFile" />
                <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="invalidCheck2" required></input>
                    <label className="form-check-label" htmlFor="invalidCheck2"> This person has given permission to share their story and photo in HHA communications, including online platforms</label>
                </div>
                <div>
                <button className="btn btn-primary" type="submit">Submit form</button>
                </div>
             </div>
            </form>
            <form onSubmit={handleSubmit3(onSubmit)}>
             <div className={`form-group col-md-6 ${formOption === "3" ? "d-block" : "d-none"}`} id="Form3">
               <label className = "font-weight-bold">Training Session Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label>Training Date</label>
                        <input className="form-control mb-2 mt-0" type="text" required {...register3("trainingSession.trainingDate", {required: true})}></input>
                    </div>
                    <div className="col-md-6">
                        <label>What was the training on?</label>
                        <input className="form-control mb-2 mt-0" type="text" required {...register3("trainingSession.trainingOn", {required: true})}></input>
                    </div>
                </div>
                <label>Who conducted training?</label>
                <input className="form-control" type="text" required {...register3("trainingSession.whoConducted", {required: true})}></input>
                <label>Who attended the training?</label>
                <textarea className="form-control" required {...register3("trainingSession.whoAttended", {required: true})}></textarea>
                <label>How will the training benefit HCBH and its staff?</label>
                <textarea className="form-control" required {...register3("trainingSession.benefitsFromTraining", {required: true})}></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control" required {...register3("trainingSession.caseStudyStory", {required: true})}></textarea>
                <label className="form-label">Upload Image</label>
                <input type="file" accept="image/*" className="form-control" id="customFile" />
                <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="invalidCheck3" required></input>
                    <label className="form-check-label" htmlFor="invalidCheck3"> This person has given permission to share their story and photo in HHA communications, including online platforms</label>
                </div>
                <div>
                <button className="btn btn-primary" type="submit">Submit form</button>
                </div>
             </div>
            </form>
            <form onSubmit={handleSubmit4(onSubmit)}>
             <div className={`form-group col-md-6 ${formOption === "4" ? "d-block" : "d-none"}`} id="Form4">
               <label className = "font-weight-bold">Equipment Received Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label>What equipment was received?</label>
                        <input className="form-control mb-2 mt-0" type="text" required {...register4("equipmentReceived.equipmentReceived", {required: true})}></input>
                    </div>
                    <div className="col-md-6">
                        <label>Which department received it?</label>
                        <input className="form-control mb-2 mt-0" type="text" required {...register4("equipmentReceived.departmentIdReceived", {required: true})}></input>
                    </div>
                </div>
                 <div className="form-row">
                    <div className="col-md-6">
                        <label>Who was the equipment from?</label>
                        <input className="form-control mb-2 mt-0" type="text" required {...register4("equipmentReceived.whoSentEquipment", {required: true})}></input>
                    </div>
                    <div className="col-md-6">
                        <label>Was it donated or purchased?</label>
                        <input className="form-control mb-2 mt-0" type="text" required {...register4("equipmentReceived.purchasedOrDonated", {required: true})}></input>
                    </div>
                </div>
                <label>What does this new equipment do?</label>
                <textarea className="form-control" required {...register4("equipmentReceived.whatDoesEquipmentDo", {required: true})}></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control" required {...register4("equipmentReceived.caseStudyStory", {required: true})}></textarea>
                <label className="form-label">Upload Image</label>
                <input type="file" accept="image/*" className="form-control" id="customFile" />
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="invalidCheck4" required></input>
                    <label className="form-check-label" htmlFor="invalidCheck4"> This person has given permission to share their story and photo in HHA communications, including online platforms</label>
                </div>
                <div>
                <button className="btn btn-primary" type="submit">Submit form</button>
                </div>             
            </div>
            </form>
            <form onSubmit={handleSubmit5(onSubmit)}>
            <div className={`form-group col-md-6 ${formOption === "5" ? "d-block" : "d-none"}`} id="Form5">
                <label className = "font-weight-bold">Other Story Case Study</label>
                <textarea className="form-control mb-2 mt-0" placeholder="Case Study/Story" required {...register5("otherStory.caseStudyStory", {required: true})}></textarea>
                <label className="form-label">Upload Image</label>
                <input type="file" accept="image/*" className="form-control" id="customFile" />
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="invalidCheck5" required></input>
                    <label className="form-check-label" htmlFor="invalidCheck5"> This person has given permission to share their story and photo in HHA communications, including online platforms</label>
                </div>
                <div>
                <button className="btn btn-primary" type="submit">Submit form</button>
                </div>
            </div>
            </form>


   
        </main>

    </div>
  );
};



//
//                 <button className="caseTwo-button"
//                         onClick={() => {props.history.push("/caseStudyMain");}}>
//                 </button>
// onChange={(val) => setForm(this.value)}
//                 <button className="caseOne-button"
//                         onClick={() => {props.history.push("/caseStudyMain");}}>
//                 </button>
//                 <button className="case-study-more-button"
//                         onClick={() => {props.history.push("/caseStudyMain");}}>
//                 </button>
// function setForm(value: any) {

 //              if(value == "form1"){
   //                    document.getElementById('form1')!.style.display = 'hidden';
     //                  }
       //        else if (value == "form2"){

         //              }
           //}