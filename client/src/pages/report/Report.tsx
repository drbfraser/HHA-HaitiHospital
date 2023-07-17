import { ENDPOINT_REPORTS, ENDPOINT_TEMPLATE } from 'constants/endpoints';
import { FormEvent, useEffect, useState } from 'react';
import { NavigationInfo, navigate } from '../../components/report/utils';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import { Prompt, useHistory } from 'react-router-dom';

import Api from 'actions/Api';
import { Department } from 'constants/interfaces';
import { History } from 'history';
import Layout from 'components/layout';
import PopupModalConfirmation from 'components/popup_modal/PopupModalConfirmation';
import { ReportAndTemplateForm } from 'components/report_upload_form/ReportAndTemplateForm';
import ReportForm from 'components/report/ReportForm';
import { ResponseMessage } from 'utils/response_message';
import { UNSAVED_CHANGES_MSG } from 'constants/modal_messages';
import axios from 'axios';
import { generateFormId } from 'utils/generate_report_name';
import { useAuthState } from 'contexts';
import { useDepartmentData } from 'hooks';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();

  const applyReportChanges = () => {
    !areChangesMade && setAreChangesMade(true);
    setReport(objectSerializer.deserialize(objectSerializer.serialize(report)));
  };

  const clearCurrentDepartment = () => {
    setAreChangesMade(false);
    setCurrentDepartment(undefined);
    setReport(undefined);
  };

  const confirmSubmission = (event: FormEvent<HTMLFormElement>) => {
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

    setIsSubmitting(true);
    setIsShowingSubmissionModal(false);
    setAreChangesMade(false);

    Api.Post(
      ENDPOINT_REPORTS,
      reportObject,
      () => history.push(`/department/${currentDepartment.id}`),
      history,
      ResponseMessage.getMsgCreateReportFailed(),
      ResponseMessage.getMsgCreateReportPending(),
      ResponseMessage.getMsgCreateReportOk(),
    );
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
    // Set the Accept-Language header for Axios requests
    axios.defaults.headers.common['Accept-Language'] = i18n.language;
    return () => {
      controller.abort();
    };
  }, [currentDepartment, history, objectSerializer, i18n.language]);

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
    <div className="report-submission">
      <Layout
        className="bg-light h-screen"
        style={{
          left: '200px',
          position: 'absolute',
          width: 'calc(100% - 200px)',
        }}
      >
        <PopupModalConfirmation
          messages={[
            <>
              Please click <strong>Confirm</strong> to proceed with your submission. You'll be
              redirected to the main list of {currentDepartment?.name} reports.
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
            navigate(history, navigationInfo, clearCurrentDepartment);
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
          <ReportAndTemplateForm
            title={t('headerReport')}
            departmentLabel={t('headerReportDepartmentType')}
            departments={departments}
            currentDepartment={currentDepartment}
            setCurrentDepartment={setCurrentDepartment}
          />
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
              {t('headerReportChooseDifferentDepartment')}
            </button>
            <ReportForm
              applyReportChanges={applyReportChanges}
              formHandler={confirmSubmission}
              isSubmitting={isSubmitting}
              reportData={report}
            />
          </>
        )}
      </Layout>
    </div>
  );
};
