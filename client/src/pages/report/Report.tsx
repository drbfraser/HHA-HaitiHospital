import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { ReportForm } from 'components/report/question_form_fields';
import { ENDPOINT_ADMIN_ME, ENDPOINT_DEPARTMENT_GET, ENDPOINT_REPORTS_POST, ENDPOINT_TEMPLATE } from 'constants/endpoints';
import { TOAST_DEPARTMENT_GET } from 'constants/toast_messages';
import Api from 'actions/Api';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useEffect, useState } from 'react';
import initialDepartments from 'utils/json/departments.json';
import { Department } from 'constants/interfaces';
import { JsonReportItems, ObjectSerializer, QuestionGroup } from '@hha/common';
import './styles.css';

type ID = string;
type ErrorType = string;

export const Report = () => {
  const history: History = useHistory<History>();
  const [reportTemplate, setReportTemplate] = useState<QuestionGroup<ID, ErrorType>>();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments.departments);
  const [currentDepartment, setCurrentDepartment] = useState<Department>();
  const [currentUser, setCurrentUser] = useState<ID>();

  const clearCurrentDepartment = (): void => {
    setCurrentDepartment(undefined);
    setReportTemplate(undefined);
  };

  const submitReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData);

    const reportObject: JsonReportItems = []
    formData.forEach((value, key) => reportObject.push({
      answer: [[value]],
      description: key,
      type: ""
    }));
    const report = {
      departmentId: currentDepartment.id,
      serializedReport: reportObject,
      submittedUserId: currentUser
    };
    console.log(report);
    //Api.Post(ENDPOINT_REPORTS_POST, report, () => {}, "", history);
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const fetchedUser = await Api.Get(
        ENDPOINT_ADMIN_ME,
        "",
        history,
      );
      setCurrentUser(fetchedUser.id);
    }
    const getDepartments = async () => {
      const fetchedDepartments = await Api.Get(
        ENDPOINT_DEPARTMENT_GET,
        TOAST_DEPARTMENT_GET,
        history,
      );
      setDepartments(fetchedDepartments);
    };

    getCurrentUser();
    getDepartments();
  }, [history]);

  useEffect(() => {
    const getTemplates = async () => {
      try {
        const fetchedTemplateObject = await Api.Get(
          `${ENDPOINT_TEMPLATE}/${currentDepartment.id}`,
          '',
          history,
        );
        const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
        const reportTemplateJson = fetchedTemplateObject.template.reportObject;

        const deserializedReportTemplate: QuestionGroup<ID, ErrorType> =
          objectSerializer.deserialize(reportTemplateJson);

        setReportTemplate(deserializedReportTemplate);
      } catch (e) {
        clearCurrentDepartment();
      }
    };
    currentDepartment && getTemplates();
  }, [currentDepartment, history]);

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region bg-light h-screen">
        <Header />
        {!reportTemplate && departments && (
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
        {reportTemplate && (
          <>
            <button className="btn btn-outline-secondary" onClick={clearCurrentDepartment}>
              <i className="bi bi-chevron-left me-2" />
              Choose Different Department
            </button>
            <ReportForm reportTemplate={reportTemplate} submitReport={submitReport}/>
          </>
        )}
      </main>
    </div>
  );
};
