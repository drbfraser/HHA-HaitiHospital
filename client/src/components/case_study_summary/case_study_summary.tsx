import './case_study_summary.css';

import { language, timezone } from 'constants/timezones';
import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import { CaseStudyOptions } from 'pages/case_study_forms/CaseStudies';
import { ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { History } from 'history';
import ModalImage from 'components/popup_modal/popup_modal_image';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

export const CaseStudySummary = ({ caseStudy }) => {
  const ALT_MESSAGE: string = 'Case Study...';
  const { t } = useTranslation();
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [caseStudyImage, setCaseStudyImage] = useState<string>('');
  const history: History = useHistory<History>();
  const author: string = !!caseStudy.user ? caseStudy.user.name : t('status.not_available');

  const onEnlargeImage = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setImageModal(true);
  };

  const onModalImageClose = () => {
    setImageModal(false);
  };

  useEffect(() => {
    // Only execute once case study data has been successfully passed to this component
    const getCaseStudyImage = async () => {
      setCaseStudyImage(await Api.Image(ENDPOINT_IMAGE_BY_PATH(caseStudy.imgPath), history));
    };
    if (caseStudy.imgPath !== undefined) getCaseStudyImage();
  }, [caseStudy, history]);
  const imageComponent = (
    <div className="case-study-image-container w-100 pl-2">
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
  );
  return (
    <div className="case-study-container mb-5">
      <ModalImage
        show={imageModal}
        item={ALT_MESSAGE}
        image={caseStudyImage}
        onModalClose={onModalImageClose}
        history={history}
      ></ModalImage>
      <div className="case-study-subcontainer flex flex-col">
        {caseStudy.caseStudyType === CaseStudyOptions.PatientStory ? (
          <div className="w-100 pr-2">
            <div className="case-study-top-description">
              <div className="case-study-top-text">
                <h2 data-testid="case-study-title" className="mt-3 mb-3 fw-bold">
                  {t('caseStudyFormPatientStoryCaseStudy')}
                </h2>
                <h6 className="fs-6 lh-base">
                  {t('caseStudyViewAuthor')} {author}
                </h6>
                <h6 className="fs-6 lh-base">
                  {t('caseStudyViewAuthor')} {caseStudy.createdAt}
                </h6>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormPatientName')}</h6>
                <p data-testid="case-study-patient-name" className="fs-6 lh-base text-break">
                  {caseStudy.patientStory.patientsName}
                </p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormPatientAge')}</h6>
                <p data-testid="case-study-patient-age" className="fs-6 lh-base text-break">
                  {caseStudy.patientStory.patientsAge}
                </p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormWherePatientFrom')}</h6>
                <p data-testid="case-study-patient-from" className="fs-6 lh-base text-break">
                  {caseStudy.patientStory.whereIsThePatientFrom}
                </p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormWhyPatientChooseHCBH')}</h6>
                <p data-testid="case-study-patient-why-come" className="fs-6 lh-base text-break">
                  {caseStudy.patientStory.whyComeToHcbh}
                </p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormHowLongAtHCBH')}</h6>
                <p data-testid="case-study-patient-how-long" className="fs-6 lh-base text-break">
                  {caseStudy.patientStory.howLongWereTheyAtHcbh}
                </p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormWhatWasTheirDiagnosis')}</h6>
                <p data-testid="case-study-patient-diagnosis" className="fs-6 lh-base text-break">
                  {caseStudy.patientStory.diagnosis}
                </p>
              </div>
              {imageComponent}
            </div>

            <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormCaseStudy/Story')}</h6>
            <p data-testid="case-study-patient-case-story" className="fs-6 lh-base text-break">
              {caseStudy.patientStory.caseStudyStory}
            </p>
          </div>
        ) : null}

        {caseStudy.caseStudyType === CaseStudyOptions.StaffRecognition ? (
          <div className="w-100 pr-2">
            <div className="case-study-top-description">
              <div className="case-study-top-text">
                <h2 className="mt-3 mb-3 fw-bold" data-testid="case-study-title">
                  {t('caseStudyFormStaffRecognitionCaseStudy')}
                </h2>
                <h6 className="fs-6 lh-base">
                  {t('caseStudyViewAuthor')} {author}
                </h6>
                <h6 className="fs-6 lh-base">
                  {t('caseStudyViewAuthor')} {caseStudy.createdAt}
                </h6>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormStaffName')}</h6>
                <p className="fs-6 lh-base text-break">{caseStudy.staffRecognition.staffName}</p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormRoleJobTitle')}</h6>
                <p className="fs-6 lh-base text-break">{caseStudy.staffRecognition.jobTitle}</p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormWhichDepartmentWorkIn')}</h6>
                <p className="fs-6 lh-base text-break">{caseStudy.staffRecognition.department}</p>
                <h6 className="fs-6 fw-bold lh-base">
                  {t('caseStudyFormHowLongHaveBeenWorkingHCBH')}
                </h6>
                <p className="fs-6 lh-base text-break">
                  {caseStudy.staffRecognition.howLongWorkingAtHcbh}
                </p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormWhatEnjoyTheMostAtHCBH')}</h6>
                <p className="fs-6 lh-base text-break">{caseStudy.staffRecognition.mostEnjoy}</p>
              </div>
              {imageComponent}
            </div>

            <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormCaseStudy/Story')}</h6>
            <p className="fs-6 lh-base text-break">{caseStudy.staffRecognition.caseStudyStory}</p>
          </div>
        ) : null}

        {caseStudy.caseStudyType === CaseStudyOptions.TrainingSession ? (
          <div className="w-100 pr-2">
            <div className="case-study-top-description">
              <div className="case-study-top-text">
                <h2 className="mt-3 mb-3 fw-bold" data-testid="case-study-title">
                  {t('caseStudyFormTrainingSessionCaseStudy')}
                </h2>
                <h6 className="fs-6 lh-base">
                  {t('caseStudyViewAuthor')} {author}
                </h6>
                <h6 className="fs-6 lh-base">
                  {t('caseStudyViewAuthor')} {caseStudy.createdAt}
                </h6>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormTrainingDate')}</h6>
                <p className="fs-6 lh-base text-break">
                  {new Date(caseStudy.trainingSession.trainingDate).toLocaleDateString(language, {
                    timeZone: timezone,
                  })}
                </p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormWhatWasTrainingOn')}</h6>
                <p className="fs-6 lh-base text-break">{caseStudy.trainingSession.trainingOn}</p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormWhoConductedTraining')}</h6>
                <p className="fs-6 lh-base text-break">{caseStudy.trainingSession.whoConducted}</p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormWhoAttendedTraining')}</h6>
                <p className="fs-6 lh-base text-break">{caseStudy.trainingSession.whoAttended}</p>
                <h6 className="fs-6 fw-bold lh-base">
                  {t('caseStudyFormHowWillTrainingBenefitHCBH')}
                </h6>
                <p className="fs-6 lh-base text-break">
                  {caseStudy.trainingSession.benefitsFromTraining}
                </p>
              </div>
              {imageComponent}
            </div>

            <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormCaseStudy/Story')}</h6>
            <p className="fs-6 lh-base text-break">{caseStudy.trainingSession.caseStudyStory}</p>
          </div>
        ) : null}

        {caseStudy.caseStudyType === CaseStudyOptions.EquipmentReceived ? (
          <div className="w-100 pr-2">
            <div className="case-study-top-description">
              <div className="case-study-top-text">
                <h2 className="mt-3 mb-3 fw-bold" data-testid="case-study-title">
                  {t('caseStudyFormEquipmentReceivedCaseStudy')}
                </h2>
                <h6 className="fs-6 lh-base">
                  {t('caseStudyViewAuthor')} {author}
                </h6>
                <h6 className="fs-6 lh-base">
                  {t('caseStudyViewAuthor')} {caseStudy.createdAt}
                </h6>
                <h6 className="fs-6 fw-bold lh-base">
                  {t('caseStudyFormWhatEquipmentWasReceived')}
                </h6>
                <p className="fs-6 lh-base text-break">
                  {caseStudy.equipmentReceived.equipmentReceived}
                </p>
                <h6 className="fs-6 fw-bold lh-base">
                  {t('caseStudyFormWhichDepartmentReceivedIt')}
                </h6>
                <p className="fs-6 lh-base text-break">
                  {caseStudy.equipmentReceived.departmentReceived}
                </p>
                <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormWhoWasEquipmentFrom')}</h6>
                <p className="fs-6 lh-base text-break">
                  {caseStudy.equipmentReceived.whoSentEquipment}
                </p>
                <h6 className="fs-6 fw-bold lh-base">
                  {t('caseStudyFormWasItDonatedOrPurchased')}
                </h6>
                <p className="fs-6 lh-base text-break">
                  {caseStudy.equipmentReceived.purchasedOrDonated}
                </p>
                <h6 className="fs-6 fw-bold lh-base">
                  {t('caseStudyFormWhatDoesThisNewEquipmentDo')}
                </h6>
                <p className="fs-6 lh-base text-break">
                  {caseStudy.equipmentReceived.whatDoesEquipmentDo}
                </p>
              </div>
              {imageComponent}
            </div>

            <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormCaseStudy/Story')}</h6>
            <p className="fs-6 lh-base text-break">{caseStudy.equipmentReceived.caseStudyStory}</p>
          </div>
        ) : null}

        {caseStudy.caseStudyType === CaseStudyOptions.OtherStory ? (
          <div className="w-100 pr-2">
            <div className="case-study-top-description">
              <div className="case-study-top-text">
                <h2 className="mt-3 mb-3 fw-bold" data-testid="case-study-title">
                  {t('caseStudyFormOtherStoryCaseStudy')}
                </h2>
                <h6 className="fs-6 lh-base">
                  {t('caseStudyViewAuthor')} {author}
                </h6>
                <h6 className="fs-6 lh-base">
                  {t('caseStudyViewAuthor')} {caseStudy.createdAt}
                </h6>
              </div>
              {imageComponent}
            </div>

            <h6 className="fs-6 fw-bold lh-base">{t('caseStudyFormCaseStudy/Story')}</h6>
            <p className="fs-6 lh-base text-break">{caseStudy.otherStory.caseStudyStory}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
