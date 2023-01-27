import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { ReportForm } from 'components/report/question_form_fields';
import { ENDPOINT_TEMPLATE, ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { TOAST_DEPARTMENT_GET } from 'constants/toast_messages';
import Api from 'actions/Api';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useEffect, useState } from 'react';
import initialDepartments from 'utils/json/departments.json';
import { Department } from 'constants/interfaces';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import './styles.css';
import { useDepartmentData } from 'hooks';

type ID = string;
type ErrorType = string;

export const Report = () => {
  const history: History = useHistory<History>();
  const [reportTemplate, setReportTemplate] = useState<QuestionGroup<ID, ErrorType>>();
  const { departments } = useDepartmentData();
  const [currentDepartment, setCurrentDepartment] = useState<Department>();

  const clearCurrentDepartment = (): void => {
    setCurrentDepartment(undefined);
    setReportTemplate(undefined);
  };

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
            <ReportForm reportTemplate={reportTemplate} />
          </>
        )}
      </main>
    </div>
  );
};
