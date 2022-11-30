import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { buildQuestionFormField } from 'components/report/question_form_fields';
import { ENDPOINT_TEMPLATE } from 'constants/endpoints';
import Api from 'actions/Api';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useEffect, useState } from 'react';
import { ObjectSerializer, QuestionGroup } from '@hha/common';

type ID = string;
type ErrorType = string;

export const Report = () => {
  const history: History = useHistory<History>();
  const [reportTemplate, setReportTemplate] = useState<QuestionGroup<ID, ErrorType>>();
  // Hard coded, please change for your own seeded department ID
  const rehabDepartmentId: string = '6386fe7529b8791e510fefef';

  useEffect(() => {
    const getMessages = async (isMounted: boolean) => {
      if (isMounted) {
        const fetchedTemplateObject = await Api.Get(
          `${ENDPOINT_TEMPLATE}/${rehabDepartmentId}`,
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
    getMessages(isMounted);
  });

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="mt-3">
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
