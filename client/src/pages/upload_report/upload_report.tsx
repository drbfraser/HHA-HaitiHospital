import SideBar from 'components/side_bar/side_bar';
import PopupModalConfirmation from 'components/popup_modal/PopupModalConfirmation';
import Header from 'components/header/header';
import { UploadForm } from 'components/upload_report/upload_report_form';
import { ENDPOINT_TEMPLATE } from 'constants/endpoints';
import { TOAST_REPORT_TEMPLATE_PUT as ERR_TOAST } from 'constants/toastErrorMessages';
import { TOAST_REPORT_TEMPLATE__PUT as PENDING_TOAST } from 'constants/toastPendingMessages';
import { TOAST_REPORT_TEMPLATE_PUT as SUCCESS_TOAST } from 'constants/toastSuccessMessages';
import Api from 'actions/Api';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useState } from 'react';
import { Department } from 'constants/interfaces';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import { useDepartmentData } from 'hooks';
import { toast } from 'react-toastify';

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
    await Api.Put(ENDPOINT_TEMPLATE, reportObject, onSubmit, ERR_TOAST, history);
  };

  const onSubmit = () => {
    toast.success(SUCCESS_TOAST);
    history.push(`/home`);
  };

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region bg-light h-screen">
        <Header />
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
          <div className="col-md-6 mb-5">
            <h1 className="text-start">{t('template.upload_template')}</h1>
            <fieldset>
              <label htmlFor="">{t('template.select_department')}</label>
              <select
                className="form-control"
                id="Report-Department-Type"
                onChange={(e) =>
                  setCurrentDepartment(departments.find(({ id, name }) => e.target.value === id))
                }
                value={currentDepartment?.id || ''}
              >
                <option value="">Choose a department</option>
                {departments &&
                  departments.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
              </select>
              {currentDepartment && (
                <UploadForm
                  formHandler={confirmSubmission}
                  isSubmitting={isSubmitting}
                  reportTemplateData={reportTemplate}
                  updateReport={setReportTemplate}
                />
              )}
            </fieldset>
          </div>
        )}
      </main>
    </div>
  );
};
