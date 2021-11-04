import React, { useState } from "react";
import { RouteComponentProps} from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'

// import "./case_study_main_styles.css";

interface CaseStudyMainProps extends ElementStyleProps {
};

interface CaseStudyMainProps extends RouteComponentProps {};

export const CaseStudyMain = (props: CaseStudyMainProps) => {
  const [showForm, setShowForm] = useState(0);

  function refreshForm(formNum) {
    setShowForm(formNum);
  }

  return (
    <div className={'case-study-main '+ props.classes}>
        <SideBar/>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Header/>


            <div className="col-md-4">
                <button type="button" className="btn btn-primary btn-md">Add Case Study</button>
            </div>

             <div>
                 <form>
                   <div className="form-group col-md-6">
                     <label className = "font-weight-bold">Case Study Options</label>
                     <select className="form-control" id="CaseStudyType">
                       <option selected>Click to select a Case Study Type</option>
                       <option value = "Form1" onClick={() => refreshForm(1)}>Patient Story</option>
                       <option value = "Form2" onClick={() => refreshForm(2)}>Staff Recognition</option>
                       <option value = "Form3" onClick={() => refreshForm(3)}>Training Session</option>
                       <option value = "Form4" onClick={() => refreshForm(4)}>Equipment Received</option>
                       <option value = "Form5" onClick={() => refreshForm(5)}>Other Story</option>
                     </select>
                   </div>
                </form>
             </div>
             <div className={`form-group col-md-6 ${showForm === 1 ? "d-block" : "d-none"}`} id="Form1">
               <label className = "font-weight-bold">Patient Story Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label>Patient's Name</label>
                        <input className="form-control mb-2 mt-0" type="text"></input>
                    </div>
                     <div className="col-md-2">
                        <label>Patient Age</label>
                        <input className="form-control mb-2 mt-0" type="number"></input>
                     </div>
                </div>
                <label>Where is the patient from?</label>
                <input className="form-control mb-2 mt-0" type="text"></input>
                <label>Why did the patient choose to come to HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text"></input>
                <label>How long were they at HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text"></input>
                <label>What was their diagnosis?</label>
                <textarea className="form-control mb-2 mt-0"></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control mb-2 mt-0"></textarea>
             </div>
             <div className={`form-group col-md-6 ${showForm === 2 ? "d-block" : "d-none"}`} id="Form2">
               <label className = "font-weight-bold">Staff Recognition Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label>Staff Name</label>
                        <input className="form-control mb-2 mt-0" type="text"></input>
                    </div>
                    <div className="col-md-6">
                        <label>Role/Job Title</label>
                        <input className="form-control mb-2 mt-0" type="text"></input>
                    </div>
                </div>
                <label>Which department do they work in?</label>
                <input className="form-control mb-2 mt-0" type="text"></input>
                <label>How long have they been working at HCBH?</label>
                <input className="form-control mb-2 mt-0" type="text"></input>
                <label>What do they enjoy the most about working at HCBH?</label>
                <textarea className="form-control mb-2 mt-0"></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control mb-2 mt-0"></textarea>
             </div>
             <div className={`form-group col-md-6 ${showForm === 3 ? "d-block" : "d-none"}`} id="Form3">
               <label className = "font-weight-bold">Training Session Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label>Training Date</label>
                        <input className="form-control mb-2 mt-0" type="text"></input>
                    </div>
                    <div className="col-md-6">
                        <label>What was the training on?</label>
                        <input className="form-control mb-2 mt-0" type="text"></input>
                    </div>
                </div>
                <label>Who conducted training?</label>
                <input className="form-control" type="text"></input>
                <label>Who attended the training?</label>
                <textarea className="form-control"></textarea>
                <label>How will the training benefit HCBH and its staff?</label>
                <textarea className="form-control"></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control"></textarea>
             </div>
             <div className={`form-group col-md-6 ${showForm === 4 ? "d-block" : "d-none"}`} id="Form4">
               <label className = "font-weight-bold">Equipment Received Case Study</label>
                <div className="form-row">
                    <div className="col-md-6">
                        <label>What equipment was received?</label>
                        <input className="form-control mb-2 mt-0" type="text"></input>
                    </div>
                    <div className="col-md-6">
                        <label>Which department received it?</label>
                        <input className="form-control mb-2 mt-0" type="text"></input>
                    </div>
                </div>
                 <div className="form-row">
                    <div className="col-md-6">
                        <label>Who was the equipment from?</label>
                        <input className="form-control mb-2 mt-0" type="text"></input>
                    </div>
                    <div className="col-md-6">
                        <label>Was it donated or purchased?</label>
                        <input className="form-control mb-2 mt-0" type="text"></input>
                    </div>
                </div>
                <label>What does this new equipment do?</label>
                <textarea className="form-control"></textarea>
                <label>Case Study/Story</label>
                <textarea className="form-control"></textarea>
             </div>
             <div className={`form-group col-md-6 ${showForm === 5 ? "d-block" : "d-none"}`} id="Form5">
                 <label className = "font-weight-bold">Other Story Case Study</label>
                 <textarea className="form-control mb-2 mt-0" placeholder="Case Study/Story"></textarea>
             </div>



        <script>
        </script>

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