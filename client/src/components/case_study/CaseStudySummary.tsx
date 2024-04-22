import { FormFieldDisplay, FormFieldDisplayProps } from 'components/form/FormFieldDisplay';
import { useCallback, useEffect, useState } from 'react';
import { CaseStudy, CaseStudyType } from '@hha/common';
import { FormDisplay } from 'components/form/FormDisplay';
import { History } from 'history';
import { ImageDisplay } from 'components/form/ImageDisplay';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getImage } from 'api/image';
import { toI18nDateString } from 'constants/date';

interface CaseStudyInfoProps {
  caseStudy: CaseStudy;
  setTitle?: (title: string) => void;
  titleLabel?: string;
  infoRows?: FormFieldDisplayProps[];
  caseStudyStory: string;
}

const CaseStudyInfo = ({
  caseStudy,
  infoRows = [],
  caseStudyStory,
  setTitle,
  titleLabel,
}: CaseStudyInfoProps) => {
  const { t, i18n } = useTranslation();
  const author = caseStudy?.user?.name ?? t('status.not_available');

  const [caseStudyImage, setCaseStudyImage] = useState<string>('');
  const history: History = useHistory<History>();

  const getCaseStudyImage = useCallback(async () => {
    const img = await getImage(caseStudy.imgPath, history);
    setCaseStudyImage(img);
  }, [caseStudy.imgPath, history]);

  useEffect(() => {
    setTitle && titleLabel && setTitle(t(titleLabel));
  }, [setTitle, t, titleLabel]);

  useEffect(() => {
    getCaseStudyImage();
  }, [getCaseStudyImage]);

  return (
    <FormDisplay>
      <div className="w-100 pr-2 d-flex flex-column gap-4">
        <FormFieldDisplay label={t('caseStudyViewAuthor')}>{author}</FormFieldDisplay>
        <FormFieldDisplay label={t('caseStudyViewCreatedAt')}>
          {toI18nDateString(caseStudy.createdAt, i18n.resolvedLanguage)}
        </FormFieldDisplay>
        {infoRows.map(({ label, ...props }, index) => (
          <FormFieldDisplay key={index} {...props} label={t(label)} />
        ))}
        <FormFieldDisplay
          label={t('caseStudyFormCaseStudy/Story')}
          testid="case-study-patient-case-story"
        >
          {caseStudyStory}
        </FormFieldDisplay>
      </div>
      {caseStudyImage && <ImageDisplay image={caseStudyImage} />}
    </FormDisplay>
  );
};

interface CaseStudySummaryProps {
  caseStudy: any;
  setTitle?: (title: string) => void;
}

const PatientStorySummary = ({ caseStudy, setTitle }: CaseStudySummaryProps) => (
  <CaseStudyInfo
    caseStudy={caseStudy}
    setTitle={setTitle}
    titleLabel="caseStudyFormPatientStoryCaseStudy"
    infoRows={[
      {
        label: 'caseStudyFormPatientName',
        testid: 'case-study-patient-name',
        children: caseStudy.patientStory.patientsName,
      },
      {
        label: 'caseStudyFormPatientAge',
        testid: 'case-study-patient-age',
        children: caseStudy.patientStory.patientsAge,
      },
      {
        label: 'caseStudyFormWherePatientFrom',
        testid: 'case-study-patient-from',
        children: caseStudy.patientStory.whereIsThePatientFrom,
      },
      {
        label: 'caseStudyFormWhyPatientChooseHCBH',
        testid: 'case-study-patient-why-come',
        children: caseStudy.patientStory.whyComeToHcbh,
      },
      {
        label: 'caseStudyFormHowLongAtHCBH',
        testid: 'case-study-patient-how-long',
        children: caseStudy.patientStory.howLongWereTheyAtHcbh,
      },
      {
        label: 'caseStudyFormWhatWasTheirDiagnosis',
        testid: 'case-study-patient-diagnosis',
        children: caseStudy.patientStory.diagnosis,
      },
    ]}
    caseStudyStory={caseStudy.patientStory.caseStudyStory}
  />
);

