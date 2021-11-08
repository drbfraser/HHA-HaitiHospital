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
                       <option value = "1" >Patient Story</option>
                       <option value = "2" >Staff Recognition</option>
                       <option value = "3" >Training Session</option>
                       <option value = "4" >Equipment Received</option>
                       <option value = "5" >Other Story</option>
                     </select>
                   </div>
                </form>
             </div>
            <form>
             <div className={`form-group col-md-6 ${formOption === "1" ? "d-block" : "d-none"}`} id="Form1">
               <label className = "font-weight-bold">Patient Story Case Study</label>
                <div className="form-row">
                    <div className="col-md-8">
                        <label htmlFor="Patient Name">Patient's Name</label>
                        <input className="form-control mb-2 mt-0" type="text" id="Patient Name" required></input>
                    </div>
                     <div className="col-md-4">
                        <label htmlFor="Patient Age">Patient Age</label>
                        <input className="form-control mb-2 mt-0" type="number" id="Patient Age" required></input>
                     </div>
                </div>
                <label htmlFor="Patient From">Where is the patient from?</label>
                <input className="form-control mb-2 mt-0" type="text" id="Patient From" required></input>
                <label htmlFor="Patient Choose">Why did the patient choose to come to HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text" id="Patient Choose" required></input>
                <label htmlFor="How long">How long were they at HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text" id="How long" required></input>
                <label htmlFor="Diagnosis">What was their diagnosis?</label>
                <textarea className="form-control mb-2 mt-0" id="Diagnosis" required></textarea>
                <label htmlFor="Case Study 1">Case Study/Story</label>
                <textarea className="form-control mb-2 mt-0" id="Case Study 1" required></textarea>
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
             <div className={`form-group col-md-6 ${formOption === "2" ? "d-block" : "d-none"}`} id="Form2">
               <label className = "font-weight-bold">Staff Recognition Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label htmlFor="Staff Name">Staff Name</label>
                        <input className="form-control mb-2 mt-0" type="text" id="Staff Name" required></input>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Role">Role/Job Title</label>
                        <input className="form-control mb-2 mt-0" type="text" id="Role" required></input>
                    </div>
                </div>
                <label htmlFor="Which dept work">Which department do they work in?</label>
                <input className="form-control mb-2 mt-0" type="text" id="Which dept work" required></input>
                <label htmlFor="How long working">How long have they been working at HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text" id="How long working" required></input>
                <label htmlFor="What enjoy">What do they enjoy the most about working at HCBH?</label>
                <textarea className="form-control mb-2 mt-0" id="What enjoy" required></textarea>
                <label htmlFor="Case Study 2">Case Study/Story</label>
                <textarea className="form-control mb-2 mt-0" id="Case Study 2" required></textarea>
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
             <div className={`form-group col-md-6 ${formOption === "3" ? "d-block" : "d-none"}`} id="Form3">
               <label className = "font-weight-bold">Training Session Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label htmlFor="Train Date">Training Date</label>
                        <input className="form-control mb-2 mt-0" type="text" id="Train Date" required></input>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Train On">What was the training on?</label>
                        <input className="form-control mb-2 mt-0" type="text" id="Train On" required></input>
                    </div>
                </div>
                <label htmlFor="Train Who">Who conducted training?</label>
                <input className="form-control" type="text" id="Train Who" required></input>
                <label htmlFor="Who attended">Who attended the training?</label>
                <textarea className="form-control" id="Who attended" required></textarea>
                <label htmlFor="How train">How will the training benefit HCBH and its staff?</label>
                <textarea className="form-control" id="How train" required></textarea>
                <label htmlFor="Case Study 3">Case Study/Story</label>
                <textarea className="form-control" id="Case Study 3" required></textarea>
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
             <div className={`form-group col-md-6 ${formOption === "4" ? "d-block" : "d-none"}`} id="Form4">
               <label className = "font-weight-bold">Equipment Received Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label htmlFor="What equipment">What equipment was received?</label>
                        <input className="form-control mb-2 mt-0" type="text" id="What equipment" required></input>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Which dept receive">Which department received it?</label>
                        <input className="form-control mb-2 mt-0" type="text" id="Which dept receive" required></input>
                    </div>
                </div>
                 <div className="form-row">
                    <div className="col-md-6">
                        <label htmlFor="Equipment from">Who was the equipment from?</label>
                        <input className="form-control mb-2 mt-0" type="text" id="Equipment from" required></input>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Donate/Purchase">Was it donated or purchased?</label>
                        <input className="form-control mb-2 mt-0" type="text" id="Donate/Purchase" required></input>
                    </div>
                </div>
                <label htmlFor="Equipment Purpose">What does this new equipment do?</label>
                <textarea className="form-control" id="Equipment Purpose" required></textarea>
                <label htmlFor="Case Study 4">Case Study/Story</label>
                <textarea className="form-control" id="Case Study 4" required></textarea>
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
            <div className={`form-group col-md-6 ${formOption === "5" ? "d-block" : "d-none"}`} id="Form5">
                <label className = "font-weight-bold">Other Story Case Study</label>
                <div>
                    <label htmlFor="Case Study 5">Case Study/Story</label>
                    <textarea className="form-control mb-2 mt-0" placeholder="Case Study/Story" id="Case Study 5" required></textarea>
                    <label className="form-label">Upload Image</label>
                    <input type="file" accept="image/*" className="form-control" id="customFile" />
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="invalidCheck5" required></input>
                        <label className="form-check-label" htmlFor="invalidCheck5"> This person has given permission to share their story and photo in HHA communications, including online platforms</label>
                    </div>
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