import { FormEvent, useEffect, useState } from 'react';
import { NavigationInfo, navigate } from '../../components/report/utils';
import { ObjectSerializer, QuestionGroup, DepartmentJson as Department, Role } from '@hha/common';
import { Prompt, useHistory } from 'react-router-dom';
import ConfirmationModal from 'components/popup_modal/ConfirmationModal';
import { History } from 'history';
import Layout from 'components/layout';
import { ReportAndTemplateForm } from 'components/report/ReportAndTemplateForm';
import ReportForm from 'components/report/ReportForm';
import axios from 'axios';
import { generateFormId } from 'utils/generate_report_name';
import { useAuthState } from 'contexts';
import { useDepartmentData } from 'hooks';
import { Trans, useTranslation } from 'react-i18next';
import { monthYearOptions, userLocale } from 'constants/date';
import { addReport, getReportTemplate } from 'api/report';

export const Report = () => {
  const [areChangesMade, setAreChangesMade] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department>();
  const [isShowingNavigationModal, setIsShowingNavigationModal] = useState(false);
  const [isShowingSubmissionModal, setIsShowingSubmissionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo>(null);
  const [isDraft, setIsDraft] = useState<boolean>(true);
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType>>();
  const [reportMonth, setReportMonth] = useState<Date>();
  const [isTemplateSelected, setIsTemplateSelected] = useState<Boolean>(false);
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
  const isReportableDepartment = (department: Department) => {
    return reportableDepartments.has(department.name);
  };
  const isMonthAndDepartmentSelected = !!reportMonth && !!report;

  const { t, i18n } = useTranslation();

  const applyReportChanges = () => {
    !areChangesMade && setAreChangesMade(true);
    setReport(objectSerializer.deserialize(objectSerializer.serialize(report! as Object)));
  };

  const clearCurrentReport = () => {
    setAreChangesMade(false);
    setCurrentDepartment(undefined);
    setReport(undefined);
    setReportMonth(undefined);
    setIsTemplateSelected(false);
  };

  const confirmSubmission = (event: FormEvent<HTMLFormElement>, isDraft: boolean) => {
    event.preventDefault();
    setIsDraft(isDraft);
    setIsShowingSubmissionModal(true);
  };

  const submitReport = () => {
    if (currentDepartment === undefined) {
      console.error('Department is undefined in submitReport');
      return;
    }

    const serializedReport = objectSerializer.serialize(report! as Object) as any; // TBD
    const reportPrompt = serializedReport['prompt'][i18n.resolvedLanguage];
    serializedReport['id'] = generateFormId(user?.userDetails?.name, reportPrompt);
    const reportObject = {
      departmentId: currentDepartment.id,
      reportMonth: reportMonth,
      serializedReport,
      submittedUserId: user?.userDetails?.id,
      submittedBy: user?.userDetails?.name,
      isDraft: isDraft,
    };
    setIsSubmitting(true);
    setIsShowingSubmissionModal(false);
    setAreChangesMade(false);
    addReport(reportObject, history);
  };

  useEffect(() => {
    const controller = new AbortController();
    const getTemplates = async () => {
      try {
        if (currentDepartment === undefined) {
          console.error('Department is undefined when fetching in getTemplates');
          return;
        }
        const fetchedTemplateObject = await getReportTemplate(currentDepartment.id, history);

        const reportTemplateJson = fetchedTemplateObject.template.reportObject;

        const deserializedReportTemplate: QuestionGroup<ID, ErrorType> =
          objectSerializer.deserialize(reportTemplateJson);

        setReport(deserializedReportTemplate);
      } catch (e) {
        clearCurrentReport();
      }
    };
    currentDepartment && getTemplates();
    // Set the Accept-Language header for Axios requests
    axios.defaults.headers.common['Accept-Language'] = i18n.resolvedLanguage;
    return () => {
      controller.abort();
    };
  }, [currentDepartment, reportMonth, history, objectSerializer, i18n.resolvedLanguage]);

  useEffect(() => {
    if (areChangesMade) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = () => false;
    }

    return () => {
      window.onbeforeunload = () => false;
    };
  }, [areChangesMade]);

  const reportMonthString = reportMonth?.toLocaleDateString(userLocale, monthYearOptions);

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
          navigate(history, navigationInfo, clearCurrentReport);
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
      {/* Conditional rendering happens here, see https://react.dev/learn/conditional-rendering#logical-and-operator- */}
      {!isTemplateSelected && departments && (
        <>
          <ReportAndTemplateForm
            departmentLabel={t('headerReportDepartmentType')}
            monthLabel={t('headerReportMonth')}
            departments={departments.filter(isReportableDepartment)}
            currentDepartment={currentDepartment!}
            setCurrentDepartment={setCurrentDepartment}
            reportMonth={reportMonth!}
            setReportMonth={setReportMonth}
          />
          <button
            className={`btn ${isMonthAndDepartmentSelected ? 'btn-primary' : 'btn-secondary'}`}
            name="submit"
            disabled={!isMonthAndDepartmentSelected}
            type="submit"
            onClick={() => setIsTemplateSelected(true)}
          >
            {t('departmentFormNext')}
          </button>
        </>
      )}
      {isTemplateSelected && report && (
        <>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              if (areChangesMade) {
                setIsShowingNavigationModal(true);
                setNavigationInfo(null);
              } else {
                clearCurrentReport();
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
            readOnly={false}
            reportMonth={reportMonthString}
          />
        </>
      )}
    </Layout>
  );
};
