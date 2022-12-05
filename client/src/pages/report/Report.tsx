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
import { v4 as uuid } from 'uuid';

type ID = string;
type ErrorType = string;

export const Report = () => {
  const history: History = useHistory<History>();
  const [reportTemplate, setReportTemplate] = useState<QuestionGroup<ID, ErrorType>>();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments.departments);
  const [currentDepartment, setCurrentDepartment] = useState<Department>();

  useEffect(() => {
    const getDepartments = async () => {
      const fetchedDepartments = await Api.Get(
        ENDPOINT_DEPARTMENT_GET,
        TOAST_DEPARTMENT_GET,
        history,
      );
      setDepartments(fetchedDepartments);
    };

    const getTemplates = async (isMounted: boolean) => {
      if (isMounted && currentDepartment) {
        const fetchedTemplateObject = await Api.Get(
          `${ENDPOINT_TEMPLATE}/${currentDepartment.id}`,
          '',
          history,
        );
        const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
        const reportTemplateJson = fetchedTemplateObject.template.reportObject;

        const deserializedReportTemplate: QuestionGroup<ID, ErrorType> =
          objectSerializer.deserialize(JSON.stringify(reportTemplateJson));
        setReportTemplate(deserializedReportTemplate);
      }
    };

    let isMounted: boolean = true;
    getDepartments();
    getTemplates(isMounted);
  }, [currentDepartment, history]);

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        {departments && (
          <div className="col-md-6">
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
                    <option key={uuid()} value={id}>
                      {name}
                    </option>
                  ))}
              </select>
            </fieldset>
          </div>
        )}
        {reportTemplate && <ReportForm reportTemplate={reportTemplate} />}
      </main>
    </div>
  );
};
