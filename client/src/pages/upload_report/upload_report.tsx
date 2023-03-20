import SideBar from 'components/side_bar/side_bar';
import PopupModalConfirmation from 'components/popup_modal/PopupModalConfirmation';
import Header from 'components/header/header';
import { UploadForm } from 'components/upload_report/upload_report_form';
import { ENDPOINT_REPORTS, ENDPOINT_TEMPLATE } from 'constants/endpoints';
import { TOAST_REPORT_POST as ERR_TOAST } from 'constants/toastErrorMessages';
import { TOAST_REPORT_POST as PENDING_TOAST } from 'constants/toastPendingMessages';
import { TOAST_REPORT_POST as SUCCESS_TOAST } from 'constants/toastSuccessMessages';
import Api from 'actions/Api';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useEffect, useState } from 'react';
import { Department } from 'constants/interfaces';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import { useDepartmentData } from 'hooks';
import { useAuthState } from 'contexts';

export const UploadReport = () => {
  const [currentDepartment, setCurrentDepartment] = useState<Department>();
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportTemplate, setReportTemplate] = useState<QuestionGroup<ID, ErrorType>>();
  const history: History = useHistory<History>();
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
  const user = useAuthState();
  const { departments } = useDepartmentData();

  const applyReportChanges = () => {
    setReportTemplate(objectSerializer.deserialize(objectSerializer.serialize(reportTemplate)));
  };

  const clearCurrentDepartment = (): void => {
    setCurrentDepartment(undefined);
    setReportTemplate(undefined);
  };

  const confirmSubmission = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsShowingModal(true);
  };

  const submitReport = () => {
    const serializedReport = objectSerializer.serialize(reportTemplate);
    const reportObject = {
      departmentId: currentDepartment.id,
      serializedReport,
    };

    setIsShowingModal(false);
    setIsSubmitting(true);
    Api.Post(
      ENDPOINT_TEMPLATE,
      reportObject,
      () => history.push(`/home`),
      history,
      ERR_TOAST,
      PENDING_TOAST,
      SUCCESS_TOAST,
    );
  };

  // Generate a form ID based on the current date, time, and user ID
  function generateFormId(userName, reportPrompt) {
    const words = userName.trim().split(/\s+/);
    let userId = '';
    let spaces = 0;
    for (const word of words) {
      if (spaces === 2) {
        break;
      }
      if (word.length > 0) {
        if (word.length >= 3) {
          userId += word.slice(0, 3).toLowerCase();
        } else {
          userId += word.toLowerCase();
        }
        spaces++;
      }
    }
    userId = userId.padEnd(6, 'x');
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    return `${reportPrompt}_${year}-${month}-${day}_${hour}-${minute}-${second}-${userId}`;
  }

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
            <h1 className="text-start">Submit a report template</h1>
            <fieldset>
              <label htmlFor="">
                Please select the Department that you are uploading a report template for
              </label>
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
                  applyReportChanges={applyReportChanges}
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
