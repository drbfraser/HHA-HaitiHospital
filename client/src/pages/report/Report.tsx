import { ENDPOINT_REPORTS, ENDPOINT_TEMPLATE } from 'constants/endpoints';
import { FormEvent, useEffect, useState } from 'react';
import { NavigationInfo, navigate } from '../../components/report/utils';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import { Prompt, useHistory } from 'react-router-dom';

import Api from 'actions/Api';
import ConfirmationModal from 'components/popup_modal/ConfirmationModal';
import { Department, Role } from 'constants/interfaces';
import { History } from 'history';
import Layout from 'components/layout';
import { ReportAndTemplateForm } from 'components/report/ReportAndTemplateForm';
import ReportForm from 'components/report/ReportForm';
import { ResponseMessage } from 'utils/response_message';
import axios from 'axios';
import { generateFormId } from 'utils/generate_report_name';
import { useAuthState } from 'contexts';
import { useDepartmentData } from 'hooks';
import { Trans, useTranslation } from 'react-i18next';

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

  let { departments } = useDepartmentData();
  if (user.userDetails.role === Role.HeadOfDepartment) {
    departments = departments.filter(
      (department) => department.id === user.userDetails.department.id,
    );
  }
  const reportableDepartments = new Set(['NICU/Paeds', 'Maternity', 'Community & Health', 'Rehab']);
  const isReportableDepartment = (department) => {
    return reportableDepartments.has(department.name);
  };

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
    const reportPrompt = serializedReport['prompt'][i18n.language || 'en'];
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
      () => history.push(`general-reports`),
      history,
      ResponseMessage.getMsgCreateReportFailed(),
      ResponseMessage.getMsgCreateReportPending(),
      ResponseMessage.getMsgCreateReportOk(),
    );
  };

  useEffect(() => {
    console.log('currentDepartment', currentDepartment);
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
        console.log('reportTemplateJson', reportTemplateJson);

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
    <Layout title={t('headerReport')}>
      <ConfirmationModal
        messages={[
          <Trans i18nKey="reportConfirmationModal.submitReportConfirmBody" />,
          <Trans i18nKey="reportConfirmationModal.editReportCancelBody" />,
        ]}
        onModalCancel={() => setIsShowingSubmissionModal(false)}
        onModalProceed={submitReport}
        show={isShowingSubmissionModal}
        title={t('reportConfirmationModal.submitReportHeader')}
      />
      <ConfirmationModal
        messages={[t('reportConfirmationModal.LeaveWithUnsavedChanges')]}
        onModalCancel={() => {
          setIsShowingNavigationModal(false);
          setNavigationInfo(null);
        }}
        onModalProceed={() => {
          setIsShowingNavigationModal(false);
          navigate(history, navigationInfo, clearCurrentDepartment);
        }}
        show={isShowingNavigationModal}
        title={t('reportConfirmationModal.discardSubmitReportHeader')}
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
          departmentLabel={t('headerReportDepartmentType')}
          departments={departments.filter(isReportableDepartment)}
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
  );
};
