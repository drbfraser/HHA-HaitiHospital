import Api from 'actions/Api';
import Layout from 'components/layout';
import PopupModalConfirmation from 'components/popup_modal/PopupModalConfirmation';
import { Department } from 'constants/interfaces';
import { ENDPOINT_TEMPLATE } from 'constants/endpoints';
import { History } from 'history';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import { ReportAndTemplateForm } from 'components/report_upload_form/reportAndUpload_form';
import { ResponseMessage } from '../../utils/response_message';
import { UploadForm } from 'components/template/template_form';
import { useDepartmentData } from 'hooks';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const UploadReport = () => {
  const { t } = useTranslation();
  const [currentDepartment, setCurrentDepartment] = useState<Department>();
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportTemplate, setReportTemplate] = useState<QuestionGroup<ID, ErrorType>>();
  const history: History = useHistory<History>();
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
  const { departments } = useDepartmentData();

  const confirmSubmission = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsShowingModal(true);
  };

  const submitReport = async () => {
    const serializedReport = objectSerializer.serialize(reportTemplate);
    const reportObject = {
      departmentId: currentDepartment.id,
      serializedReport,
    };

    setIsShowingModal(false);
    setIsSubmitting(true);
    await Api.Put(
      ENDPOINT_TEMPLATE,
      reportObject,
      onSubmit,
      history,
      ResponseMessage.getMsgUpdateReportTemplateFailed(),
      ResponseMessage.getMsgUpdateReportTemplatePending(),
      ResponseMessage.getMsgUpdateReportTemplateOk(),
    );
  };

  const onSubmit = () => history.push(`/home`);

  return (
    <div className="department">
      <Layout className=" bg-light h-screen">
        <PopupModalConfirmation
          messages={[
            <>
              Please click <strong>Confirm</strong> to proceed with your submission. You'll be
              redirected to the home page view.
            </>,
            <>
              If you've made a mistake, please click <strong>Cancel</strong> instead.
            </>,
          ]}
          onModalCancel={() => setIsShowingModal(false)}
          onModalProceed={submitReport}
          show={isShowingModal}
          title={'Confirm Submission'}
        />
        {departments && (
          <ReportAndTemplateForm
            title={t('template.upload_template')}
            departmentLabel={t('template.select_department')}
            departments={departments}
            currentDepartment={currentDepartment}
            setCurrentDepartment={setCurrentDepartment}
          />
        )}
        {currentDepartment && (
          <UploadForm
            formHandler={confirmSubmission}
            isSubmitting={isSubmitting}
            reportTemplateData={reportTemplate}
            updateReport={setReportTemplate}
          />
        )}
      </Layout>
    </div>
  );
};
