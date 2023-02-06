import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { ReportForm } from 'components/report/question_form_fields';
import { ENDPOINT_ADMIN_ME, ENDPOINT_REPORTS_POST, ENDPOINT_TEMPLATE } from 'constants/endpoints';
import Api from 'actions/Api';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useEffect, useState } from 'react';
import { Department } from 'constants/interfaces';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import './styles.css';
import { useDepartmentData } from 'hooks';

type ID = string;
type ErrorType = string;

export const Report = () => {
  const history: History = useHistory<History>();
  const [report, setReport] = useState<QuestionGroup<ID, ErrorType>>();
  const { departments } = useDepartmentData();
  const [currentDepartment, setCurrentDepartment] = useState<Department>();
  const [currentUser, setCurrentUser] = useState<ID>();

  const applyReportChanges = () => {
    const serializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
    setReport(serializer.deserialize(serializer.serialize(report)));
  };

  const clearCurrentDepartment = (): void => {
    setCurrentDepartment(undefined);
    setReport(undefined);
  };

  const submitReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const today = new Date();
    const reportObject = {
      departmentId: currentDepartment.id,
      reportMonth: new Date(today.getFullYear(), today.getMonth()),
      serializedReport: report,
      submittedUserId: currentUser,
    };
    console.log(reportObject);
    Api.Post(ENDPOINT_REPORTS_POST, reportObject, () => {}, '', history);
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      const fetchedUser = await Api.Get(ENDPOINT_ADMIN_ME, '', history);
      setCurrentUser(fetchedUser.id);
    };
    getCurrentUser();
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

        setReport(deserializedReportTemplate);
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
            <button className="btn btn-outline-secondary" onClick={clearCurrentDepartment}>
              <i className="bi bi-chevron-left me-2" />
              Choose Different Department
            </button>
            <ReportForm
              applyReportChanges={applyReportChanges}
              reportData={report}
              submitReport={submitReport}
            />
          </>
        )}
      </main>
    </div>
  );
};
