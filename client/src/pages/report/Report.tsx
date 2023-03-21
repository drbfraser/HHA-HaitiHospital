import SideBar from 'components/side_bar/side_bar';
import PopupModalConfirmation from 'components/popup_modal/PopupModalConfirmation';
import Header from 'components/header/header';
import { ReportForm } from 'components/report/report_form';
import { ENDPOINT_REPORTS, ENDPOINT_TEMPLATE } from 'constants/endpoints';
import { TOAST_REPORT_POST as ERR_TOAST } from 'constants/toastErrorMessages';
import { TOAST_REPORT_POST as PENDING_TOAST } from 'constants/toastPendingMessages';
import { TOAST_REPORT_POST as SUCCESS_TOAST } from 'constants/toastSuccessMessages';
import Api from 'actions/Api';
import { Prompt, useHistory } from 'react-router-dom';
import { Action, History, Location } from 'history';
import { useEffect, useState } from 'react';
import { Department } from 'constants/interfaces';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import { useDepartmentData } from 'hooks';
import { useAuthState } from 'contexts';
import { UNSAVED_CHANGES_MSG } from 'constants/modal_messages';

export type NavigationInfo = null | {
  action: Action;
  location: Location;
};

export const Report = () => {
  const [areChangesMade, setAreChangesMade] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department>();
  const [isShowingNavigationModal, setIsShowingNavigationModal] = useState(false);
  const [isShowingSubmissionModal, setIsShowingSubmissionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo>(null);
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType>>();
  const history: History = useHistory<History>();
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
  const user = useAuthState();
  const { departments } = useDepartmentData();

  const applyReportChanges = () => {
    !areChangesMade && setAreChangesMade(true);
    setReport(objectSerializer.deserialize(objectSerializer.serialize(report)));
  };

  const clearCurrentDepartment = () => {
    setAreChangesMade(false);
    setCurrentDepartment(undefined);
    setReport(undefined);
  };

  const confirmSubmission = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsShowingSubmissionModal(true);
  };

  const submitReport = () => {
    const today = new Date();
    const serializedReport = objectSerializer.serialize(report);
    const reportPrompt = serializedReport['prompt'];
    serializedReport['id'] = generateFormId(user?.userDetails?.name, reportPrompt);
    const reportObject = {
      departmentId: currentDepartment.id,
      reportMonth: new Date(today.getFullYear(), today.getMonth()),
      serializedReport,
      submittedUserId: user?.userDetails?.id,
      submittedBy: user?.userDetails?.name,
    };

    setIsShowingSubmissionModal(false);
    setIsSubmitting(true);
    Api.Post(
      ENDPOINT_REPORTS,
      reportObject,
      () => history.push(`/department/${currentDepartment.id}`),
      history,
      ERR_TOAST,
      PENDING_TOAST,
      SUCCESS_TOAST,
    );
  };

  // Generate a form ID based on the current date, time, and user ID
  const generateFormId = (userName: string, reportPrompt: string) => {
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
  };

  useEffect(() => {
    const controller = new AbortController();
    const getTemplates = async () => {
      try {
        const fetchedTemplateObject = await Api.Get(
          `${ENDPOINT_TEMPLATE}/${currentDepartment.id}`,
          '',
          history,
          controller.signal,
        );
        const reportTemplateJson = fetchedTemplateObject.template.reportObject;

        const deserializedReportTemplate: QuestionGroup<ID, ErrorType> =
          objectSerializer.deserialize(reportTemplateJson);

        setReport(deserializedReportTemplate);
      } catch (e) {
        clearCurrentDepartment();
      }
    };
    currentDepartment && getTemplates();
    return () => {
      controller.abort();
    };
  }, [currentDepartment, history, objectSerializer]);

  useEffect(() => {
    if (areChangesMade) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }

    return () => {
      window.onbeforeunload = undefined;
    };
  }, [areChangesMade]);

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region bg-light h-screen">
        <Header />
        <PopupModalConfirmation
          messages={[
            <>
              Please click <strong>Confirm</strong> to proceed with your submission. You'll be
              redirected to the main {currentDepartment?.name} view.
            </>,
            <>
              If you've made a mistake, please click <strong>Cancel</strong> instead.
            </>,
          ]}
          onModalCancel={() => setIsShowingSubmissionModal(false)}
          onModalProceed={submitReport}
          show={isShowingSubmissionModal}
          title={'Confirm Submission'}
        />
        <PopupModalConfirmation
          messages={[UNSAVED_CHANGES_MSG]}
          onModalCancel={() => {
            setIsShowingNavigationModal(false);
            setNavigationInfo(null);
          }}
          onModalProceed={() => {
            setIsShowingNavigationModal(false);
            setIsSubmitting(true);

            // Stay on the same page, but start over the submission process
            if (!navigationInfo) {
              clearCurrentDepartment();
            }
            // Proceed with the normal navigation
            else if (navigationInfo.action === 'POP') {
              history.goBack();
            } else if (navigationInfo.action === 'PUSH') {
              history.push(navigationInfo.location);
            } else if (navigationInfo.action === 'REPLACE') {
              history.replace(navigationInfo.location);
            }
          }}
          show={isShowingNavigationModal}
          title={'Discard Submission?'}
        />
        <Prompt
          message={(location, action) => {
            if (!navigationInfo && areChangesMade) {
              setIsShowingNavigationModal(true);
              setNavigationInfo({ action, location });
              return false;
            }
            return true;
          }}
          when={areChangesMade}
        />
        {!report && departments && (
          <div className="col-md-6 mb-5">
            <h1 className="text-start">Submit a report</h1>
            <fieldset>
              <label htmlFor="">Department Type</label>
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
            </fieldset>
          </div>
        )}
        {report && (
          <>
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                if (areChangesMade) {
                  setIsShowingNavigationModal(true);
                  setNavigationInfo(null);
                } else {
                  clearCurrentDepartment();
                }
              }}
            >
              <i className="bi bi-chevron-left me-2" />
              Choose Different Department
            </button>
            <ReportForm
              applyReportChanges={applyReportChanges}
              formHandler={confirmSubmission}
              isSubmitting={isSubmitting}
              reportData={report}
            />
          </>
        )}
      </main>
    </div>
  );
};
