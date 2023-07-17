import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import { CaseStudyType } from 'pages/case_study/typing';
import { ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { History } from 'history';
import ImageModal from 'components/popup_modal/ImageModal';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

interface InfoRowProps {
  label: string;
  testid?: string;
  detail: string;
}

const InfoRow = ({ label, testid = '', detail }: InfoRowProps) => (
  <>
    <h6 className="fs-6 fw-bold lh-base">{label}</h6>
    <p data-testid={testid} className="fs-6 lh-base text-break">
      {detail}
    </p>
  </>
);

interface CaseStudyInfoProps {
  caseStudy: any;
  setTitle?: (title: string) => void;
  titleLabel?: string;
  infoRows?: InfoRowProps[];
  caseStudyStory: string;
}

const CaseStudyInfo = ({
  caseStudy,
  infoRows = [],
  caseStudyStory,
  setTitle,
  titleLabel,
}: CaseStudyInfoProps) => {
  const { t } = useTranslation();
  const author = caseStudy?.user?.name ?? t('status.not_available');

  const [imageModal, setImageModal] = useState<boolean>(false);
  const [caseStudyImage, setCaseStudyImage] = useState<string>(null);
  const history: History = useHistory<History>();

  const onEnlargeImage = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setImageModal(true);
  };

  const onModalImageClose = () => {
    setImageModal(false);
  };

  useEffect(() => {
    console.log('caseStudyStory', titleLabel);
    console.log('caseStudyStory', setTitle);
    setTitle && setTitle(t(titleLabel));
  }, [setTitle, t, titleLabel]);

  useEffect(() => {
    const getCaseStudyImage = async () => {
      setCaseStudyImage(await Api.Image(ENDPOINT_IMAGE_BY_PATH(caseStudy.imgPath), history));
    };

    caseStudy.imgPath && getCaseStudyImage();
  }, [caseStudy, history]);

  const imageComponent = (
    <>
      {caseStudyImage && (
        <img
          src={caseStudyImage}
          style={{ maxWidth: '400px', width: '100%', maxHeight: '500', cursor: 'pointer' }}
          alt="Case Study"
          className="d-flex mx-auto ms-xl-auto mt-3 mb-3"
          onClick={(event: any) => {
            onEnlargeImage(event);
          }}
        />
      )}
    </>
  );

  return (
    <>
      <ImageModal
        show={imageModal}
        item={'Case Study'}
        image={caseStudyImage}
        onModalClose={onModalImageClose}
        history={history}
        location={undefined}
        match={undefined}
      ></ImageModal>
      <div className="w-100">
        <div className="d-flex flex-column flex-xl-row">
          <div className="d-flex flex-column">
            <h6 className="fs-6 lh-base">
              {t('caseStudyViewAuthor')} {author}
            </h6>
            <h6 className="fs-6 lh-base">
              {t('caseStudyViewAuthor')} {caseStudy.createdAt}
            </h6>
            {infoRows.map((infoRow, index) => (
              <InfoRow
                key={index}
                label={t(infoRow.label)}
                testid={infoRow.testid}
                detail={infoRow.detail}
              />
            ))}
          </div>
          {imageComponent}
        </div>

        <InfoRow
          label={t('caseStudyFormCaseStudy/Story')}
          testid="case-study-patient-case-story"
          detail={caseStudyStory}
        />
      </div>
    </>
  );
};

const PatientStorySummary = ({ caseStudy, setTitle }) => (
  <CaseStudyInfo
    caseStudy={caseStudy}
    setTitle={setTitle}
    titleLabel="caseStudyFormPatientStoryCaseStudy"
    infoRows={[
      {
        label: 'caseStudyFormPatientName',
        testid: 'case-study-patient-name',
        detail: caseStudy.patientStory.patientsName,
      },
      {
        label: 'caseStudyFormPatientAge',
        testid: 'case-study-patient-age',
        detail: caseStudy.patientStory.patientsAge,
      },
      {
        label: 'caseStudyFormWherePatientFrom',
        testid: 'case-study-patient-from',
        detail: caseStudy.patientStory.whereIsThePatientFrom,
      },
      {
        label: 'caseStudyFormWhyPatientChooseHCBH',
        testid: 'case-study-patient-how-long',
        detail: caseStudy.patientStory.whyComeToHcbh,
      },
      {
        label: 'caseStudyFormHowLongAtHCBH',
        testid: 'case-study-patient-story',
        detail: caseStudy.patientStory.howLongAtHcbh,
      },
      {
        label: 'caseStudyFormWhatWasTheirDiagnosis',
        testid: 'case-study-patient-diagnosis',
        detail: caseStudy.patientStory.diagnosis,
      },
    ]}
    caseStudyStory={caseStudy.patientStory.caseStudyStory}
  />
);

