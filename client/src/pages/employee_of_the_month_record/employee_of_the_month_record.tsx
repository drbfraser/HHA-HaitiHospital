import { Link, RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Api from 'actions/Api';
import { CaseStudySummary } from 'components/case_study_summary/case_study_summary';
import { ENDPOINT_CASESTUDY_GET_BY_ID } from 'constants/endpoints';
import { History } from 'history';
import Layout from 'components/layout';
import { TOAST_CASESTUDY_GET } from 'constants/toastErrorMessages';
import { useTranslation } from 'react-i18next';

import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month_form/EmployeeOfTheMonthModel';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month_summary/employee_of_the_month_summary';

import { Role } from 'constants/interfaces';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/toastErrorMessages';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';

interface Props extends RouteComponentProps {}

export const EmployeeOfTheMonthRecord = (props: Props) => {
  const [employeeOfTheMonth, setEmployeeOfTheMonth] = useState<EmployeeOfTheMonth>(null);
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  useEffect(() => {
    const controller = new AbortController();
    const getEmployeeOfTheMonth = async () => {
      setEmployeeOfTheMonth(
        await Api.Get(
          ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET,
          TOAST_EMPLOYEE_OF_THE_MONTH_GET,
          history,
          controller.signal,
        ),
      );
    };
    getEmployeeOfTheMonth();
    console.log(employeeOfTheMonth);

    return () => {
      console.log(employeeOfTheMonth);
      controller.abort();
    };
  }, [history]);

  return (
    <div className="employee-of-the-month-main">
      <Layout>
        {employeeOfTheMonth && (
          <EmployeeOfTheMonthSummary
            employee={employeeOfTheMonth}
            history={history}
            location={undefined}
            match={undefined}
          />
        )}
      </Layout>
    </div>
  );
};
