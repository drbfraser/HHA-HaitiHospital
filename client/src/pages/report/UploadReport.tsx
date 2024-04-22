import { ObjectSerializer, QuestionGroup } from '@hha/common';
import ConfirmationModal from 'components/popup_modal/ConfirmationModal';
import { DepartmentJson as Department } from '@hha/common';
import { History } from 'history';
import Layout from 'components/layout';
import { ReportAndTemplateForm } from 'components/report/ReportAndTemplateForm';
import { UploadForm } from 'components/upload_template/UploadForm';
import { useDepartmentData } from 'hooks';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateReportTemplate } from 'api/report';

export const UploadReport = () => {
  const { t } = useTranslation();
  const [currentDepartment, setCurrentDepartment] = useState<Department>();
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportTemplate, setReportTemplate] = useState<QuestionGroup<ID, ErrorType> | null>(null);
  const history: History = useHistory<History>();
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
  const [reportMonth, setReportMonth] = useState<Date>();
  const { departments } = useDepartmentData();

  const confirmSubmission = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsShowingModal(true);
  };

  const submitReport = async () => {
    if (!reportTemplate) {
      console.error('Report template is not found when submitting report.');
      return;
    }
    if (!currentDepartment) {
      console.error('Current department is not found when submitting report.');
      return;
    }
    const serializedReport = objectSerializer.serialize(reportTemplate);
    const reportObject = {
      departmentId: currentDepartment.id,
      serializedReport,
    };
    setIsShowingModal(false);
    setIsSubmitting(true);
    await updateReportTemplate(reportObject, onSubmit, history);
  };

  const onSubmit = () => history.push(`/home`);

  return (
    <Layout title={t('template.upload_template')}>
      <ConfirmationModal
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
          departmentLabel={t('template.select_department')}
          monthLabel={t('headerReportMonth')}
          departments={departments}
          currentDepartment={currentDepartment}
          setCurrentDepartment={setCurrentDepartment}
          reportMonth={reportMonth}
          setReportMonth={setReportMonth}
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
  );
};