const StaffRecognitionSummary = ({ caseStudy, setTitle }) => (
  <CaseStudyInfo
    caseStudy={caseStudy}
    setTitle={setTitle}
    titleLabel="caseStudyFormPatientStoryCaseStudy"
    infoRows={[
      {
        label: 'caseStudyFormStaffName',
        detail: caseStudy.staffRecognition.staffName,
      },
      {
        label: 'caseStudyFormRoleJobTitle',
        detail: caseStudy.staffRecognition.jobTitle,
      },
      {
        label: 'caseStudyFormWhichDepartmentWorkIn',
        detail: caseStudy.staffRecognition.department,
      },
      {
        label: 'caseStudyFormHowLongHaveBeenWorkingHCBH',
        detail: caseStudy.staffRecognition.howLongWorkingAtHcbh,
      },
      {
        label: 'caseStudyFormWhatEnjoyTheMostAtHCBH',
        detail: caseStudy.staffRecognition.mostEnjoy,
      },
    ]}
    caseStudyStory={caseStudy.staffRecognition.caseStudyStory}
  />
);

const TrainingSessionSummary = ({ caseStudy, setTitle }) => (
  <CaseStudyInfo
    caseStudy={caseStudy}
    setTitle={setTitle}
    titleLabel="caseStudyFormTrainingSessionCaseStudy"
    infoRows={[
      {
        label: 'caseStudyFormTrainingDate',
        detail: caseStudy.trainingSession.trainingDate,
      },
      {
        label: 'caseStudyFormWhatWasTrainingOn',
        detail: caseStudy.trainingSession.trainingOn,
      },
      {
        label: 'caseStudyFormWhoConductedTraining',
        detail: caseStudy.trainingSession.whoConducted,
      },
      {
        label: 'caseStudyFormWhoAttendedTraining',
        detail: caseStudy.trainingSession.whoAttended,
      },
      {
        label: 'caseStudyFormHowWillTrainingBenefitHCBH',
        detail: caseStudy.trainingSession.benefitsFromTraining,
      },
    ]}
    caseStudyStory={caseStudy.trainingSession.caseStudyStory}
  />
);

const EquipmentReceivedSummary = ({ caseStudy, setTitle }) => (
  <CaseStudyInfo
    caseStudy={caseStudy}
    setTitle={setTitle}
    titleLabel="caseStudyFormTrainingSessionCaseStudy"
    infoRows={[
      {
        label: 'caseStudyFormWhatEquipmentWasReceived',
        detail: caseStudy.equipmentReceived.equipmentReceived,
      },
      {
        label: 'caseStudyFormWhichDepartmentReceivedIt',
        detail: caseStudy.equipmentReceived.departmentReceived,
      },
      {
        label: 'caseStudyFormWhoWasEquipmentFrom',
        detail: caseStudy.equipmentReceived.whoSentEquipment,
      },
      {
        label: 'caseStudyFormWasItDonatedOrPurchased',
        detail: caseStudy.equipmentReceived.purchasedOrDonated,
      },
      {
        label: 'caseStudyFormWhatDoesThisNewEquipmentDo',
        detail: caseStudy.equipmentReceived.whatDoesEquipmentDo,
      },
    ]}
    caseStudyStory={caseStudy.equipmentReceived.caseStudyStory}
  />
);

const OtherStorySummary = ({ caseStudy, setTitle }) => (
  <CaseStudyInfo
    caseStudy={caseStudy}
    setTitle={setTitle}
    titleLabel="caseStudyFormOtherStoryCaseStudy"
    caseStudyStory={caseStudy.otherStory.caseStudyStory}
  />
);

interface CaseStudySummaryProps {
  caseStudy: any;
  setTitle?: (title: string) => void;
}

export const CaseStudySummary = ({ caseStudy, setTitle }: CaseStudySummaryProps) => (
  <>
    {caseStudy.caseStudyType === CaseStudyType.PatientStory && (
      <PatientStorySummary caseStudy={caseStudy} setTitle={setTitle} />
    )}
    {caseStudy.caseStudyType === CaseStudyType.StaffRecognition && (
      <StaffRecognitionSummary caseStudy={caseStudy} setTitle={setTitle} />
    )}
    {caseStudy.caseStudyType === CaseStudyType.TrainingSession && (
      <TrainingSessionSummary caseStudy={caseStudy} setTitle={setTitle} />
    )}
    {caseStudy.caseStudyType === CaseStudyType.EquipmentReceived && (
      <EquipmentReceivedSummary caseStudy={caseStudy} setTitle={setTitle} />
    )}
    {caseStudy.caseStudyType === CaseStudyType.OtherStory && (
      <OtherStorySummary caseStudy={caseStudy} setTitle={setTitle} />
    )}
  </>
);
