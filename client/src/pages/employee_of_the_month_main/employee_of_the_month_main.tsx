import { Link, RouteComponentProps } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month_form/EmployeeOfTheMonthModel';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month_summary/employee_of_the_month_summary';
import { History } from 'history';
import Layout from 'components/layout';
import { Role } from 'constants/interfaces';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/toastErrorMessages';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

interface EmployeeOfTheMonthMainProps extends RouteComponentProps {}

export const EmployeeOfTheMonthMain = (props: EmployeeOfTheMonthMainProps) => {
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
    return () => {
      controller.abort();
    };
  }, [history]);

  return (
    <Layout>
      {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
        <div className="d-flex justify-content-start">
          <Link to="/employee-of-the-month/form">
            <button data-testid="update-eotm-button" type="button" className="btn btn-outline-dark">
              {t('employeeOfTheMonthEdit')}
            </button>
          </Link>
        </div>
      )}
      {employeeOfTheMonth && (
        <EmployeeOfTheMonthSummary
          employee={employeeOfTheMonth}
          history={history}
          location={undefined}
          match={undefined}
        />
      )}
    </Layout>
  );
};
