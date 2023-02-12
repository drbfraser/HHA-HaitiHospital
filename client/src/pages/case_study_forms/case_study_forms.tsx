import { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { CaseStudyModel, CaseStudyOptions } from './CaseStudies';
import Api from 'actions/Api';
import { ENDPOINT_CASESTUDY_POST } from 'constants/endpoints';
import { TOAST_CASESTUDY_POST } from 'constants/toastErrorMessages';
import './case_study_form.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { imageCompressor } from 'utils/imageCompressor';

interface CaseStudyMainProps extends RouteComponentProps {}

export const CaseStudyForm = (props: CaseStudyMainProps) => {
  const [formOption, setformOption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, reset } = useForm<CaseStudyModel>({});
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
  } = useForm<CaseStudyModel>({});
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    reset: reset3,
  } = useForm<CaseStudyModel>({});
  const {
    register: register4,
    handleSubmit: handleSubmit4,
    reset: reset4,
  } = useForm<CaseStudyModel>({});
  const {
    register: register5,
    handleSubmit: handleSubmit5,
    reset: reset5,
  } = useForm<CaseStudyModel>({});

  const onImageUpload = (item: File) => {
    setSelectedFile(item);
  };

  const onSubmitActions = () => {
    toast.success('Case study successfully submitted!');
    reset({});
    reset2({});
    reset3({});
    reset4({});
    reset5({});
    setSelectedFile(null);
    props.history.push('/case-study');
  };

  const onSubmit = async (data: any) => {
    data.caseStudyType = formOption;
    let formData = new FormData();
    let postData = JSON.stringify(data);
    formData.append('document', postData);
    formData.append('file', selectedFile);

    await Api.Post(
      ENDPOINT_CASESTUDY_POST,
      formData,
      onSubmitActions,
      props.history,
      TOAST_CASESTUDY_POST
    );
  };
  const { t } = useTranslation();

  return (
    <div className={'case-study-form'}>
      <SideBar />

      <main className="container-fluid main-region">
        <Header />

        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to="/case-study">
            <button type="button" className="btn btn-outline-dark">
              {t('caseStudyFormBack')}
            </button>
          </Link>
        </div>

        <div>
          <form>
            <div className="form-group col-md-6">
              <label className="font-weight-bold">{t('caseStudyFormCaseStudyOptions')}</label>
              <select
                className="form-control"
                id="CaseStudyType"
                onChange={(e) => {
                  const selectedForm = e.target.value;
                  setformOption(selectedForm);
                }}
                defaultValue={''}
              >
                <option value="">{t('caseStudyFormClickToSelect')}</option>
                <option value={CaseStudyOptions.PatientStory}>
                  {t('caseStudyFormPatientStory')}
                </option>
                <option value={CaseStudyOptions.StaffRecognition}>
                  {t('caseStudyFormStaffRecognition')}
                </option>
                <option value={CaseStudyOptions.TrainingSession}>
                  {t('caseStudyFormTrainingSession')}
                </option>
                <option value={CaseStudyOptions.EquipmentReceived}>
                  {t('caseStudyFormEquipmentReceived')}
                </option>
                <option value={CaseStudyOptions.OtherStory}>{t('caseStudyFormOtherStory')}</option>
              </select>
            </div>
          </form>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`form-group col-md-6 ${
              formOption === CaseStudyOptions.PatientStory ? 'd-block' : 'd-none'
            }`}
            id="Form1"
          >
            <label className="font-weight-bold">{t('caseStudyFormPatientStoryCaseStudy')}</label>
            <div className="form-row">
              <div className="col-md-8">
                <label htmlFor="Patient Name">{t('caseStudyFormPatientName')}</label>
                <input
                  className="form-control mb-2 mt-0"
                  type="invalid"
                  id="Patient Name"
                  required
                  {...register('patientStory.patientsName', { required: true })}
                ></input>
                <div className="invalid-feedback">Please provide a valid zip.</div>
              </div>
              <div className="col-md-4">
                <label htmlFor="Patient Age">{t('caseStudyFormPatientAge')}</label>
                <input
                  className="form-control mb-2 mt-0"
                  type="number"
                  id="Patient Age"
                  required
                  {...register('patientStory.patientsAge', { required: true })}
                ></input>
              </div>
            </div>
            <label htmlFor="Patient From">{t('caseStudyFormWherePatientFrom')}</label>
            <input
              className="form-control mb-2 mt-0"
              type="text"
              id="Patient From"
              required
              {...register('patientStory.whereIsThePatientFrom', { required: true })}
            ></input>
            <label htmlFor="Patient Choose">{t('caseStudyFormWhyPatientChooseHCBH')}</label>
            <input
              className="form-control mb-2 mt-0"
              type="text"
              id="Patient Choose"
              required
              {...register('patientStory.whyComeToHcbh', { required: true })}
            ></input>
            <label htmlFor="How long">{t('caseStudyFormHowLongAtHCBH')}</label>
            <input
              className="form-control mb-2 mt-0"
              type="text"
              id="How long"
              required
              {...register('patientStory.howLongWereTheyAtHcbh', { required: true })}
            ></input>
            <label htmlFor="Diagnosis">{t('caseStudyFormWhatWasTheirDiagnosis')}</label>
            <textarea
              className="form-control mb-2 mt-0"
              id="Diagnosis"
              required
              {...register('patientStory.diagnosis', { required: true })}
            ></textarea>
            <label htmlFor="Case Study 1">{t('caseStudyFormCaseStudy/Story')}</label>
            <textarea
              className="form-control mb-2 mt-0"
              id="Case Study 1"
              required
              {...register('patientStory.caseStudyStory', { required: true })}
            ></textarea>
            <label className="form-label">{t('caseStudyFormUploadImage')}</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              id="customFilePatientStory"
              required
              onChange={(e) => imageCompressor(e.target.files[0], onImageUpload)}
            />
            <div className="form-check mt-2 mb-2">
              <input
                data-testid="case-study-patient-consent-check"
                className="form-check-input"
                type="checkbox"
                value=""
                id="invalidCheck1"
                required
              ></input>
              <label className="form-check-label" htmlFor="invalidCheck1">
                {t('caseStudyFormPermissionToShare')}
              </label>
            </div>
            <div className="mt-3 mb-5">
              <button
                data-testid="case-study-patient-submit-button"
                className="btn btn-primary"
                type="submit"
              >
                {t('caseStudyFormSubmitForm')}
              </button>
            </div>
          </div>
        </form>

        <form onSubmit={handleSubmit2(onSubmit)}>
          <div
            className={`form-group col-md-6 ${
              formOption === CaseStudyOptions.StaffRecognition ? 'd-block' : 'd-none'
            }`}
            id="Form2"
          >
            <label className="font-weight-bold">
              {t('caseStudyFormStaffRecognitionCaseStudy')}
            </label>
            <div className="form-row">
              <div className="col-md-6">
                <label htmlFor="Staff Name">{t('caseStudyFormStaffName')}</label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="Staff Name"
                  required
                  {...register2('staffRecognition.staffName', { required: true })}
                ></input>
              </div>
              <div className="col-md-6">
                <label htmlFor="Role">{t('caseStudyFormRoleJobTitle')}</label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="Role"
                  required
                  {...register2('staffRecognition.jobTitle', { required: true })}
                ></input>
              </div>
            </div>
            <label htmlFor="Which dept work">{t('caseStudyFormWhichDepartmentWorkIn')}</label>
            <input
              className="form-control mb-2 mt-0"
              type="text"
              id="Which dept work"
              required
              {...register2('staffRecognition.department', { required: true })}
            ></input>
            <label htmlFor="How long working">{t('caseStudyFormHowLongHaveBeenWorkingHCBH')}</label>
            <input
              className="form-control mb-2 mt-0"
              type="text"
              id="How long working"
              required
              {...register2('staffRecognition.howLongWorkingAtHcbh', { required: true })}
            ></input>
            <label htmlFor="What enjoy">{t('caseStudyFormWhatEnjoyTheMostAtHCBH')}</label>
            <textarea
              className="form-control mb-2 mt-0"
              id="What enjoy"
              required
              {...register2('staffRecognition.mostEnjoy', { required: true })}
            ></textarea>
            <label htmlFor="Case Study 2">{t('caseStudyFormCaseStudy/Story')}</label>
            <textarea
              className="form-control mb-2 mt-0"
              id="Case Study 2"
              required
              {...register2('staffRecognition.caseStudyStory', { required: true })}
            ></textarea>
            <label className="form-label">{t('caseStudyFormUploadImage')}</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              id="customFileStaffRecognition"
              required
              onChange={(e) => imageCompressor(e.target.files[0], onImageUpload)}
            />
            <div className="form-check mt-2 mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="invalidCheck2"
                required
              ></input>
              <label className="form-check-label" htmlFor="invalidCheck2">
                {t('caseStudyFormPermissionToShare')}
              </label>
            </div>
            <div className="mt-3 mb-5">
              <button className="btn btn-primary" type="submit">
                {t('caseStudyFormSubmitForm')}
              </button>
            </div>
          </div>
        </form>

        <form onSubmit={handleSubmit3(onSubmit)}>
          <div
            className={`form-group col-md-6 ${
              formOption === CaseStudyOptions.TrainingSession ? 'd-block' : 'd-none'
            }`}
            id="Form3"
          >
            <label className="font-weight-bold">{t('caseStudyFormTrainingSessionCaseStudy')}</label>
            <div className="form-row">
              <div className="col-md-6">
                <label htmlFor="Train Date">{t('caseStudyFormTrainingDate')}</label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="Train Date"
                  required
                  {...register3('trainingSession.trainingDate', { required: true })}
                ></input>
              </div>
              <div className="col-md-6">
                <label htmlFor="Train On">{t('caseStudyFormWhatWasTrainingOn')}</label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="Train On"
                  required
                  {...register3('trainingSession.trainingOn', { required: true })}
                ></input>
              </div>
            </div>
            <label htmlFor="Train Who">{t('caseStudyFormWhoConductedTraining')}</label>
            <input
              className="form-control mb-2"
              type="text"
              id="Train Who"
              required
              {...register3('trainingSession.whoConducted', { required: true })}
            ></input>
            <label htmlFor="Who attended">{t('caseStudyFormWhoAttendedTraining')}</label>
            <textarea
              className="form-control mb-2"
              id="Who attended"
              required
              {...register3('trainingSession.whoAttended', { required: true })}
            ></textarea>
            <label htmlFor="How train">{t('caseStudyFormHowWillTrainingBenefitHCBH')}</label>
            <textarea
              className="form-control mb-2"
              id="How train"
              required
              {...register3('trainingSession.benefitsFromTraining', { required: true })}
            ></textarea>
            <label htmlFor="Case Study 3">{t('caseStudyFormCaseStudy/Story')}</label>
            <textarea
              className="form-control mb-2"
              id="Case Study 3"
              required
              {...register3('trainingSession.caseStudyStory', { required: true })}
            ></textarea>
            <label className="form-label">{t('caseStudyFormUploadImage')}</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              id="customFileTrainingSession"
              required
              onChange={(e) => imageCompressor(e.target.files[0], onImageUpload)}
            />
            <div className="form-check mt-2 mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="invalidCheck3"
                required
              ></input>
              <label className="form-check-label" htmlFor="invalidCheck3">
                {t('caseStudyFormPermissionToShare')}
              </label>
            </div>
            <div className="mt-3 mb-5">
              <button className="btn btn-primary" type="submit">
                {t('caseStudyFormSubmitForm')}
              </button>
            </div>
          </div>
        </form>
        <form onSubmit={handleSubmit4(onSubmit)}>
          <div
            className={`form-group col-md-6 ${
              formOption === CaseStudyOptions.EquipmentReceived ? 'd-block' : 'd-none'
            }`}
            id="Form4"
          >
            <label className="font-weight-bold">
              {t('caseStudyFormEquipmentReceivedCaseStudy')}
            </label>
            <div className="form-row">
              <div className="col-md-6">
                <label htmlFor="What equipment">{t('caseStudyFormWhatEquipmentWasReceived')}</label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="What equipment"
                  required
                  {...register4('equipmentReceived.equipmentReceived', { required: true })}
                ></input>
              </div>
              <div className="col-md-6">
                <label htmlFor="Which dept receive">
                  {t('caseStudyFormWhichDepartmentReceivedIt')}
                </label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="Which dept receive"
                  required
                  {...register4('equipmentReceived.departmentReceived', { required: true })}
                ></input>
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-6">
                <label htmlFor="Equipment from">{t('caseStudyFormWhoWasEquipmentFrom')}</label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="Equipment from"
                  required
                  {...register4('equipmentReceived.whoSentEquipment', { required: true })}
                ></input>
              </div>
              <div className="col-md-6">
                <label htmlFor="Donate/Purchase">{t('caseStudyFormWasItDonatedOrPurchased')}</label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="Donate/Purchase"
                  required
                  {...register4('equipmentReceived.purchasedOrDonated', { required: true })}
                ></input>
              </div>
            </div>
            <label htmlFor="Equipment Purpose">
              {t('caseStudyFormWhatDoesThisNewEquipmentDo')}
            </label>
            <textarea
              className="form-control mb-2"
              id="Equipment Purpose"
              required
              {...register4('equipmentReceived.whatDoesEquipmentDo', { required: true })}
            ></textarea>
            <label htmlFor="Case Study 4">{t('caseStudyFormCaseStudy/Story')}</label>
            <textarea
              className="form-control mb-2"
              id="Case Study 4"
              required
              {...register4('equipmentReceived.caseStudyStory', { required: true })}
            ></textarea>
            <label className="form-label">{t('caseStudyFormUploadImage')}</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              id="customFileEquipmentReceived"
              required
              onChange={(e) => imageCompressor(e.target.files[0], onImageUpload)}
            />
            <div className="form-check mt-2 mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="invalidCheck4"
                required
              ></input>
              <label className="form-check-label" htmlFor="invalidCheck4">
                {t('caseStudyFormPermissionToShare')}
              </label>
            </div>
            <div className="mt-3 mb-5">
              <button className="btn btn-primary" type="submit">
                {t('caseStudyFormSubmitForm')}
              </button>
            </div>
          </div>
        </form>
        <form onSubmit={handleSubmit5(onSubmit)}>
          <div
            className={`form-group col-md-6 ${
              formOption === CaseStudyOptions.OtherStory ? 'd-block' : 'd-none'
            }`}
            id="Form5"
          >
            <label className="font-weight-bold">{t('caseStudyFormOtherStoryCaseStudy')}</label>
            <div>
              <label htmlFor="Case Study 5">{t('caseStudyFormCaseStudy/Story')}</label>
              <textarea
                className="form-control mb-2 mt-0"
                placeholder="Case Study/Story"
                id="Case Study 5"
                required
                {...register5('otherStory.caseStudyStory', { required: true })}
              ></textarea>
              <label className="form-label">{t('caseStudyFormUploadImage')}</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="customFileOtherCaseStudy"
                required
                onChange={(e) => imageCompressor(e.target.files[0], onImageUpload)}
              />
              <div className="form-check mt-2 mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="invalidCheck5"
                  required
                ></input>
                <label className="form-check-label" htmlFor="invalidCheck5">
                  {t('caseStudyFormPermissionToShare')}
                </label>
              </div>
            </div>
            <div className="mt-3 mb-5">
              <button className="btn btn-primary" type="submit">
                {t('caseStudyFormSubmitForm')}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
