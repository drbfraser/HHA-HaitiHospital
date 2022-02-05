import { useEffect, useState } from 'react';
import { RouteComponentProps, useLocation, Link } from 'react-router-dom';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import axios from 'axios';
import { CaseStudyOptions, CaseStudyModel } from '../case_study_forms/CaseStudies';
import { useTranslation } from 'react-i18next';

interface CaseStudyViewProps extends RouteComponentProps {}

export const CaseStudyView = (props: CaseStudyViewProps) => {
  const [caseStudy, setCaseStudy] = useState({} as any);
  const id = useLocation().pathname.split('/')[3];
  const caseStudyUrl = `/api/case-studies/${id}`;

  const getCaseStudy = async () => {
    const res = await axios.get(caseStudyUrl);
    setCaseStudy(res.data);
  };

  useEffect(() => {
    getCaseStudy();
  }, []);

  const { t: translateText } = useTranslation();

  return (
    <div className={'case-study-main'}>
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 d-flex justify-content-start">
          <Link to="/case-study">
            <button type="button" className="btn btn-outline-dark">
              {translateText('caseStudyFormBack')}
            </button>
          </Link>
        </div>
        <div className="mb-5 col-lg-6 col-md-8 col-sm-10 col-12">
          {caseStudy !== {} && caseStudy.caseStudyType === CaseStudyOptions.PatientStory ? (
            <div>
              <h4 className="mt-3 mb-3 fw-bold">
                {translateText('caseStudyFormPatientStoryCaseStudy')}
              </h4>
              <h6 className="fs-6 lh-base">
                {translateText('caseStudyViewAuthor')}{' '}
                {caseStudy.user ? caseStudy.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 mb-5 lh-base">
                {translateText('caseStudyViewDate')}{' '}
                {new Date(caseStudy.createdAt).toLocaleDateString('en-US', {
                  timeZone: 'America/Los_Angeles',
                })}
              </h6>
              <img
                src={`../../${caseStudy.imgPath}`}
                className={`img-thumbnail img-fluid mt-3 mb-3 ${
                  caseStudy.imgPath ? 'd-block' : 'd-none'
                }`}
              />
              <h6 className="fs-6 fw-bold lh-base">{translateText('caseStudyFormPatientName')}</h6>
              <p className="fs-6 lh-base text-break">{caseStudy.patientStory.patientsName}</p>
              <h6 className="fs-6 fw-bold lh-base">{translateText('caseStudyFormPatientAge')}</h6>
              <p className="fs-6 lh-base text-break">{caseStudy.patientStory.patientsAge}</p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWherePatientFrom')}
              </h6>
              <p className="fs-6 lh-base text-break">
                {caseStudy.patientStory.whereIsThePatientFrom}
              </p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhyPatientChooseHCBH')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.patientStory.whyComeToHcbh}</p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormHowLongAtHCBH')}
              </h6>
              <p className="fs-6 lh-base text-break">
                {caseStudy.patientStory.howLongWereTheyAtHcbh}
              </p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhatWasTheirDiagnosis')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.patientStory.diagnosis}</p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormCaseStudy/Story')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.patientStory.caseStudyStory}</p>
            </div>
          ) : null}

          {caseStudy !== {} && caseStudy.caseStudyType === CaseStudyOptions.StaffRecognition ? (
            <div>
              <h4 className="mt-3 mb-3 fw-bold">
                {translateText('caseStudyFormStaffRecognitionCaseStudy')}
              </h4>
              <h6 className="fs-6 lh-base">
                Author: {caseStudy.user ? caseStudy.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 mb-5 lh-base">
                Date:{' '}
                {new Date(caseStudy.createdAt).toLocaleDateString('en-US', {
                  timeZone: 'America/Los_Angeles',
                })}
              </h6>
              <img
                src={`../../${caseStudy.imgPath}`}
                className={`img-thumbnail img-fluid mt-3 mb-3 ${
                  caseStudy.imgPath ? 'd-block' : 'd-none'
                }`}
              />
              <h6 className="fs-6 fw-bold lh-base">{translateText('caseStudyFormStaffName')}</h6>
              <p className="fs-6 lh-base text-break">{caseStudy.staffRecognition.staffName}</p>
              <h6 className="fs-6 fw-bold lh-base">{translateText('caseStudyFormRoleJobTitle')}</h6>
              <p className="fs-6 lh-base text-break">{caseStudy.staffRecognition.jobTitle}</p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhichDepartmentWorkIn')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.staffRecognition.department}</p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormHowLongHaveBeenWorkingHCBH')}
              </h6>
              <p className="fs-6 lh-base text-break">
                {caseStudy.staffRecognition.howLongWorkingAtHcbh}
              </p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhatEnjoyTheMostAtHCBH')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.staffRecognition.mostEnjoy}</p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormCaseStudy/Story')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.staffRecognition.caseStudyStory}</p>
            </div>
          ) : null}

          {caseStudy !== {} && caseStudy.caseStudyType === CaseStudyOptions.TrainingSession ? (
            <div>
              <h4 className="mt-3 mb-3 fw-bold">
                {translateText('caseStudyFormTrainingSessionCaseStudy')}
              </h4>
              <h6 className="fs-6 lh-base">
                Author: {caseStudy.user ? caseStudy.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 mb-5 lh-base">
                Date:{' '}
                {new Date(caseStudy.createdAt).toLocaleDateString('en-US', {
                  timeZone: 'America/Los_Angeles',
                })}
              </h6>
              <img
                src={`../../${caseStudy.imgPath}`}
                className={`img-thumbnail img-fluid mt-3 mb-3 ${
                  caseStudy.imgPath ? 'd-block' : 'd-none'
                }`}
              />
              <h6 className="fs-6 fw-bold lh-base">{translateText('caseStudyFormTrainingDate')}</h6>
              <p className="fs-6 lh-base text-break">
                {new Date(caseStudy.trainingSession.trainingDate).toLocaleDateString('en-US', {
                  timeZone: 'America/Los_Angeles',
                })}
              </p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhatWasTrainingOn')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.trainingSession.trainingOn}</p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhoConductedTraining')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.trainingSession.whoConducted}</p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhoAttendedTraining')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.trainingSession.whoAttended}</p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormHowWillTrainingBenefitHCBH')}
              </h6>
              <p className="fs-6 lh-base text-break">
                {caseStudy.trainingSession.benefitsFromTraining}
              </p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormCaseStudy/Story')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.trainingSession.caseStudyStory}</p>
            </div>
          ) : null}

          {caseStudy !== {} && caseStudy.caseStudyType === CaseStudyOptions.EquipmentReceived ? (
            <div>
              <h4 className="mt-3 mb-3 fw-bold">
                {translateText('caseStudyFormEquipmentReceivedCaseStudy')}
              </h4>
              <h6 className="fs-6 lh-base">
                Author: {caseStudy.user ? caseStudy.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 mb-5 lh-base">
                Date:{' '}
                {new Date(caseStudy.createdAt).toLocaleDateString('en-US', {
                  timeZone: 'America/Los_Angeles',
                })}
              </h6>
              <img
                src={`../../${caseStudy.imgPath}`}
                className={`img-thumbnail img-fluid mt-3 mb-3 ${
                  caseStudy.imgPath ? 'd-block' : 'd-none'
                }`}
              />
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhatEquipmentWasReceived')}
              </h6>
              <p className="fs-6 lh-base text-break">
                {caseStudy.equipmentReceived.equipmentReceived}
              </p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhichDepartmentReceivedIt')}
              </h6>
              <p className="fs-6 lh-base text-break">
                {caseStudy.equipmentReceived.departmentReceived}
              </p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhoWasEquipmentFrom')}
              </h6>
              <p className="fs-6 lh-base text-break">
                {caseStudy.equipmentReceived.whoSentEquipment}
              </p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWasItDonatedOrPurchased')}
              </h6>
              <p className="fs-6 lh-base text-break">
                {caseStudy.equipmentReceived.purchasedOrDonated}
              </p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormWhatDoesThisNewEquipmentDo')}
              </h6>
              <p className="fs-6 lh-base text-break">
                {caseStudy.equipmentReceived.whatDoesEquipmentDo}
              </p>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormCaseStudy/Story')}
              </h6>
              <p className="fs-6 lh-base text-break">
                {caseStudy.equipmentReceived.caseStudyStory}
              </p>
            </div>
          ) : null}

          {caseStudy !== {} && caseStudy.caseStudyType === CaseStudyOptions.OtherStory ? (
            <div>
              <h4 className="mt-3 mb-3 fw-bold">
                {translateText('caseStudyFormOtherStoryCaseStudy')}
              </h4>
              <h6 className="fs-6 lh-base">
                Author: {caseStudy.user ? caseStudy.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 mb-5 lh-base">
                Date:{' '}
                {new Date(caseStudy.createdAt).toLocaleDateString('en-US', {
                  timeZone: 'America/Los_Angeles',
                })}
              </h6>
              <img
                src={`../../${caseStudy.imgPath}`}
                className={`img-thumbnail img-fluid mt-3 mb-3 ${
                  caseStudy.imgPath ? 'd-block' : 'd-none'
                }`}
              />
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormCaseStudy/Story')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.otherStory.caseStudyStory}</p>
            </div>
          ) : null}
        </div>
        {caseStudy !== {} && document.documentElement.scrollHeight > window.innerHeight ? (
          <div className="ml-3 mb-5 d-flex justify-content-start">
            <Link to="/case-study">
              <button type="button" className="btn btn-outline-dark">
                {translateText('caseStudyFormBack')}
              </button>
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
};
