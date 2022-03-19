import { useEffect, useState } from 'react';
import { CaseStudyOptions } from 'pages/case_study_forms/CaseStudies';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import ModalImage from 'components/popup_modal/popup_modal_image';
import './case_study_summary.css';
import { History } from 'history';
import Api from '../../actions/Api';
import { ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { timezone, language } from 'constants/timezones';

export const CaseStudySummary = ({ caseStudy }) => {
  const ALT_MESSAGE: string = 'Case Study...';
  const { t: translateText } = useTranslation();
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [caseStudyImage, setCaseStudyImage] = useState<string>('');
  const history: History = useHistory<History>();

  const onEnlargeImage = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setImageModal(true);
  };

  const onModalImageClose = () => {
    setImageModal(false);
  };

  const getCaseStudyImage = async () => {
    setCaseStudyImage(await Api.Image(ENDPOINT_IMAGE_BY_PATH(caseStudy.imgPath), history));
  };

  useEffect(() => {
    // Only execute once case study data has been successfully passed to this component
    if (caseStudy.imgPath !== undefined) getCaseStudyImage();
  }, [caseStudy]);

  return (
    <div className="case-study-container mb-5">
      <ModalImage
        show={imageModal}
        item={ALT_MESSAGE}
        image={caseStudyImage}
        onModalClose={onModalImageClose}
        history={history}
        location={undefined}
        match={undefined}
      ></ModalImage>
      <div className="case-study-subcontainer">
        {caseStudy !== {} && caseStudy.caseStudyType === CaseStudyOptions.PatientStory ? (
          <div style={{ display: 'flex', flex: '1 1 auto' }}>
            <div className="w-100 pr-2">
              <h2 className="mt-3 mb-3 fw-bold">
                {translateText('caseStudyFormPatientStoryCaseStudy')}
              </h2>
              <h6 className="fs-6 lh-base">
                {translateText('caseStudyViewAuthor')}{' '}
                {caseStudy.user ? caseStudy.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 lh-base">
                {translateText('caseStudyViewDate')}{' '}
                {new Date(caseStudy.createdAt).toLocaleDateString(language, {
                  timeZone: timezone,
                })}
              </h6>
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
            <div className="w-100 pl-2">
              <div className="case-study-image-container">
                <img
                  src={caseStudyImage}
                  className={`case-study-image img-thumbnail img-fluid mt-3 mb-3 ${
                    caseStudy.imgPath ? 'd-block' : 'd-none'
                  }`}
                  alt={ALT_MESSAGE}
                  onClick={(event: any) => {
                    onEnlargeImage(event);
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}

        {caseStudy !== {} && caseStudy.caseStudyType === CaseStudyOptions.StaffRecognition ? (
          <div style={{ display: 'flex', flex: '1 1 auto' }}>
            <div className="w-100 pr-2">
              <h2 className="mt-3 mb-3 fw-bold">
                {translateText('caseStudyFormStaffRecognitionCaseStudy')}
              </h2>
              <h6 className="fs-6 lh-base">
                Author: {caseStudy.user ? caseStudy.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 lh-base">
                Date:{' '}
                {new Date(caseStudy.createdAt).toLocaleDateString(language, {
                  timeZone: timezone,
                })}
              </h6>
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
            <div className="w-100 pl-2">
              <div className="case-study-image-container">
                <img
                  src={caseStudyImage}
                  className={`case-study-image img-thumbnail img-fluid mt-3 mb-3 ${
                    caseStudy.imgPath ? 'd-block' : 'd-none'
                  }`}
                  alt={ALT_MESSAGE}
                  onClick={(event: any) => {
                    onEnlargeImage(event);
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}

        {caseStudy !== {} && caseStudy.caseStudyType === CaseStudyOptions.TrainingSession ? (
          <div style={{ display: 'flex', flex: '1 1 auto' }}>
            <div className="w-100 pr-2">
              <h2 className="mt-3 mb-3 fw-bold">
                {translateText('caseStudyFormTrainingSessionCaseStudy')}
              </h2>
              <h6 className="fs-6 lh-base">
                Author: {caseStudy.user ? caseStudy.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 lh-base">
                Date:{' '}
                {new Date(caseStudy.createdAt).toLocaleDateString(language, {
                  timeZone: timezone,
                })}
              </h6>
              <h6 className="fs-6 fw-bold lh-base">{translateText('caseStudyFormTrainingDate')}</h6>
              <p className="fs-6 lh-base text-break">
                {new Date(caseStudy.trainingSession.trainingDate).toLocaleDateString(language, {
                  timeZone: timezone,
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
            <div className="w-100 pl-2">
              <div className="case-study-image-container">
                <img
                  src={caseStudyImage}
                  className={`case-study-image img-thumbnail img-fluid mt-3 mb-3 ${
                    caseStudy.imgPath ? 'd-block' : 'd-none'
                  }`}
                  alt={ALT_MESSAGE}
                  onClick={(event: any) => {
                    onEnlargeImage(event);
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}

        {caseStudy !== {} && caseStudy.caseStudyType === CaseStudyOptions.EquipmentReceived ? (
          <div style={{ display: 'flex', flex: '1 1 auto' }}>
            <div className="w-100 pr-2">
              <h2 className="mt-3 mb-3 fw-bold">
                {translateText('caseStudyFormEquipmentReceivedCaseStudy')}
              </h2>
              <h6 className="fs-6 lh-base">
                Author: {caseStudy.user ? caseStudy.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 lh-base">
                Date:{' '}
                {new Date(caseStudy.createdAt).toLocaleDateString(language, {
                  timeZone: timezone,
                })}
              </h6>
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
            <div className="w-100 pl-2">
              <div className="case-study-image-container">
                <img
                  src={caseStudyImage}
                  className={`case-study-image img-thumbnail img-fluid mt-3 mb-3 ${
                    caseStudy.imgPath ? 'd-block' : 'd-none'
                  }`}
                  alt={ALT_MESSAGE}
                  onClick={(event: any) => {
                    onEnlargeImage(event);
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}

        {caseStudy !== {} && caseStudy.caseStudyType === CaseStudyOptions.OtherStory ? (
          <div style={{ display: 'flex', flex: '1 1 auto' }}>
            <div className="w-100 pr-2">
              <h2 className="mt-3 mb-3 fw-bold">
                {translateText('caseStudyFormOtherStoryCaseStudy')}
              </h2>
              <h6 className="fs-6 lh-base">
                Author: {caseStudy.user ? caseStudy.user.name : '[deleted]'}
              </h6>
              <h6 className="fs-6 lh-base">
                Date:{' '}
                {new Date(caseStudy.createdAt).toLocaleDateString(language, {
                  timeZone: timezone,
                })}
              </h6>
              <h6 className="fs-6 fw-bold lh-base">
                {translateText('caseStudyFormCaseStudy/Story')}
              </h6>
              <p className="fs-6 lh-base text-break">{caseStudy.otherStory.caseStudyStory}</p>
            </div>
            <div className="w-100 pl-2">
              <div className="case-study-image-container">
                <img
                  src={caseStudyImage}
                  className={`case-study-image img-thumbnail img-fluid mt-3 mb-3 ${
                    caseStudy.imgPath ? 'd-block' : 'd-none'
                  }`}
                  alt={ALT_MESSAGE}
                  onClick={(event: any) => {
                    onEnlargeImage(event);
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
