import { useEffect, useState } from "react";
import { RouteComponentProps, useLocation } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import axios from 'axios';
import { CaseStudyOptions } from '../case_study_forms/CaseStudies';

interface CaseStudyViewProps extends ElementStyleProps {
}

interface CaseStudyViewProps extends RouteComponentProps {}

export const CaseStudyView = (props: CaseStudyViewProps) => {
  const [caseStudy, setCaseStudy] = useState(null);
  const id = useLocation().pathname.split('/')[2];
  // console.log(id);
  const caseStudyUrl = `/api/casestudies/${id}`;
  // console.log(caseStudyUrl);

  const getCaseStudy = async () => {
    const res = await axios.get(caseStudyUrl);
    setCaseStudy(res.data);
    // console.log(res.data);
  }

  useEffect(() => {
    getCaseStudy();
  });
  // console.log(caseStudy);

  return (
    <div className={'case-study-main '+ props.classes}>
      <SideBar/>
      <main className="container">
        <Header/>
        <div className="col-lg-2 col-md-3 col-sm-4 col-4">
          <button type="button" className="btn btn-primary btn-md" onClick={() => {
            props.history.push("/caseStudyMain");
          }}>Back</button>
        </div>

        {(caseStudy !== null && caseStudy.caseStudyType === CaseStudyOptions.PatientStory) ? 
          <div>
            <h2>Patient Story Case Study</h2>
            <img src={ `../${caseStudy.imgPath}` } />
            <h3>Patient's Name</h3>
            <text>{caseStudy.patientStory.patientsName}</text>
            <h3>Patient Age</h3>
            <text>{caseStudy.patientStory.patientsAge}</text>
            <h3>Where is the patient from?</h3>
            <text>{caseStudy.patientStory.whereIsThePatientFrom}</text>
            <h3>Why did the patient choose to come to HCBH?</h3>
            <text>{caseStudy.patientStory.whyComeToHcbh}</text>
            <h3>How long were they at HCBH?</h3>
            <text>{caseStudy.patientStory.howLongWereTheyAtHcbh}</text>
            <h3>What was their diagnosis?</h3>
            <text>{caseStudy.patientStory.diagnosis}</text>
            <h3>Case Study/Story</h3>
            <text>{caseStudy.patientStory.caseStudyStory}</text>
          </div>
        : null}

        {/* {(caseStudy !== null && caseStudy.caseStudyType === CaseStudyOptions.StaffRecognition) ? 
          <div>
            <h2>Patient Story Case Study</h2>
            <img src={ `../${caseStudy.imgPath}` } />
            <h3>Patient's Name</h3>
            <text>{caseStudy.patientStory.patientsName}</text>
            <h3>Patient Age</h3>
            <text>{caseStudy.patientStory.patientsAge}</text>
            <h3>Where is the patient from?</h3>
            <text>{caseStudy.patientStory.whereIsThePatientFrom}</text>
            <h3>Why did the patient choose to come to HCBH?</h3>
            <text>{caseStudy.patientStory.whyComeToHcbh}</text>
            <h3>How long were they at HCBH?</h3>
            <text>{caseStudy.patientStory.howLongWereTheyAtHcbh}</text>
            <h3>What was their diagnosis?</h3>
            <text>{caseStudy.patientStory.diagnosis}</text>
            <h3>Case Study/Story</h3>
            <text>{caseStudy.patientStory.caseStudyStory}</text>
          </div>
        : null} */}

        {(caseStudy !== null && caseStudy.caseStudyType === CaseStudyOptions.OtherStory) ? 
        <div>
          <div>
            <h2>Other Story Case Study</h2>
            <h3>Case Study/Story</h3>
            <text>{caseStudy.otherStory.caseStudyStory}</text>
          </div>
        </div>
        : null}
      </main>
    </div>
  )
}