const StaffRecognitionSummary = ({ caseStudy, setTitle }: CaseStudySummaryProps) => (
  <CaseStudyInfo
    caseStudy={caseStudy}
    setTitle={setTitle}
    titleLabel="caseStudyFormPatientStoryCaseStudy"
    infoRows={[
      {
        label: 'caseStudyFormStaffName',
        children: caseStudy.staffRecognition.staffName,
      },
      {
        label: 'caseStudyFormRoleJobTitle',
        children: caseStudy.staffRecognition.jobTitle,
      },
      {
        label: 'caseStudyFormWhichDepartmentWorkIn',
        children: caseStudy.staffRecognition.department,
      },
      {
        label: 'caseStudyFormHowLongHaveBeenWorkingHCBH',
        children: caseStudy.staffRecognition.howLongWorkingAtHcbh,
      },
      {
        label: 'caseStudyFormWhatEnjoyTheMostAtHCBH',
        children: caseStudy.staffRecognition.mostEnjoy,
      },
    ]}
    caseStudyStory={caseStudy.staffRecognition.caseStudyStory}
  />
);

const TrainingSessionSummary = ({ caseStudy, setTitle }: CaseStudySummaryProps) => (
  <CaseStudyInfo
    caseStudy={caseStudy}
    setTitle={setTitle}
    titleLabel="caseStudyFormTrainingSessionCaseStudy"
    infoRows={[
      {
        label: 'caseStudyFormTrainingDate',
        children: caseStudy.trainingSession.trainingDate,
      },
      {
        label: 'caseStudyFormWhatWasTrainingOn',
        children: caseStudy.trainingSession.trainingOn,
      },
      {
        label: 'caseStudyFormWhoConductedTraining',
        children: caseStudy.trainingSession.whoConducted,
      },
      {
        label: 'caseStudyFormWhoAttendedTraining',
        children: caseStudy.trainingSession.whoAttended,
      },
      {
        label: 'caseStudyFormHowWillTrainingBenefitHCBH',
        children: caseStudy.trainingSession.benefitsFromTraining,
      },
    ]}
    caseStudyStory={caseStudy.trainingSession.caseStudyStory}
  />
);

const EquipmentReceivedSummary = ({ caseStudy, setTitle }: CaseStudySummaryProps) => (
  <CaseStudyInfo
    caseStudy={caseStudy}
    setTitle={setTitle}
    titleLabel="caseStudyFormTrainingSessionCaseStudy"
    infoRows={[
      {
        label: 'caseStudyFormWhatEquipmentWasReceived',
        children: caseStudy.equipmentReceived.equipmentReceived,
      },
      {
        label: 'caseStudyFormWhichDepartmentReceivedIt',
        children: caseStudy.equipmentReceived.departmentReceived,
      },
      {
        label: 'caseStudyFormWhoWasEquipmentFrom',
        children: caseStudy.equipmentReceived.whoSentEquipment,
      },
      {
        label: 'caseStudyFormWasItDonatedOrPurchased',
        children: caseStudy.equipmentReceived.purchasedOrDonated,
      },
      {
        label: 'caseStudyFormWhatDoesThisNewEquipmentDo',
        children: caseStudy.equipmentReceived.whatDoesEquipmentDo,
      },
    ]}
    caseStudyStory={caseStudy.equipmentReceived.caseStudyStory}
  />
);

const OtherStorySummary = ({ caseStudy, setTitle }: CaseStudySummaryProps) => (
  <CaseStudyInfo
    caseStudy={caseStudy}
    setTitle={setTitle}
    titleLabel="caseStudyFormOtherStoryCaseStudy"
    caseStudyStory={caseStudy.otherStory.caseStudyStory}
  />
);

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
