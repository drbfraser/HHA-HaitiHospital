import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { buildQuestionFormField } from 'components/report/question_form_fields';
import { ENDPOINT_TEMPLATE, ENDPOINT_DEPARTMENT_GET } from 'constants/endpoints';
import { TOAST_DEPARTMENT_GET } from 'constants/toast_messages';
import Api from 'actions/Api';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useEffect, useState } from 'react';
import initialDepartments from 'utils/json/departments.json';
import { Department } from 'constants/interfaces';
import { ObjectSerializer, QuestionGroup } from '@hha/common';

type ID = string;
type ErrorType = string;

export const Report = () => {
  const history: History = useHistory<History>();
  const [reportTemplate, setReportTemplate] = useState<QuestionGroup<ID, ErrorType>>();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments.departments);
  const [departmentId, setDepartmentId] = useState<string>();

  useEffect(() => {
    const getDepartments = async () => {
      const fetchedDepartments = await Api.Get(
        ENDPOINT_DEPARTMENT_GET,
        TOAST_DEPARTMENT_GET,
        history,
      );
      setDepartments(fetchedDepartments);
      setDepartmentId(fetchedDepartments[0].id);
    };

    const getMessages = async (isMounted: boolean) => {
      if (isMounted && departmentId) {
        const fetchedTemplateObject = await Api.Get(
          `${ENDPOINT_TEMPLATE}/${departmentId}`,
          '',
          history,
        );
        const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
        // The JSON returned is inccorrect as it does not include class names
        const reportTemplateJson = fetchedTemplateObject.template.reportObject;

        const deserializedReportTemplate: QuestionGroup<ID, ErrorType> =
          objectSerializer.deserialize(JSON.stringify(reportTemplateJson));
        setReportTemplate(deserializedReportTemplate);
      }
    };

    let isMounted: boolean = true;
    getDepartments();
    getMessages(isMounted);
  }, [departmentId]);

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="mt-3">
          {departmentId && console.log(departments)}
          <section>
            <h1 className="text-start">Rehab Report</h1>
          </section>
          {reportTemplate && (
            <form className="col-md-6">{buildQuestionFormField(reportTemplate)}</form>
          )}
        </div>
      </main>
    </div>
  );
};
