import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month_summary/employee_of_the_month_summary';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/toastErrorMessages';
import Api from '../../actions/Api';
import './employee_of_the_month_main.css';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'contexts';
import { renderBasedOnRole } from 'actions/roleActions';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month_form/EmployeeOfTheMonthModel';
import initialEmployeeOfTheMonth from './initialEmployeeOfTheMonth.json';
import { History } from 'history';

interface EmployeeOfTheMonthMainProps extends RouteComponentProps {}

export const EmployeeOfTheMonthMain = (props: EmployeeOfTheMonthMainProps) => {
  const [employeeOfTheMonth, setEmployeeOfTheMonth] = useState<EmployeeOfTheMonth>(
    initialEmployeeOfTheMonth as unknown as EmployeeOfTheMonth,
  );
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t: translateText } = useTranslation();

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
    <div className="employee-of-the-month-main">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
          <div className="d-flex justify-content-start">
            <Link to="/employee-of-the-month/form">
              <button
                data-testid="update-eotm-button"
                type="button"
                className="btn btn-outline-dark"
              >
                {translateText('employeeOfTheMonthEdit')}
              </button>
            </Link>
          </div>
        ) : null}

        <div className="my-3 p-2 bg-body rounded shadow-sm mb-3">
          <EmployeeOfTheMonthSummary
            employeeOfTheMonth={employeeOfTheMonth}
            history={history}
            location={undefined}
            match={undefined}
          />
        </div>
      </main>
    </div>
  );
};
