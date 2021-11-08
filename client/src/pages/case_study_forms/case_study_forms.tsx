import React, { useState } from "react";
import { RouteComponentProps} from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'

// import "./case_study_main_styles.css";

interface CaseStudyMainProps extends ElementStyleProps {
};

interface CaseStudyMainProps extends RouteComponentProps {};

export const CaseStudyForm = (props: CaseStudyMainProps) => {
  const [formOption, setformOption] = useState("");

  function refreshForm(formNum) {
    setformOption(formNum);
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
                       <option value = "Patient Story" >Patient Story</option>
                       <option value = "Staff Recognition" >Staff Recognition</option>
                       <option value = "Training Session" >Training Session</option>
                       <option value = "Equipment Received" >Equipment Received</option>
                       <option value = "Other Story" >Other Story</option>
                     </select>
                   </div>
                </form>
             </div>
            <form>
             <div className={`form-group col-md-6 ${formOption === "Patient Story" ? "d-block" : "d-none"}`} id="Form1">
               <label className = "font-weight-bold">Patient Story Case Study</label>
                <div className="form-row">
                    <div className="col-md-8">
                        <label>Patient's Name</label>
                        <input className="form-control mb-2 mt-0" type="text" required></input>
                    </div>
                     <div className="col-md-4">
                        <label>Patient Age</label>
                        <input className="form-control mb-2 mt-0" type="number" required></input>
                     </div>
                </div>
                <label>Where is the patient from?</label>
                <input className="form-control mb-2 mt-0" type="text" required></input>
                <label>Why did the patient choose to come to HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text" required></input>
                <label>How long were they at HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text" required></input>
                <label>What was their diagnosis?</label>
                <textarea className="form-control mb-2 mt-0" required></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control mb-2 mt-0" required></textarea>
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
            <form>
             <div className={`form-group col-md-6 ${formOption === "Staff Recognition" ? "d-block" : "d-none"}`} id="Form2">
               <label className = "font-weight-bold">Staff Recognition Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label>Staff Name</label>
                        <input className="form-control mb-2 mt-0" type="text" required></input>
                    </div>
                    <div className="col-md-6">
                        <label>Role/Job Title</label>
                        <input className="form-control mb-2 mt-0" type="text" required></input>
                    </div>
                </div>
                <label>Which department do they work in?</label>
                <input className="form-control mb-2 mt-0" type="text" required></input>
                <label>How long have they been working at HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text" required></input>
                <label>What do they enjoy the most about working at HCBH?</label>
                <textarea className="form-control mb-2 mt-0" required></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control mb-2 mt-0" required></textarea>
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
            <form>
             <div className={`form-group col-md-6 ${formOption === "Training Session" ? "d-block" : "d-none"}`} id="Form3">
               <label className = "font-weight-bold">Training Session Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label>Training Date</label>
                        <input className="form-control mb-2 mt-0" type="text" required></input>
                    </div>
                    <div className="col-md-6">
                        <label>What was the training on?</label>
                        <input className="form-control mb-2 mt-0" type="text" required></input>
                    </div>
                </div>
                <label>Who conducted training?</label>
                <input className="form-control" type="text" required></input>
                <label>Who attended the training?</label>
                <textarea className="form-control" required></textarea>
                <label>How will the training benefit HCBH and its staff?</label>
                <textarea className="form-control" required></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control" required></textarea>
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
            <form>
             <div className={`form-group col-md-6 ${formOption === "Equipment Received" ? "d-block" : "d-none"}`} id="Form4">
               <label className = "font-weight-bold">Equipment Received Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label>What equipment was received?</label>
                        <input className="form-control mb-2 mt-0" type="text" required></input>
                    </div>
                    <div className="col-md-6">
                        <label>Which department received it?</label>
                        <input className="form-control mb-2 mt-0" type="text" required></input>
                    </div>
                </div>
                 <div className="form-row">
                    <div className="col-md-6">
                        <label>Who was the equipment from?</label>
                        <input className="form-control mb-2 mt-0" type="text" required></input>
                    </div>
                    <div className="col-md-6">
                        <label>Was it donated or purchased?</label>
                        <input className="form-control mb-2 mt-0" type="text" required></input>
                    </div>
                </div>
                <label>What does this new equipment do?</label>
                <textarea className="form-control" required></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control" required></textarea>
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
            <form>
            <div className={`form-group col-md-6 ${formOption === "Other Story" ? "d-block" : "d-none"}`} id="Form5">
                <label className = "font-weight-bold">Other Story Case Study</label>
                <textarea className="form-control mb-2 mt-0" placeholder="Case Study/Story" required></textarea>
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