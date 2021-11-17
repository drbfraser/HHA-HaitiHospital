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
  const caseStudyUrl = `/api/casestudies/${id}`;

  const getCaseStudy = async () => {
    const res = await axios.get(caseStudyUrl);
    setCaseStudy(res.data);
  }

  useEffect(() => {
    getCaseStudy();
  }, []);

  return (
    <div className={'case-study-main '+ props.classes}>
      <SideBar/>
      <main className="container">
        <Header/>
        <div className="col-lg-2 col-md-3 col-sm-4 col-4">
          <button type="button" className="btn btn-outline-dark" onClick={() => {
            props.history.push("/caseStudyMain");
          }}>Back</button>
        </div>
        <div className="ml-3 mb-5">
          {(caseStudy && caseStudy.caseStudyType === CaseStudyOptions.PatientStory) ? 
            <div>
              <h4 className="mt-3 mb-3 fw-bold">Patient Story Case Study</h4>
              <h6 className="fs-6 mb-5 lh-base">Author: {caseStudy.user ? caseStudy.user.name : null}</h6>
              <img src={`../${caseStudy.imgPath}`} className={`img-thumbnail img-fluid w-75 mt-3 mb-3 ${caseStudy.imgPath ? "d-block" : "d-none"}`} />
              <h6 className="fs-6 fw-bold lh-base">Patient's name</h6>
              <p className='fs-6 lh-base'>{caseStudy.patientStory.patientsName}</p>
              <h6 className="fs-6 fw-bold lh-base">Patient age</h6>
              <p className='fs-6 lh-base'>{caseStudy.patientStory.patientsAge}</p>
              <h6 className="fs-6 fw-bold lh-base">Where is the patient from?</h6>
              <p className='fs-6 lh-base'>{caseStudy.patientStory.whereIsThePatientFrom}</p>
              <h6 className="fs-6 fw-bold lh-base">Why did the patient choose to come to HCBH?</h6>
              <p className='fs-6 lh-base'>{caseStudy.patientStory.whyComeToHcbh}</p>
              <h6 className="fs-6 fw-bold lh-base">How long were they at HCBH?</h6>
              <p className='fs-6 lh-base'>{caseStudy.patientStory.howLongWereTheyAtHcbh}</p>
              <h6 className="fs-6 fw-bold lh-base">What was their diagnosis?</h6>
              <p className='fs-6 lh-base'>{caseStudy.patientStory.diagnosis}</p>
              <h6 className="fs-6 fw-bold lh-base">Case study/story</h6>
              <p className='fs-6 lh-base'>{caseStudy.patientStory.caseStudyStory}</p>
            </div>
          : null}

          {(caseStudy && caseStudy.caseStudyType === CaseStudyOptions.StaffRecognition) ? 
            <div>
              <h4 className="mt-3 mb-3 fw-bold">Staff Recognition Case Study</h4>
              <h6 className="fs-6 mb-5 lh-base">Author: {caseStudy.user ? caseStudy.user.name : null}</h6>
              <img src={`../${caseStudy.imgPath}`} className={`img-thumbnail img-fluid w-75 mt-3 mb-3 ${caseStudy.imgPath ? "d-block" : "d-none"}`} />
              <h6 className="fs-6 fw-bold lh-base">Staff name</h6>
              <p className='fs-6 lh-base'>{caseStudy.staffRecognition.staffName}</p>
              <h6 className="fs-6 fw-bold lh-base">Role / job title</h6>
              <p className='fs-6 lh-base'>{caseStudy.staffRecognition.jobTitle}</p>
              <h6 className="fs-6 fw-bold lh-base">Which department do they work in?</h6>
              <p className='fs-6 lh-base'>{caseStudy.staffRecognition.department}</p>
              <h6 className="fs-6 fw-bold lh-base">How long have they been working at HCBH?</h6>
              <p className='fs-6 lh-base'>{caseStudy.staffRecognition.howLongWorkingAtHcbh}</p>
              <h6 className="fs-6 fw-bold lh-base">What do they enjoy the most about working at HCBH?</h6>
              <p className='fs-6 lh-base'>{caseStudy.staffRecognition.mostEnjoy}</p>
              <h6 className="fs-6 fw-bold lh-base">Case study/story</h6>
              <p className='fs-6 lh-base'>{caseStudy.staffRecognition.caseStudyStory}</p>
            </div>
          : null}

          {(caseStudy && caseStudy.caseStudyType === CaseStudyOptions.TrainingSession) ? 
            <div>
              <h4 className="mt-3 mb-3 fw-bold">Training Session Case Study</h4>
              <h6 className="fs-6 mb-5 lh-base">Author: {caseStudy.user ? caseStudy.user.name : null}</h6>
              <img src={`../${caseStudy.imgPath}`} className={`img-thumbnail img-fluid w-75 mt-3 mb-3 ${caseStudy.imgPath ? "d-block" : "d-none"}`} />
              <h6 className="fs-6 fw-bold lh-base">Training date</h6>
              <p className='fs-6 lh-base'>{caseStudy.trainingSession.trainingDate}</p>
              <h6 className="fs-6 fw-bold lh-base">What was the training on?</h6>
              <p className='fs-6 lh-base'>{caseStudy.trainingSession.trainingOn}</p>
              <h6 className="fs-6 fw-bold lh-base">Who conducted training?</h6>
              <p className='fs-6 lh-base'>{caseStudy.trainingSession.whoConducted}</p>
              <h6 className="fs-6 fw-bold lh-base">Who attended the training?</h6>
              <p className='fs-6 lh-base'>{caseStudy.trainingSession.whoAttended}</p>
              <h6 className="fs-6 fw-bold lh-base">How will the training benefit HCBH and its staff?</h6>
              <p className='fs-6 lh-base'>{caseStudy.trainingSession.benefitsFromTraining}</p>
              <h6 className="fs-6 fw-bold lh-base">Case study/story</h6>
              <p className='fs-6 lh-base'>{caseStudy.trainingSession.caseStudyStory}</p>
            </div>
          : null}

          {(caseStudy && caseStudy.caseStudyType === CaseStudyOptions.EquipmentReceived) ? 
            <div>
              <h4 className="mt-3 mb-3 fw-bold">Equipment Received Case Study</h4>
              <h6 className="fs-6 mb-5 lh-base">Author: {caseStudy.user ? caseStudy.user.name : null}</h6>
              <img src={`../${caseStudy.imgPath}`} className={`img-thumbnail img-fluid w-75 mt-3 mb-3 ${caseStudy.imgPath ? "d-block" : "d-none"}`} />
              <h6 className="fs-6 fw-bold lh-base">What equipment was received?</h6>
              <p className='fs-6 lh-base'>{caseStudy.equipmentReceived.equipmentReceived}</p>
              <h6 className="fs-6 fw-bold lh-base">Which department received it?</h6>
              <p className='fs-6 lh-base'>{caseStudy.equipmentReceived.departmentReceived}</p>
              <h6 className="fs-6 fw-bold lh-base">Who was the equipment from?</h6>
              <p className='fs-6 lh-base'>{caseStudy.equipmentReceived.whoSentEquipment}</p>
              <h6 className="fs-6 fw-bold lh-base">Was it donated or purchased?</h6>
              <p className='fs-6 lh-base'>{caseStudy.equipmentReceived.purchasedOrDonated}</p>
              <h6 className="fs-6 fw-bold lh-base">What does this new equipment do?</h6>
              <p className='fs-6 lh-base'>{caseStudy.equipmentReceived.whatDoesEquipmentDo}</p>
              <h6 className="fs-6 fw-bold lh-base">Case study/story</h6>
              <p className='fs-6 lh-base'>{caseStudy.equipmentReceived.caseStudyStory}</p>
            </div>
          : null}

          {(caseStudy && caseStudy.caseStudyType === CaseStudyOptions.OtherStory) ? 
            <div>
              <h4 className="mt-3 mb-3 fw-bold">Other Story Case Study</h4>
              <h6 className="fs-6 mb-5 lh-base">Author: {caseStudy.user ? caseStudy.user.name : null}</h6>
              <img src={`../${caseStudy.imgPath}`} className={`img-thumbnail img-fluid w-75 mt-3 mb-3 ${caseStudy.imgPath ? "d-block" : "d-none"}`} /> 
              <h6 className="fs-6 fw-bold lh-base">Case study/story</h6>
              <p className='fs-6 lh-base'>{caseStudy.otherStory.caseStudyStory}</p>
            </div>
          : null}
        </div>
      </main>
    </div>
  )
}
