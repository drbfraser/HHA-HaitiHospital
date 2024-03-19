import { CaseStudy, CaseStudyType } from './typing';
import React, { useEffect, useState } from 'react';

import Api from 'actions/Api';
import { ENDPOINT_CASESTUDY_POST } from 'constants/endpoints';
import Layout from 'components/layout';
import { imageCompressor } from 'utils/imageCompressor';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResponseMessage } from 'utils';

export const CaseStudyForm = () => {
  const [formOption, setformOption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const { register, handleSubmit, reset } = useForm<CaseStudy>({});

  const { t } = useTranslation();
  const history = useHistory<History>();

  const onImageUpload = (item: File) => {
    setSelectedFile(item);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      imageCompressor(e.target.files[0], onImageUpload);
    }
  };

  useEffect(() => {
    reset({});
  }, [formOption, reset]);

  const onSubmitActions = () => {
    reset({});
    setSelectedFile(undefined);
    history.push('/case-study');
  };

  const onSubmit = async (data: any) => {
    data.caseStudyType = formOption;
    let formData = new FormData();
    let postData = JSON.stringify(data);
    formData.append('document', postData);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    await Api.Post(
      ENDPOINT_CASESTUDY_POST,
      formData,
      onSubmitActions,
      history,
      ResponseMessage.getMsgCreateCaseStudyFailed(),
      undefined,
      ResponseMessage.getMsgCreateCaseStudyOk(),
    );
  };

  return (
    <Layout showBackButton title={t('headerCaseStudyForm')}>
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
              <option value={CaseStudyType.PatientStory}>{t('caseStudyFormPatientStory')}</option>
              <option value={CaseStudyType.StaffRecognition}>
                {t('caseStudyFormStaffRecognition')}
              </option>
              <option value={CaseStudyType.TrainingSession}>
                {t('caseStudyFormTrainingSession')}
              </option>
              <option value={CaseStudyType.EquipmentReceived}>
                {t('caseStudyFormEquipmentReceived')}
              </option>
              <option value={CaseStudyType.OtherStory}>{t('caseStudyFormOtherStory')}</option>
            </select>
          </div>
        </form>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`form-group col-md-6`} id="Form">
          {formOption === CaseStudyType.PatientStory && (
            <>
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
                onChange={onImageChange}
              />
            </>
          )}

          {formOption === CaseStudyType.StaffRecognition && (
            <>
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
                    {...register('staffRecognition.staffName', { required: true })}
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="Role">{t('caseStudyFormRoleJobTitle')}</label>
                  <input
                    className="form-control mb-2 mt-0"
                    type="text"
                    id="Role"
                    required
                    {...register('staffRecognition.jobTitle', { required: true })}
                  ></input>
                </div>
              </div>
              <label htmlFor="Which dept work">{t('caseStudyFormWhichDepartmentWorkIn')}</label>
              <input
                className="form-control mb-2 mt-0"
                type="text"
                id="Which dept work"
                required
                {...register('staffRecognition.department', { required: true })}
              ></input>
              <label htmlFor="How long working">
                {t('caseStudyFormHowLongHaveBeenWorkingHCBH')}
              </label>
              <input
                className="form-control mb-2 mt-0"
                type="text"
                id="How long working"
                required
                {...register('staffRecognition.howLongWorkingAtHcbh', { required: true })}
              ></input>
              <label htmlFor="What enjoy">{t('caseStudyFormWhatEnjoyTheMostAtHCBH')}</label>
              <textarea
                className="form-control mb-2 mt-0"
                id="What enjoy"
                required
                {...register('staffRecognition.mostEnjoy', { required: true })}
              ></textarea>
              <label htmlFor="Case Study 2">{t('caseStudyFormCaseStudy/Story')}</label>
              <textarea
                className="form-control mb-2 mt-0"
                id="Case Study 2"
                required
                {...register('staffRecognition.caseStudyStory', { required: true })}
              ></textarea>
              <label className="form-label">{t('caseStudyFormUploadImage')}</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="customFileStaffRecognition"
                required
                onChange={onImageChange}
              />
            </>
          )}

          {formOption === CaseStudyType.TrainingSession && (
            <>
              <label className="font-weight-bold">
                {t('caseStudyFormTrainingSessionCaseStudy')}
              </label>
              <div className="form-row">
                <div className="col-md-6">
                  <label htmlFor="Train Date">{t('caseStudyFormTrainingDate')}</label>
                  <input
                    className="form-control mb-2 mt-0"
                    type="text"
                    id="Train Date"
                    required
                    {...register('trainingSession.trainingDate', { required: true })}
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="Train On">{t('caseStudyFormWhatWasTrainingOn')}</label>
                  <input
                    className="form-control mb-2 mt-0"
                    type="text"
                    id="Train On"
                    required
                    {...register('trainingSession.trainingOn', { required: true })}
                  ></input>
                </div>
              </div>
              <label htmlFor="Train Who">{t('caseStudyFormWhoConductedTraining')}</label>
              <input
                className="form-control mb-2"
                type="text"
                id="Train Who"
                required
                {...register('trainingSession.whoConducted', { required: true })}
              ></input>
              <label htmlFor="Who attended">{t('caseStudyFormWhoAttendedTraining')}</label>
              <textarea
                className="form-control mb-2"
                id="Who attended"
                required
                {...register('trainingSession.whoAttended', { required: true })}
              ></textarea>
              <label htmlFor="How train">{t('caseStudyFormHowWillTrainingBenefitHCBH')}</label>
              <textarea
                className="form-control mb-2"
                id="How train"
                required
                {...register('trainingSession.benefitsFromTraining', { required: true })}
              ></textarea>
              <label htmlFor="Case Study 3">{t('caseStudyFormCaseStudy/Story')}</label>
              <textarea
                className="form-control mb-2"
                id="Case Study 3"
                required
                {...register('trainingSession.caseStudyStory', { required: true })}
              ></textarea>
              <label className="form-label">{t('caseStudyFormUploadImage')}</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="customFileTrainingSession"
                required
                onChange={onImageChange}
              />
            </>
          )}

          {formOption === CaseStudyType.EquipmentReceived && (
            <>
              <label className="font-weight-bold">
                {t('caseStudyFormEquipmentReceivedCaseStudy')}
              </label>
              <div className="form-row">
                <div className="col-md-6">
                  <label htmlFor="What equipment">
                    {t('caseStudyFormWhatEquipmentWasReceived')}
                  </label>
                  <input
                    className="form-control mb-2 mt-0"
                    type="text"
                    id="What equipment"
                    required
                    {...register('equipmentReceived.equipmentReceived', { required: true })}
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
                    {...register('equipmentReceived.departmentReceived', { required: true })}
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
                    {...register('equipmentReceived.whoSentEquipment', { required: true })}
                  ></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="Donate/Purchase">
                    {t('caseStudyFormWasItDonatedOrPurchased')}
                  </label>
                  <input
                    className="form-control mb-2 mt-0"
                    type="text"
                    id="Donate/Purchase"
                    required
                    {...register('equipmentReceived.purchasedOrDonated', { required: true })}
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
                {...register('equipmentReceived.whatDoesEquipmentDo', { required: true })}
              ></textarea>
              <label htmlFor="Case Study 4">{t('caseStudyFormCaseStudy/Story')}</label>
              <textarea
                className="form-control mb-2"
                id="Case Study 4"
                required
                {...register('equipmentReceived.caseStudyStory', { required: true })}
              ></textarea>
              <label className="form-label">{t('caseStudyFormUploadImage')}</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                id="customFileEquipmentReceived"
                required
                onChange={onImageChange}
              />
            </>
          )}

          {formOption === CaseStudyType.OtherStory && (
            <>
              <label className="font-weight-bold">{t('caseStudyFormOtherStoryCaseStudy')}</label>
              <div>
                <label htmlFor="Case Study 5">{t('caseStudyFormCaseStudy/Story')}</label>
                <textarea
                  className="form-control mb-2 mt-0"
                  placeholder="Case Study/Story"
                  id="Case Study 5"
                  required
                  {...register('otherStory.caseStudyStory', { required: true })}
                ></textarea>
                <label className="form-label">{t('caseStudyFormUploadImage')}</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="customFileOtherCaseStudy"
                  required
                  onChange={onImageChange}
                />
              </div>
            </>
          )}
          {formOption && (
            <>
              <div className="form-check mt-2 mb-2">
                <input
                  data-testid="case-study-patient-consent-check"
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="invalidCheck"
                  required
                ></input>
                <label className="form-check-label" htmlFor="invalidCheck">
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
            </>
          )}
        </div>
      </form>
    </Layout>
  );
};
